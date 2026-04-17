"use client"

import { useState, useTransition } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { CheckCircle, ChevronLeft, ChevronRight, Clock } from "lucide-react"
import { Button, buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import type { Lesson, LessonBlock } from "@/lib/akademia-content"
import { completeLesson } from "@/lib/actions/akademia"

interface LessonClientProps {
  lesson: Lesson
  moduleId: number
  totalLessons: number
  nextLessonId: number | null
  prevLessonId: number | null
  alreadyCompleted: boolean
}

function BlockRenderer({ block }: { block: LessonBlock }) {
  switch (block.type) {
    case "heading":
      return (
        <h2 className="mt-8 mb-3 text-lg font-semibold text-foreground">
          {block.text}
        </h2>
      )
    case "paragraph":
      return (
        <p className="mb-4 leading-relaxed text-zinc-300">{block.text}</p>
      )
    case "tip":
      return (
        <div className="my-4 rounded-lg border border-emerald-800/50 bg-emerald-950/30 px-4 py-3">
          <p className="text-sm font-medium text-emerald-400 mb-0.5">💡 Wskazówka</p>
          <p className="text-sm text-zinc-300">{block.text}</p>
        </div>
      )
    case "warning":
      return (
        <div className="my-4 rounded-lg border border-amber-800/50 bg-amber-950/30 px-4 py-3">
          <p className="text-sm font-medium text-amber-400 mb-0.5">⚠️ Ważne</p>
          <p className="text-sm text-zinc-300">{block.text}</p>
        </div>
      )
    case "quote":
      return (
        <blockquote className="my-4 border-l-4 border-sky-500 pl-4">
          <p className="text-sm italic text-zinc-400">{block.text}</p>
        </blockquote>
      )
    case "list":
      return (
        <ul className="mb-4 space-y-2 pl-2">
          {block.items?.map((item, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-zinc-300">
              <span className="mt-1 shrink-0 size-1.5 rounded-full bg-sky-500" />
              {item}
            </li>
          ))}
        </ul>
      )
    case "numbered":
      return (
        <ol className="mb-4 space-y-2 pl-2">
          {block.items?.map((item, i) => (
            <li key={i} className="flex items-start gap-3 text-sm text-zinc-300">
              <span className="shrink-0 font-mono text-sky-500 font-bold">{i + 1}.</span>
              {item}
            </li>
          ))}
        </ol>
      )
    case "divider":
      return <hr className="my-6 border-zinc-800" />
    default:
      return null
  }
}

export function LessonClient({
  lesson,
  moduleId,
  totalLessons,
  nextLessonId,
  prevLessonId,
  alreadyCompleted,
}: LessonClientProps) {
  const [completed, setCompleted] = useState(alreadyCompleted)
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  function handleComplete() {
    startTransition(async () => {
      await completeLesson(moduleId, lesson.id)
      setCompleted(true)
      if (nextLessonId) {
        router.push(`/dashboard/akademia/${moduleId}/${nextLessonId}`)
      } else {
        router.push("/dashboard/akademia")
      }
    })
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      {/* Back nav */}
      <Link
        href="/dashboard/akademia"
        className={cn(
          buttonVariants({ variant: "ghost", size: "sm" }),
          "-ml-2 mb-6 text-muted-foreground hover:text-foreground"
        )}
      >
        <ChevronLeft className="size-4" />
        Akademia
      </Link>

      {/* Header */}
      <div className="mb-8">
        <p className="text-xs text-zinc-500 mb-1">
          Moduł {moduleId} · Lekcja {lesson.id} z {totalLessons}
        </p>
        <h1 className="text-2xl font-bold tracking-tight">{lesson.title}</h1>
        <div className="flex items-center gap-2 mt-2 text-sm text-zinc-500">
          <Clock className="size-3.5" />
          {lesson.duration}
          {completed && (
            <span className="flex items-center gap-1 text-emerald-500">
              <CheckCircle className="size-3.5" />
              Ukończona
            </span>
          )}
        </div>
      </div>

      {/* Progress bar */}
      <div className="mb-8 h-1 rounded-full bg-zinc-800">
        <div
          className="h-full rounded-full bg-sky-500"
          style={{ width: `${(lesson.id / totalLessons) * 100}%` }}
        />
      </div>

      {/* Content */}
      <article className="prose-sm">
        {lesson.content.map((block, i) => (
          <BlockRenderer key={i} block={block} />
        ))}
      </article>

      {/* Navigation */}
      <div className="mt-12 flex items-center justify-between gap-4 border-t border-zinc-800 pt-6">
        <div>
          {prevLessonId && (
            <Link
              href={`/dashboard/akademia/${moduleId}/${prevLessonId}`}
              className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
            >
              <ChevronLeft className="size-4" />
              Poprzednia
            </Link>
          )}
        </div>

        <Button
          onClick={handleComplete}
          disabled={isPending}
          className="bg-sky-600 hover:bg-sky-500 text-white"
        >
          {isPending ? (
            "Zapisywanie..."
          ) : completed ? (
            <>
              {nextLessonId ? "Następna lekcja" : "Wróć do Akademii"}
              {nextLessonId && <ChevronRight className="size-4" />}
            </>
          ) : (
            <>
              {nextLessonId ? "Ukończ i kontynuuj" : "Ukończ moduł"}
              <ChevronRight className="size-4" />
            </>
          )}
        </Button>
      </div>
    </div>
  )
}
