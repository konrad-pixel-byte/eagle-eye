import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getResend, FROM_EMAIL } from "@/lib/resend";
import { renderNewTenderAlert } from "@/lib/emails/new-tender-alert";
import { recordCronHeartbeat } from "@/lib/cron-heartbeat";

const MAX_TENDERS_PER_USER = 3;

function getBaseUrl(request: NextRequest): string {
  return process.env.NEXT_PUBLIC_APP_URL ?? request.nextUrl.origin;
}

function isAuthorized(request: NextRequest): boolean {
  const cronSecret = process.env.CRON_SECRET;
  if (!cronSecret) return false;

  const authHeader = request.headers.get("Authorization");
  return authHeader === `Bearer ${cronSecret}`;
}

interface Profile {
  id: string;
  email: string | null;
  preferred_regions: string[] | null;
  preferred_cpv_codes: string[] | null;
}

interface MatchedTender {
  id: string;
  title: string;
  contracting_authority: string | null;
  voivodeship: string | null;
  cpv_codes: string[] | null;
  budget_max: number | null;
  deadline_submission: string | null;
  ai_relevance_score: number | null;
}

function matchesCpv(tenderCpvs: string[] | null, userPrefs: string[] | null): boolean {
  if (!userPrefs || userPrefs.length === 0) return true; // no preference = match all
  if (!tenderCpvs || tenderCpvs.length === 0) return false;
  return tenderCpvs.some((code) =>
    userPrefs.some((pref) => code === pref || code.startsWith(pref.slice(0, 5)))
  );
}

async function findMatchingTenders(
  admin: ReturnType<typeof createAdminClient>,
  profile: Profile
): Promise<MatchedTender[]> {
  const since = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();

  let query = admin
    .from("tenders")
    .select(
      "id, title, contracting_authority, voivodeship, cpv_codes, budget_max, deadline_submission, ai_relevance_score"
    )
    .eq("status", "active")
    .gte("created_at", since);

  if (profile.preferred_regions && profile.preferred_regions.length > 0) {
    query = query.in("voivodeship", profile.preferred_regions);
  }

  const { data, error } = await query
    .order("ai_relevance_score", { ascending: false, nullsFirst: false })
    .limit(50);

  if (error || !data) return [];

  const filtered = (data as MatchedTender[]).filter((t) =>
    matchesCpv(t.cpv_codes, profile.preferred_cpv_codes)
  );

  return filtered.slice(0, MAX_TENDERS_PER_USER);
}

async function sendDigestEmails(
  profile: Profile,
  tenders: MatchedTender[],
  baseUrl: string
): Promise<{ sent: number; errors: number }> {
  if (!profile.email) return { sent: 0, errors: 0 };

  let sent = 0;
  let errors = 0;
  const resend = getResend();

  for (const tender of tenders) {
    const scoreRaw = tender.ai_relevance_score;
    // Normalize score: DB may store 0-1 or 0-100 depending on analyzer; template expects 0-1
    const normalizedScore =
      scoreRaw === null ? null : scoreRaw > 1 ? scoreRaw / 100 : scoreRaw;

    const html = renderNewTenderAlert({
      tenderTitle: tender.title,
      contractingAuthority: tender.contracting_authority ?? "Nieznany",
      voivodeship: tender.voivodeship ?? "Nieznane",
      budgetMax: tender.budget_max,
      deadline: tender.deadline_submission,
      aiScore: normalizedScore,
      tenderId: tender.id,
      baseUrl,
    });

    const { error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: profile.email,
      subject: `Nowy przetarg: ${tender.title.slice(0, 80)}`,
      html,
    });

    if (error) {
      console.error(`[send-daily] email send failed for ${profile.email}:`, error);
      errors++;
    } else {
      sent++;
    }
  }

  return { sent, errors };
}

export async function POST(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const startedAt = Date.now();
  const admin = createAdminClient();
  const baseUrl = getBaseUrl(request);

  const { data: profiles, error: profilesError } = await admin
    .from("profiles")
    .select("id, email, preferred_regions, preferred_cpv_codes")
    .eq("notification_email", true)
    .not("email", "is", null);

  if (profilesError) {
    console.error("[send-daily] profiles query failed:", profilesError.message);
    void recordCronHeartbeat({
      job: "notifications-daily",
      status: "fail",
      durationMs: Date.now() - startedAt,
      details: { error: profilesError.message },
    });
    return NextResponse.json(
      { error: "Błąd pobierania profili użytkowników" },
      { status: 500 }
    );
  }

  if (!profiles || profiles.length === 0) {
    void recordCronHeartbeat({
      job: "notifications-daily",
      status: "ok",
      durationMs: Date.now() - startedAt,
      details: { usersScanned: 0, emailsSent: 0 },
    });
    return NextResponse.json({
      message: "Brak użytkowników do powiadomienia",
      sent: 0,
    });
  }

  let totalSent = 0;
  let totalErrors = 0;
  let usersNotified = 0;
  let usersScanned = 0;

  for (const profile of profiles as Profile[]) {
    usersScanned++;
    const tenders = await findMatchingTenders(admin, profile);
    if (tenders.length === 0) continue;

    const { sent, errors } = await sendDigestEmails(profile, tenders, baseUrl);
    totalSent += sent;
    totalErrors += errors;
    if (sent > 0) usersNotified++;
  }

  void recordCronHeartbeat({
    job: "notifications-daily",
    status: totalErrors > 0 ? "fail" : "ok",
    durationMs: Date.now() - startedAt,
    details: {
      usersScanned,
      usersNotified,
      emailsSent: totalSent,
      emailErrors: totalErrors,
    },
  });

  return NextResponse.json({
    message: "Digest wysłany",
    usersScanned,
    usersNotified,
    emailsSent: totalSent,
    emailErrors: totalErrors,
  });
}
