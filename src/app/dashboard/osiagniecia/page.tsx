import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { getGamificationState, getRecentXpEvents } from "@/lib/actions/gamification"
import { BADGES, xpToNextLevel, LEVELS } from "@/lib/gamification"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Trophy, Flame, Star, Zap, Lock } from "lucide-react"
import { DailyTip } from "@/components/gamification/DailyTip"

export default async function OsiagnieciaPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/auth/login")

  const [state, recentEvents] = await Promise.all([
    getGamificationState(),
    getRecentXpEvents(15),
  ])

  if (!state) {
    return (
      <div className="p-6 text-zinc-400">
        Zaloguj się, aby zobaczyć osiągnięcia.
      </div>
    )
  }

  const { current, next, progress } = xpToNextLevel(state.totalXp)

  return (
    <div className="flex flex-col gap-6 p-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Osiągnięcia</h1>
        <p className="mt-1 text-sm text-zinc-400">
          Twój postęp, odznaczenia i statystyki aktywności
        </p>
      </div>

      <DailyTip />

      {/* Stats bento */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatCard
          icon={<Trophy className="size-5 text-amber-500" />}
          value={`${current.icon} Lv.${current.level}`}
          label={current.title}
        />
        <StatCard
          icon={<Zap className="size-5 text-amber-400" />}
          value={state.totalXp.toLocaleString("pl-PL")}
          label="XP łącznie"
          mono
        />
        <StatCard
          icon={<Flame className="size-5 text-orange-500" />}
          value={String(state.currentStreak)}
          label="Streak (dni)"
          mono
        />
        <StatCard
          icon={<Star className="size-5 text-sky-500" />}
          value={String(state.badges.length)}
          label="Odznaczenia"
          mono
        />
      </div>

      {/* XP Progress */}
      <Card className="border-zinc-800 bg-zinc-900/50">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-zinc-400">
            Postęp do następnego poziomu
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">
              {current.icon} {current.title} (Lv.{current.level})
            </span>
            {next ? (
              <span className="text-sm text-zinc-500">
                {next.icon} {next.title} (Lv.{next.level})
              </span>
            ) : (
              <span className="text-sm text-amber-500">MAX LEVEL 🐲</span>
            )}
          </div>
          <div className="h-3 overflow-hidden rounded-full bg-zinc-800">
            <div
              className="h-full rounded-full bg-gradient-to-r from-amber-500 to-orange-500 transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-xs text-zinc-500">
            {state.totalXp} / {next?.xpRequired ?? current.xpRequired} XP ({progress}%)
          </p>
        </CardContent>
      </Card>

      {/* All levels roadmap */}
      <Card className="border-zinc-800 bg-zinc-900/50">
        <CardHeader>
          <CardTitle className="text-sm font-medium">Mapa Poziomów</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {LEVELS.map((lvl) => {
              const isReached = state.level >= lvl.level
              const isCurrent = state.level === lvl.level
              return (
                <div
                  key={lvl.level}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors ${
                    isCurrent
                      ? "border border-amber-500/30 bg-amber-500/10"
                      : isReached
                      ? "bg-zinc-800/50"
                      : "opacity-40"
                  }`}
                >
                  <span className="text-lg">{lvl.icon}</span>
                  <div className="flex-1">
                    <span className="font-medium">
                      Lv.{lvl.level} — {lvl.title}
                    </span>
                  </div>
                  <span className="font-mono text-xs text-zinc-500">
                    {lvl.xpRequired} XP
                  </span>
                  {isCurrent && (
                    <Badge className="bg-amber-500/20 text-amber-400 text-xs border-amber-500/30">
                      TY
                    </Badge>
                  )}
                  {!isReached && <Lock className="size-3 text-zinc-600" />}
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Badges grid */}
      <div>
        <h2 className="mb-4 text-base font-semibold">Odznaczenia</h2>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {BADGES.map((badge) => {
            const earned = state.badges.includes(badge.id)
            return (
              <div
                key={badge.id}
                className={`flex items-start gap-3 rounded-xl border p-4 transition-all ${
                  earned
                    ? "border-zinc-700 bg-zinc-900"
                    : "border-zinc-800/60 bg-zinc-900/30 opacity-50 grayscale"
                }`}
              >
                <span className="mt-0.5 text-2xl">{badge.emoji}</span>
                <div>
                  <p className="font-medium text-sm text-foreground">
                    {badge.name}
                  </p>
                  <p className="mt-0.5 text-xs text-zinc-500">
                    {badge.description}
                  </p>
                  {earned && (
                    <Badge
                      variant="outline"
                      className="mt-2 border-emerald-800 bg-emerald-950/30 text-emerald-400 text-xs"
                    >
                      Zdobyte
                    </Badge>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Recent XP events */}
      {recentEvents.length > 0 && (
        <Card className="border-zinc-800 bg-zinc-900/50">
          <CardHeader>
            <CardTitle className="text-sm font-medium">Historia XP</CardTitle>
            <CardDescription className="text-xs text-zinc-500">
              Ostatnie 15 wydarzeń
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {recentEvents.map((event) => (
                <div
                  key={event.id}
                  className="flex items-center justify-between py-1.5 text-sm border-b border-zinc-800 last:border-0"
                >
                  <span className="text-zinc-400">
                    {EVENT_LABELS[event.event_type as string] ?? event.event_type}
                  </span>
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-amber-500 font-medium">
                      +{event.xp_earned} XP
                    </span>
                    <span className="text-xs text-zinc-600">
                      {new Date(event.created_at).toLocaleDateString("pl-PL")}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

const EVENT_LABELS: Record<string, string> = {
  tender_view: "Przejrzano przetarg",
  daily_login: "Dzienne logowanie",
  streak_bonus: "Bonus za streak",
  save_tender: "Zapisano przetarg",
  complete_onboarding: "Onboarding ukończony",
}

function StatCard({
  icon,
  value,
  label,
  mono,
}: {
  icon: React.ReactNode
  value: string
  label: string
  mono?: boolean
}) {
  return (
    <Card className="border-zinc-800 bg-zinc-900/50">
      <CardContent className="pt-4">
        <div className="flex items-center gap-2 mb-1">{icon}</div>
        <p className={`text-xl font-bold ${mono ? "font-mono" : ""}`}>
          {value}
        </p>
        <p className="text-xs text-zinc-500">{label}</p>
      </CardContent>
    </Card>
  )
}
