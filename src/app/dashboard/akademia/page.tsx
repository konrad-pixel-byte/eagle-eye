import Link from "next/link"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { COURSE_MODULES } from "@/lib/akademia-content"
import { getCourseProgress } from "@/lib/actions/akademia"
import { getUserTier } from "@/lib/actions/subscription"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button, buttonVariants } from "@/components/ui/button"
import { BookOpen, FileEdit, Target, Zap, Lock, PlayCircle, CheckCircle, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import type { ElementType } from "react"

const MODULE_ICONS: Record<number, ElementType> = {
  1: BookOpen,
  2: FileEdit,
  3: Target,
  4: Zap,
}

const TIER_LABEL: Record<string, string> = {
  free: "Darmowy",
  basic: "Basic+",
  pro: "Pro+",
}

export default async function AkademiaPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/auth/login")

  const [progress, userTier] = await Promise.all([
    getCourseProgress(),
    getUserTier(),
  ])

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">
          Akademia Zamówień Publicznych
        </h1>
        <p className="mt-2 text-muted-foreground">
          Naucz się wygrywać przetargi — od podstaw do eksperta
        </p>
      </div>

      {/* Modules grid */}
      <div className="grid gap-5 sm:grid-cols-2">
        {COURSE_MODULES.map((mod) => {
          const Icon = MODULE_ICONS[mod.id] ?? BookOpen
          const isLocked = mod.tier !== "free" && userTier === "free"
          const hasLessons = mod.lessons.length > 0

          // Calculate progress
          const completedLessons = mod.lessons.filter((l) =>
            progress.some(
              (p) => p.module_id === mod.id && p.lesson_id === l.id
            )
          ).length
          const progressPct = hasLessons
            ? Math.round((completedLessons / mod.lessons.length) * 100)
            : 0
          const isComplete = hasLessons && completedLessons === mod.lessons.length
          const firstUncompletedLesson = mod.lessons.find(
            (l) => !progress.some((p) => p.module_id === mod.id && p.lesson_id === l.id)
          )
          const resumeLesson = firstUncompletedLesson ?? mod.lessons[0]

          return (
            <Card
              key={mod.id}
              className={cn(
                "border-zinc-800 bg-zinc-900/50 transition-all",
                isLocked && "opacity-60",
                isComplete && "border-emerald-800/50 bg-emerald-950/10"
              )}
            >
              <CardHeader>
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <div
                      className={cn(
                        "flex size-10 shrink-0 items-center justify-center rounded-lg",
                        isLocked
                          ? "bg-zinc-800 text-zinc-500"
                          : isComplete
                          ? "bg-emerald-900/50 text-emerald-400"
                          : "bg-sky-950/50 text-sky-400"
                      )}
                    >
                      {isLocked ? (
                        <Lock className="size-5" />
                      ) : isComplete ? (
                        <CheckCircle className="size-5" />
                      ) : (
                        <Icon className="size-5" />
                      )}
                    </div>
                    <div>
                      <p className="text-xs text-zinc-500">Moduł {mod.id}</p>
                      <CardTitle className="text-base">{mod.title}</CardTitle>
                    </div>
                  </div>
                  <Badge
                    variant="outline"
                    className={cn(
                      "shrink-0 text-xs",
                      mod.tier === "free"
                        ? "border-emerald-800 text-emerald-400"
                        : "border-zinc-700 text-zinc-400"
                    )}
                  >
                    {TIER_LABEL[mod.tier]}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <CardDescription className="text-sm">
                  {mod.description}
                </CardDescription>

                {hasLessons && (
                  <>
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-xs text-zinc-500">
                        <span>{completedLessons}/{mod.lessons.length} lekcji</span>
                        <span>{progressPct}%</span>
                      </div>
                      <div className="h-1.5 overflow-hidden rounded-full bg-zinc-800">
                        <div
                          className={cn(
                            "h-full rounded-full transition-all",
                            isComplete ? "bg-emerald-500" : "bg-sky-500"
                          )}
                          style={{ width: `${progressPct}%` }}
                        />
                      </div>
                    </div>

                    {/* Lesson list */}
                    <div className="space-y-1">
                      {mod.lessons.map((lesson) => {
                        const done = progress.some(
                          (p) => p.module_id === mod.id && p.lesson_id === lesson.id
                        )
                        return (
                          <Link
                            key={lesson.id}
                            href={
                              isLocked
                                ? "#"
                                : `/dashboard/akademia/${mod.id}/${lesson.id}`
                            }
                            className={cn(
                              "flex items-center gap-2 rounded-md px-2 py-1.5 text-sm transition-colors",
                              isLocked
                                ? "cursor-not-allowed text-zinc-600"
                                : done
                                ? "text-emerald-400 hover:bg-emerald-950/30"
                                : "text-zinc-300 hover:bg-zinc-800"
                            )}
                          >
                            {done ? (
                              <CheckCircle className="size-3.5 shrink-0 text-emerald-500" />
                            ) : (
                              <div className="size-3.5 shrink-0 rounded-full border border-zinc-600" />
                            )}
                            <span className="flex-1 truncate">{lesson.title}</span>
                            <span className="text-xs text-zinc-600">{lesson.duration}</span>
                          </Link>
                        )
                      })}
                    </div>
                  </>
                )}

                {/* CTA */}
                {isLocked ? (
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full border-zinc-700 text-zinc-500"
                    disabled
                  >
                    <Lock className="size-3.5" />
                    Odblokuj w planie {TIER_LABEL[mod.tier]}
                  </Button>
                ) : isComplete ? (
                  <Link
                    href={`/dashboard/akademia/${mod.id}/${mod.lessons[0].id}`}
                    className={cn(
                      buttonVariants({ variant: "outline", size: "sm" }),
                      "w-full border-emerald-800 text-emerald-400 hover:bg-emerald-950/30"
                    )}
                  >
                    <CheckCircle className="size-3.5" />
                    Ukończony — powtórz
                  </Link>
                ) : resumeLesson ? (
                  <Link
                    href={`/dashboard/akademia/${mod.id}/${resumeLesson.id}`}
                    className={cn(
                      buttonVariants({ size: "sm" }),
                      "w-full bg-sky-600 hover:bg-sky-500 text-white"
                    )}
                  >
                    {completedLessons > 0 ? (
                      <>
                        <ChevronRight className="size-3.5" />
                        Kontynuuj
                      </>
                    ) : (
                      <>
                        <PlayCircle className="size-3.5" />
                        Rozpocznij moduł
                      </>
                    )}
                  </Link>
                ) : null}
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
