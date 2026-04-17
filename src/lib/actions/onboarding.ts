"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { grantWelcomeBadge } from "@/lib/actions/gamification";

export async function completeOnboarding(data: {
  company_name: string;
  phone: string;
  preferred_regions: string[];
  preferred_cpv_codes: string[];
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("Not authenticated");

  const { error } = await supabase
    .from("profiles")
    .update({
      company_name: data.company_name,
      phone: data.phone,
      preferred_regions: data.preferred_regions,
      preferred_cpv_codes: data.preferred_cpv_codes,
      onboarding_completed: true,
      updated_at: new Date().toISOString(),
    })
    .eq("id", user.id);

  if (error) throw new Error(error.message);

  void grantWelcomeBadge()

  revalidatePath("/dashboard");
  return { success: true };
}
