"use server";

import { createClient } from "@/lib/supabase/server";
import type { SubscriptionTier } from "@/lib/subscription";

export async function getUserTier(): Promise<SubscriptionTier> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return "free";

  const { data: profile } = await supabase
    .from("profiles")
    .select("subscription_tier")
    .eq("id", user.id)
    .single();

  return (profile?.subscription_tier as SubscriptionTier) ?? "free";
}
