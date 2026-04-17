import { notFound, redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { getModule, getLesson } from "@/lib/akademia-content"
import { getCourseProgress } from "@/lib/actions/akademia"
import { getUserTier } from "@/lib/actions/subscription"
import { LessonClient } from "./LessonClient"

export default async function LessonPage({
  params,
}: {
  params: Promise<{ moduleId: string; lessonId: string }>
}) {
  const { moduleId: moduleIdStr, lessonId: lessonIdStr } = await params
  const moduleId = parseInt(moduleIdStr)
  const lessonId = parseInt(lessonIdStr)

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/auth/login")

  const mod = getModule(moduleId)
  const lesson = getLesson(moduleId, lessonId)

  if (!mod || !lesson) notFound()

  // Check tier access
  if (mod.tier !== "free") {
    const userTier = await getUserTier()
    if (userTier === "free") {
      redirect("/dashboard/akademia")
    }
  }

  const progress = await getCourseProgress()
  const alreadyCompleted = progress.some(
    (p) => p.module_id === moduleId && p.lesson_id === lessonId
  )

  const lessons = mod.lessons
  const currentIndex = lessons.findIndex((l) => l.id === lessonId)
  const nextLesson = lessons[currentIndex + 1] ?? null
  const prevLesson = lessons[currentIndex - 1] ?? null

  return (
    <LessonClient
      lesson={lesson}
      moduleId={moduleId}
      totalLessons={lessons.length}
      nextLessonId={nextLesson?.id ?? null}
      prevLessonId={prevLesson?.id ?? null}
      alreadyCompleted={alreadyCompleted}
    />
  )
}
