"use client"

import { useState, useTransition } from "react"
import { toast } from "sonner"
import { Card, CardContent } from "@/components/ui/card"
import { type XpEventType, XP_REWARDS } from "@/lib/gamification"

interface MonthlyChallengeCardProps {
  challengeId: string
  emoji: string
  title: string
  description: string
  progress: number
  target: number
  xpReward: XpEventType
  claimed: boolean
  completed: boolean
  claimAction: (id: string) => Promise<{ success: boolean; xpAwarded: number; error?: string }>
}

export function MonthlyChallengeCard({
  challengeId,
  emoji,
  title,
  description,
  progress,
  target,
  xpReward,
  claimed: initialClaimed,
  completed,
  claimAction,
}: MonthlyChallengeCardProps) {
  const [claimed, setClaimed] = useState(initialClaimed)
  const [isPending, startTransition] = useTransition()

  const pct = Math.min(100, Math.round((progress / target) * 100))
  const xp = XP_REWARDS[xpReward]

  function handleClaim() {
    startTransition(async () => {
      const result = await claimAction(challengeId)
      if (result.success) {
        setClaimed(true)
        toast.success(`+${result.xpAwarded} XP za wyzwanie!`, {
          description: title,
          duration: 5000,
        })
      } else {
        toast.error(result.error ?? "Nie udało się odebrać nagrody")
      }
    })
  }

  return (
    <Card
      className={`border transition-all ${
        claimed
          ? "border-emerald-800/50 bg-emerald-950/20"
          : completed
          ? "border-amber-600/40 bg-amber-950/10"
          : "border-zinc-800 bg-zinc-900/50"
      }`}
    >
      <CardContent className="pt-4">
        <div className="flex items-start gap-3">
          <span className="mt-0.5 text-2xl">{emoji}</span>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2">
              <p className="font-semibold text-sm truncate">{title}</p>
              <span className="shrink-0 font-mono text-xs text-amber-500">+{xp} XP</span>
            </div>
            <p className="mt-0.5 text-xs text-zinc-500">{description}</p>

            {/* Progress bar */}
            <div className="mt-3 space-y-1">
              <div className="flex justify-between text-xs text-zinc-500">
                <span>{progress} / {target}</span>
                <span>{pct}%</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-zinc-800">
                <div
                  className={`h-full rounded-full transition-all ${
                    claimed
                      ? "bg-emerald-500"
                      : completed
                      ? "bg-amber-500"
                      : "bg-zinc-600"
                  }`}
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>

            {/* Action */}
            <div className="mt-3">
              {claimed ? (
                <span className="inline-flex items-center gap-1 text-xs text-emerald-400">
                  ✓ Odebrane
                </span>
              ) : completed ? (
                <button
                  onClick={handleClaim}
                  disabled={isPending}
                  className="inline-flex items-center gap-1.5 rounded-md bg-amber-500 px-3 py-1 text-xs font-semibold text-black transition-opacity hover:opacity-90 disabled:opacity-50"
                >
                  {isPending ? "Odbieram…" : `Odbierz +${xp} XP`}
                </button>
              ) : (
                <span className="text-xs text-zinc-600">
                  Jeszcze {target - progress} do ukończenia
                </span>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
