"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function removeSavedTender(savedTenderId: string): Promise<void> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error("Not authenticated")

  await supabase
    .from("saved_tenders")
    .delete()
    .eq("id", savedTenderId)
    .eq("user_id", user.id)

  revalidatePath("/dashboard/zapisane")
}
