"use server";

import { createClient } from "@/lib/supabase/server";
import { getResend, FROM_EMAIL } from "@/lib/resend";
import { renderNewTenderAlert } from "@/lib/emails/new-tender-alert";

function getBaseUrl(): string {
  return process.env.NEXT_PUBLIC_APP_URL ?? "https://eagle-eye.hatedapps.pl";
}

export async function sendTenderAlert(
  tenderId: string,
  userId: string
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient();

  const { data: tender, error: tenderError } = await supabase
    .from("tenders")
    .select(
      "id, title, contracting_authority, voivodeship, budget_max, deadline_submission, ai_relevance_score"
    )
    .eq("id", tenderId)
    .single();

  if (tenderError || !tender) {
    return { success: false, error: "Przetarg nie znaleziony" };
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("email, notification_email")
    .eq("id", userId)
    .single();

  if (profileError || !profile) {
    return { success: false, error: "Profil użytkownika nie znaleziony" };
  }

  if (!profile.notification_email) {
    return { success: true };
  }

  if (!profile.email) {
    return { success: false, error: "Brak adresu email użytkownika" };
  }

  const rawScore = tender.ai_relevance_score;
  const normalizedScore =
    rawScore === null ? null : rawScore > 1 ? rawScore / 100 : rawScore;

  const html = renderNewTenderAlert({
    tenderTitle: tender.title,
    contractingAuthority: tender.contracting_authority ?? "Nieznany",
    voivodeship: tender.voivodeship ?? "Nieznane",
    budgetMax: tender.budget_max ?? null,
    deadline: tender.deadline_submission ?? null,
    aiScore: normalizedScore,
    tenderId: tender.id,
    baseUrl: getBaseUrl(),
  });

  const { error: sendError } = await getResend().emails.send({
    from: FROM_EMAIL,
    to: profile.email,
    subject: `Nowy przetarg: ${tender.title.slice(0, 80)}`,
    html,
  });

  if (sendError) {
    return { success: false, error: sendError.message };
  }

  const { error: alertError } = await supabase.from("alerts").insert({
    user_id: userId,
    tender_id: tenderId,
    channel: "email",
    title: `Nowy przetarg: ${tender.title.slice(0, 120)}`,
    body: tender.contracting_authority ?? null,
    read: false,
  });

  if (alertError) {
    return { success: false, error: alertError.message };
  }

  return { success: true };
}
