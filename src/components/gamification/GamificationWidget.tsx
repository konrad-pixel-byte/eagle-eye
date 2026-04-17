"use client"

import { Trophy, Flame, Star, TrendingUp } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { UserGamificationState } from "@/lib/gamification"
import { BADGES } from "@/lib/gamification"

interface GamificationWidgetProps {
  state: UserGamificationState
}

export function GamificationWidget({ state }: GamificationWidgetProps) {
  const { levelConfig, nextLevel, xpProgress, totalXp, currentStreak, badges } = state

  const recentBadges = badges
    .slice(-3)
    .map((id) => BADGES.find((b) => b.id === id))
    .filter(Boolean)

  return (
    <Card className="border-zinc-800 bg-zinc-900/50">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-sm font-medium text-zinc-400">
          <Trophy className="size-4 text-amber-500" />
          Raport Mocy
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Level + title */}
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">{levelConfig.icon}</span>
              <div>
                <p className="font-semibold text-foreground">
                  Poziom {levelConfig.level}
                </p>
                <p className="text-xs text-zinc-500">{levelConfig.title}</p>
              </div>
            </div>
          </div>
          <div className="text-right">
            <p className="font-mono text-lg font-bold text-amber-500">
              {totalXp.toLocaleString("pl-PL")}
            </p>
            <p className="text-xs text-zinc-500">XP łącznie</p>
          </div>
        </div>

        {/* XP progress bar */}
        <div className="space-y-1">
          <div className="flex justify-between text-xs text-zinc-500">
            <span>{levelConfig.xpRequired} XP</span>
            {nextLevel ? (
              <span>{nextLevel.xpRequired} XP → Lv.{nextLevel.level}</span>
            ) : (
              <span>MAX LEVEL 🐲</span>
            )}
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-zinc-800">
            <div
              className="h-full rounded-full bg-gradient-to-r from-amber-500 to-orange-500 transition-all duration-700"
              style={{ width: `${xpProgress}%` }}
            />
          </div>
          <p className="text-right text-xs text-zinc-500">{xpProgress}%</p>
        </div>

        {/* Streak + stats row */}
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-3">
            <div className="flex items-center gap-1.5">
              <Flame className="size-4 text-orange-500" />
              <span className="font-mono text-xl font-bold text-foreground">
                {currentStreak}
              </span>
            </div>
            <p className="mt-0.5 text-xs text-zinc-500">dni z rzędu</p>
          </div>
          <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-3">
            <div className="flex items-center gap-1.5">
              <Star className="size-4 text-sky-500" />
              <span className="font-mono text-xl font-bold text-foreground">
                {badges.length}
              </span>
            </div>
            <p className="mt-0.5 text-xs text-zinc-500">odznaczenia</p>
          </div>
        </div>

        {/* Recent badges */}
        {recentBadges.length > 0 && (
          <div>
            <p className="mb-2 text-xs font-medium text-zinc-500">
              Ostatnie odznaczenia
            </p>
            <div className="flex flex-wrap gap-1.5">
              {recentBadges.map((badge) =>
                badge ? (
                  <Badge
                    key={badge.id}
                    variant="outline"
                    className="border-zinc-700 bg-zinc-800/50 text-xs text-zinc-300"
                    title={badge.description}
                  >
                    {badge.emoji} {badge.name}
                  </Badge>
                ) : null
              )}
            </div>
          </div>
        )}

        {/* CTA */}
        <a
          href="/dashboard/osiagniecia"
          className="flex items-center gap-1 text-xs text-sky-500 hover:text-sky-400 transition-colors"
        >
          <TrendingUp className="size-3" />
          Zobacz wszystkie osiągnięcia →
        </a>
      </CardContent>
    </Card>
  )
}
