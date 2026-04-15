"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function updateProfile(formData: {
  full_name: string;
  company_name: string;
  phone: string;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) throw new Error("Not authenticated");

  const { error } = await supabase
    .from("profiles")
    .update({
      full_name: formData.full_name,
      company_name: formData.company_name,
      phone: formData.phone,
      updated_at: new Date().toISOString(),
    })
    .eq("id", user.id);

  if (error) throw new Error(error.message);
  revalidatePath("/dashboard/ustawienia");
  return { success: true };
}

export async function updateNotificationPreferences(data: {
  notification_email: boolean;
  notification_push: boolean;
  notification_sms: boolean;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) throw new Error("Not authenticated");

  const { error } = await supabase
    .from("profiles")
    .update({
      ...data,
      updated_at: new Date().toISOString(),
    })
    .eq("id", user.id);

  if (error) throw new Error(error.message);
  revalidatePath("/dashboard/ustawienia");
  return { success: true };
}

export async function updateSearchPreferences(data: {
  preferred_regions: string[];
  preferred_cpv_codes: string[];
  kfs_priorities: string[];
  budget_min: number | null;
  budget_max: number | null;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) throw new Error("Not authenticated");

  const { error } = await supabase
    .from("profiles")
    .update({
      ...data,
      updated_at: new Date().toISOString(),
    })
    .eq("id", user.id);

  if (error) throw new Error(error.message);
  revalidatePath("/dashboard/ustawienia");
  return { success: true };
}
