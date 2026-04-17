import { redirect } from "next/navigation"
import Link from "next/link"
import { createClient } from "@/lib/supabase/server"
import { getLeaderboard } from "@/lib/actions/gamification"
import { cn } from "@/lib/utils"
import { Trophy, Flame, Star, Eye, Medal, Crown } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default async function HallOfFamePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/auth/login")

  const leaderboard = await getLeaderboard(20)
  const top3 = leaderboard.slice(0, 3)
  const rest = leaderboard.slice(3)

  // Podium order: 2nd, 1st, 3rd
  const podiumOrder = [top3[1], top3[0], top3[2]].filter(Boolean)

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      {/* Header */}
      <div className="mb-10 text-center">
        <div className="mb-3 flex justify-center">
          <div className="flex size-16 items-center justify-center rounded-2xl bg-amber-950/40 ring-1 ring-amber-800/40">
            <Trophy className="size-8 text-amber-400" />
          </div>
        </div>
        <h1 className="text-3xl font-bold tracking-tight">Hall of Fame</h1>
        <p className="mt-2 text-sm text-zinc-500">
          Najlepsi łowcy przetargów w Eagle Eye
        </p>
      </div>

      {/* Podium */}
      {top3.length > 0 && (
        <div className="mb-10 flex items-end justify-center gap-3">
          {podiumOrder.map((entry) => {
            if (!entry) return null
            const isPrimary = entry.rank === 1
            const isSecond = entry.rank === 2

            return (
              <div
                key={entry.userId}
                className={cn(
                  "flex flex-col items-center gap-2",
                  isPrimary ? "order-2" : isSecond ? "order-1" : "order-3"
                )}
              >
                {/* Crown for #1 */}
                {isPrimary && (
                  <Crown className="size-5 text-amber-400" />
                )}

                {/* Avatar */}
                <div
                  className={cn(
                    "flex items-center justify-center rounded-full font-bold text-white ring-2",
                    isPrimary
                      ? "size-16 bg-amber-600 ring-amber-400 text-lg"
                      : "size-12 bg-zinc-700 ring-zinc-600 text-base",
                    entry.isCurrentUser && "ring-sky-400"
                  )}
                >
                  {entry.levelIcon}
                </div>

                {/* Name */}
                <div className="max-w-[96px] text-center">
                  <p
                    className={cn(
                      "truncate font-semibold leading-tight",
                      isPrimary ? "text-sm text-white" : "text-xs text-zinc-300",
                      entry.isCurrentUser && "text-sky-400"
                    )}
                  >
                    {entry.displayName}
                  </p>
                  <p className="mt-0.5 text-xs text-zinc-500">{entry.levelTitle}</p>
                </div>

                {/* Podium block */}
                <div
                  className={cn(
                    "w-24 rounded-t-lg border border-zinc-700 flex flex-col items-center justify-end pb-3 pt-2 gap-1",
                    isPrimary
                      ? "h-24 bg-amber-950/40 border-amber-800/50"
                      : isSecond
                      ? "h-16 bg-zinc-800/60"
                      : "h-12 bg-zinc-800/40"
                  )}
                >
                  <span
                    className={cn(
                      "font-mono font-bold",
                      isPrimary ? "text-amber-400 text-lg" : "text-zinc-300 text-base"
                    )}
                  >
                    #{entry.rank}
                  </span>
                  <span className="font-mono text-xs text-zinc-500">
                    {entry.totalXp.toLocaleString("pl-PL")} XP
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Stats cards */}
      {top3[0] && (
        <div className="mb-8 grid grid-cols-3 gap-3">
          <Card className="border-zinc-800 bg-zinc-900/50 text-center">
            <CardContent className="px-3 py-4">
              <p className="text-xs text-zinc-500 mb-1">Najdłuższy streak</p>
              <div className="flex items-center justify-center gap-1">
                <Flame className="size-4 text-orange-400" />
                <span className="font-mono text-lg font-bold text-orange-400">
                  {Math.max(...leaderboard.map((e) => e.currentStreak))}
                </span>
              </div>
              <p className="text-xs text-zinc-600 mt-0.5">dni z rzędu</p>
            </CardContent>
          </Card>
          <Card className="border-zinc-800 bg-zinc-900/50 text-center">
            <CardContent className="px-3 py-4">
              <p className="text-xs text-zinc-500 mb-1">Rekordzista XP</p>
              <div className="flex items-center justify-center gap-1">
                <Star className="size-4 text-amber-400" />
                <span className="font-mono text-lg font-bold text-amber-400">
                  {top3[0].totalXp.toLocaleString("pl-PL")}
                </span>
              </div>
              <p className="text-xs text-zinc-600 mt-0.5">punktów doświadczenia</p>
            </CardContent>
          </Card>
          <Card className="border-zinc-800 bg-zinc-900/50 text-center">
            <CardContent className="px-3 py-4">
              <p className="text-xs text-zinc-500 mb-1">Badacze przetargów</p>
              <div className="flex items-center justify-center gap-1">
                <Eye className="size-4 text-sky-400" />
                <span className="font-mono text-lg font-bold text-sky-400">
                  {Math.max(...leaderboard.map((e) => e.tenderViews))}
                </span>
              </div>
              <p className="text-xs text-zinc-600 mt-0.5">przetargów przejrzanych</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Full ranking table */}
      <Card className="border-zinc-800 bg-zinc-900/50">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <Medal className="size-4 text-zinc-400" />
            Pełny ranking
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {leaderboard.length === 0 ? (
            <div className="px-6 py-12 text-center text-sm text-zinc-500">
              Brak danych — bądź pierwszym na liście!
            </div>
          ) : (
            <div className="divide-y divide-zinc-800">
              {leaderboard.map((entry) => (
                <div
                  key={entry.userId}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 transition-colors",
                    entry.isCurrentUser
                      ? "bg-sky-950/20 border-l-2 border-sky-500"
                      : "hover:bg-zinc-800/30"
                  )}
                >
                  {/* Rank */}
                  <span
                    className={cn(
                      "w-6 shrink-0 text-center font-mono text-sm font-bold",
                      entry.rank === 1
                        ? "text-amber-400"
                        : entry.rank === 2
                        ? "text-zinc-300"
                        : entry.rank === 3
                        ? "text-orange-600"
                        : "text-zinc-600"
                    )}
                  >
                    {entry.rank <= 3 ? (
                      entry.rank === 1 ? "🥇" : entry.rank === 2 ? "🥈" : "🥉"
                    ) : (
                      `#${entry.rank}`
                    )}
                  </span>

                  {/* Level icon */}
                  <span className="text-base">{entry.levelIcon}</span>

                  {/* Name + level */}
                  <div className="min-w-0 flex-1">
                    <p
                      className={cn(
                        "truncate text-sm font-medium leading-tight",
                        entry.isCurrentUser ? "text-sky-400" : "text-zinc-200"
                      )}
                    >
                      {entry.displayName}
                      {entry.isCurrentUser && (
                        <span className="ml-1.5 text-xs text-sky-600">(Ty)</span>
                      )}
                    </p>
                    <p className="text-xs text-zinc-600">
                      Poziom {entry.level} · {entry.levelTitle}
                    </p>
                  </div>

                  {/* XP */}
                  <span className="shrink-0 font-mono text-sm font-bold text-amber-400">
                    {entry.totalXp.toLocaleString("pl-PL")}
                    <span className="ml-1 text-xs font-normal text-zinc-600">XP</span>
                  </span>

                  {/* Streak */}
                  {entry.currentStreak > 0 && (
                    <div className="flex shrink-0 items-center gap-0.5 text-xs text-orange-400">
                      <Flame className="size-3" />
                      <span className="font-mono">{entry.currentStreak}</span>
                    </div>
                  )}

                  {/* Badges */}
                  {entry.badgeCount > 0 && (
                    <Badge
                      variant="outline"
                      className="shrink-0 border-zinc-700 px-1.5 py-0.5 text-xs text-zinc-400"
                    >
                      <Star className="mr-1 size-2.5" />
                      {entry.badgeCount}
                    </Badge>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Motivation footer */}
      <div className="mt-6 text-center">
        <p className="text-xs text-zinc-600">
          Zdobywaj XP przez przeglądanie przetargów, logowania i ukończenie lekcji w Akademii.{" "}
          <Link href="/dashboard/osiagniecia" className="text-sky-500 hover:underline">
            Moje osiągnięcia →
          </Link>
        </p>
      </div>
    </div>
  )
}
