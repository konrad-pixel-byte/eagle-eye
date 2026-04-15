"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function getUnreadAlertCount(): Promise<number> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return 0;

  const { count } = await supabase
    .from("alerts")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user.id)
    .eq("read", false);

  return count ?? 0;
}

export async function markAlertAsRead(alertId: string): Promise<void> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  await supabase
    .from("alerts")
    .update({ read: true, opened_at: new Date().toISOString() })
    .eq("id", alertId)
    .eq("user_id", user.id);

  revalidatePath("/dashboard");
}

export async function markAllAlertsAsRead(): Promise<void> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  await supabase
    .from("alerts")
    .update({ read: true, opened_at: new Date().toISOString() })
    .eq("user_id", user.id)
    .eq("read", false);

  revalidatePath("/dashboard");
}
