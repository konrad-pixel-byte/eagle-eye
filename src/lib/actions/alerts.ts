"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import type { AlertRow } from "@/lib/types";

export async function getAllAlerts(): Promise<AlertRow[]> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];

  const { data, error } = await supabase
    .from("alerts")
    .select(
      "id, tender_id, channel, title, body, read, sent_at, opened_at, tender:tenders(id, title, source, voivodeship, deadline_submission)"
    )
    .eq("user_id", user.id)
    .order("sent_at", { ascending: false })
    .limit(100);

  if (error) {
    console.error("[getAllAlerts]", error.message);
    return [];
  }

  return (data ?? []).map((row) => ({
    ...row,
    tender: Array.isArray(row.tender) ? row.tender[0] ?? null : row.tender,
  })) as AlertRow[];
}

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
