"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import {
  profileSchema,
  notificationPreferencesSchema,
  searchPreferencesSchema,
} from "@/lib/validation/profile";

function firstError(issues: { message: string }[]): string {
  return issues[0]?.message ?? "Niepoprawne dane wejściowe";
}

export async function updateProfile(formData: {
  full_name: string;
  company_name: string;
  phone: string;
}) {
  const parsed = profileSchema.safeParse(formData);
  if (!parsed.success) throw new Error(firstError(parsed.error.issues));

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Nie jesteś zalogowany");

  const { error } = await supabase
    .from("profiles")
    .update({
      full_name: parsed.data.full_name,
      company_name: parsed.data.company_name,
      phone: parsed.data.phone,
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
  const parsed = notificationPreferencesSchema.safeParse(data);
  if (!parsed.success) throw new Error(firstError(parsed.error.issues));

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Nie jesteś zalogowany");

  const { error } = await supabase
    .from("profiles")
    .update({
      ...parsed.data,
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
  const parsed = searchPreferencesSchema.safeParse(data);
  if (!parsed.success) throw new Error(firstError(parsed.error.issues));

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Nie jesteś zalogowany");

  const { error } = await supabase
    .from("profiles")
    .update({
      ...parsed.data,
      updated_at: new Date().toISOString(),
    })
    .eq("id", user.id);

  if (error) throw new Error(error.message);
  revalidatePath("/dashboard/ustawienia");
  return { success: true };
}
