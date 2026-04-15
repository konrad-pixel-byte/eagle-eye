import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { resend, FROM_EMAIL } from "@/lib/resend";
import { renderNewTenderAlert } from "@/lib/emails/new-tender-alert";

function getBaseUrl(request: NextRequest): string {
  return (
    process.env.NEXT_PUBLIC_APP_URL ?? request.nextUrl.origin
  );
}

function isAuthorized(request: NextRequest): boolean {
  const cronSecret = process.env.CRON_SECRET;
  if (!cronSecret) return false;

  const authHeader = request.headers.get("Authorization");
  return authHeader === `Bearer ${cronSecret}`;
}

type Profile = {
  id: string;
  email: string | null;
  preferred_regions: string[] | null;
  preferred_cpv_codes: string[] | null;
};

type Tender = {
  id: string;
  title: string;
  contracting_authority: string | null;
  voivodeship: string | null;
  budget_max: number | null;
  submission_deadline: string | null;
  ai_score: number | null;
};

async function findMatchingTenders(
  supabase: Awaited<ReturnType<typeof createClient>>,
  profile: Profile
): Promise<Tender[]> {
  const since = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();

  let query = supabase
    .from("tenders")
    .select(
      "id, title, contracting_authority, voivodeship, budget_max, submission_deadline, ai_score"
    )
    .gte("created_at", since);

  if (profile.preferred_regions && profile.preferred_regions.length > 0) {
    query = query.in("voivodeship", profile.preferred_regions);
  }

  const { data, error } = await query.order("ai_score", { ascending: false }).limit(5);

  if (error || !data) return [];
  return data as Tender[];
}

async function sendDigestEmail(
  profile: Profile,
  tenders: Tender[],
  baseUrl: string
): Promise<{ sent: number; errors: number }> {
  let sent = 0;
  let errors = 0;

  for (const tender of tenders) {
    const html = renderNewTenderAlert({
      tenderTitle: tender.title,
      contractingAuthority: tender.contracting_authority ?? "Nieznany",
      voivodeship: tender.voivodeship ?? "Nieznane",
      budgetMax: tender.budget_max ?? null,
      deadline: tender.submission_deadline ?? null,
      aiScore: tender.ai_score ?? null,
      tenderId: tender.id,
      baseUrl,
    });

    const { error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: profile.email!,
      subject: `Nowy przetarg: ${tender.title}`,
      html,
    });

    if (error) {
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

  const supabase = await createClient();
  const baseUrl = getBaseUrl(request);

  const { data: profiles, error: profilesError } = await supabase
    .from("profiles")
    .select("id, email, preferred_regions, preferred_cpv_codes")
    .eq("notification_email", true)
    .not("email", "is", null);

  if (profilesError) {
    return NextResponse.json(
      { error: "Błąd pobierania profili użytkowników" },
      { status: 500 }
    );
  }

  if (!profiles || profiles.length === 0) {
    return NextResponse.json({ message: "Brak użytkowników do powiadomienia", sent: 0 });
  }

  let totalSent = 0;
  let totalErrors = 0;
  let usersNotified = 0;

  for (const profile of profiles as Profile[]) {
    const tenders = await findMatchingTenders(supabase, profile);
    if (tenders.length === 0) continue;

    const { sent, errors } = await sendDigestEmail(profile, tenders, baseUrl);
    totalSent += sent;
    totalErrors += errors;
    if (sent > 0) usersNotified++;
  }

  return NextResponse.json({
    message: "Digest wysłany",
    usersNotified,
    emailsSent: totalSent,
    emailErrors: totalErrors,
  });
}
