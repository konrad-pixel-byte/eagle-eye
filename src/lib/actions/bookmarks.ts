"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function toggleBookmark(tenderId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  // Check if already bookmarked
  const { data: existing } = await supabase
    .from("saved_tenders")
    .select("id")
    .eq("user_id", user.id)
    .eq("tender_id", tenderId)
    .maybeSingle();

  if (existing) {
    // Remove bookmark
    await supabase
      .from("saved_tenders")
      .delete()
      .eq("user_id", user.id)
      .eq("tender_id", tenderId);
  } else {
    // Add bookmark
    await supabase
      .from("saved_tenders")
      .insert({ user_id: user.id, tender_id: tenderId });
  }

  revalidatePath("/dashboard/przetargi");
  revalidatePath(`/dashboard/przetargi/${tenderId}`);
  return { bookmarked: !existing };
}

export async function getUserBookmarks(): Promise<string[]> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data } = await supabase
    .from("saved_tenders")
    .select("tender_id")
    .eq("user_id", user.id);

  return (data ?? []).map((row) => row.tender_id);
}
