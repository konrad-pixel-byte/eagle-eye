"use server"

import { revalidatePath } from "next/cache"
import { createClient } from "@/lib/supabase/server"
import { createAdminClient } from "@/lib/supabase/admin"
import { getModule } from "@/lib/akademia-content"
import { awardXp } from "@/lib/actions/gamification"

// ─── Get user's completed lessons ────────────────────────────────────────────

export async function getCourseProgress(): Promise<
  { module_id: number; lesson_id: number }[]
> {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return []

    const { data } = await supabase
      .from("course_progress")
      .select("module_id, lesson_id")
      .eq("user_id", user.id)

    return data ?? []
  } catch {
    return []
  }
}

// ─── Mark lesson as complete ──────────────────────────────────────────────────

export async function completeLesson(
  moduleId: number,
  lessonId: number
): Promise<{ ok: boolean; moduleCompleted: boolean; xpEarned: number }> {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { ok: false, moduleCompleted: false, xpEarned: 0 }

    const admin = createAdminClient()

    // Insert (ignore duplicate)
    await admin
      .from("course_progress")
      .upsert(
        { user_id: user.id, module_id: moduleId, lesson_id: lessonId },
        { onConflict: "user_id,module_id,lesson_id" }
      )

    // Check if all lessons in module are now complete
    const mod = getModule(moduleId)
    let moduleCompleted = false
    let xpEarned = 5 // base XP per lesson

    if (mod) {
      const { data: completedRows } = await admin
        .from("course_progress")
        .select("lesson_id")
        .eq("user_id", user.id)
        .eq("module_id", moduleId)

      const completedIds = new Set((completedRows ?? []).map((r) => r.lesson_id))
      const allLessonIds = mod.lessons.map((l) => l.id)
      moduleCompleted = allLessonIds.every((id) => completedIds.has(id))

      if (moduleCompleted) {
        xpEarned = mod.xpReward
        await awardXp("complete_module", { source: `module_${moduleId}` })
      }
    }

    revalidatePath("/dashboard/akademia")

    return { ok: true, moduleCompleted, xpEarned }
  } catch {
    return { ok: false, moduleCompleted: false, xpEarned: 0 }
  }
}
