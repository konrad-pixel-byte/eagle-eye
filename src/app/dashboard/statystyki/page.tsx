import { createClient } from "@/lib/supabase/server"
import { Lock, BarChart3, Bookmark, Zap, TrendingUp } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

const PLN = new Intl.NumberFormat("pl-PL", {
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
})

function fmt(value: number | null | undefined): string {
  if (value == null) return "—"
  return PLN.format(value) + " PLN"
}

function fmtNum(value: number | null | undefined): string {
  if (value == null) return "—"
  return PLN.format(value)
}

// ─── page ────────────────────────────────────────────────────────────────────

export default async function StatystykiPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Run all queries in parallel
  const [
    { count: allCount },
    { count: activeCount },
    { count: savedCount },
    { data: recentTenders },
    { data: budgetRows },
    { data: voivodeshipRows },
  ] = await Promise.all([
    supabase
      .from("tenders")
      .select("*", { count: "exact", head: true }),
    supabase
      .from("tenders")
      .select("*", { count: "exact", head: true })
      .eq("status", "active"),
    user
      ? supabase
          .from("saved_tenders")
          .select("*", { count: "exact", head: true })
          .eq("user_id", user.id)
      : Promise.resolve({ count: 0, error: null }),
    supabase
      .from("tenders")
      .select("title, budget_max, voivodeship, published_at")
      .order("published_at", { ascending: false })
      .limit(5),
    supabase
      .from("tenders")
      .select("budget_max")
      .not("budget_max", "is", null),
    supabase
      .from("tenders")
      .select("voivodeship")
      .not("voivodeship", "is", null),
  ])

  // Compute average budget
  const budgets = (budgetRows ?? [])
    .map((r) => r.budget_max as number)
    .filter((b) => b > 0)
  const avgBudget =
    budgets.length > 0
      ? budgets.reduce((sum, b) => sum + b, 0) / budgets.length
      : null

  // Compute voivodeship distribution
  const voivodeshipMap: Record<string, number> = {}
  for (const row of voivodeshipRows ?? []) {
    const v = row.voivodeship as string
    voivodeshipMap[v] = (voivodeshipMap[v] ?? 0) + 1
  }
  const voivodeshipList = Object.entries(voivodeshipMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)

  const maxVoivodeship = voivodeshipList[0]?.[1] ?? 1

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          Statystyki
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Przegląd aktywności i danych przetargowych na platformie
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Wszystkie przetargi"
          value={fmtNum(allCount)}
          icon={BarChart3}
          description="W bazie danych"
        />
        <StatCard
          label="Aktywne"
          value={fmtNum(activeCount)}
          icon={Zap}
          description="Otwarte nabory"
          highlight
        />
        <StatCard
          label="Zapisane"
          value={fmtNum(savedCount)}
          icon={Bookmark}
          description="Przez Ciebie"
        />
        <StatCard
          label="Śr. budżet"
          value={
            avgBudget != null
              ? new Intl.NumberFormat("pl-PL", {
                  notation: "compact",
                  maximumFractionDigits: 0,
                }).format(avgBudget) + " PLN"
              : "—"
          }
          icon={TrendingUp}
          description="Wartość przetargu"
        />
      </div>

      {/* Bottom section: recent + regions */}
      <div className="mt-6 grid gap-6 lg:grid-cols-5">
        {/* Recent tenders — 3 cols */}
        <div className="lg:col-span-3">
          <h2 className="mb-3 text-sm font-semibold text-foreground">
            Ostatnio dodane przetargi
          </h2>
          <div className="overflow-hidden rounded-xl border border-zinc-800/60">
            {(recentTenders ?? []).length === 0 ? (
              <div className="px-5 py-8 text-center text-sm text-muted-foreground">
                Brak przetargów w bazie
              </div>
            ) : (
              <div className="divide-y divide-zinc-800/60">
                {(recentTenders ?? []).map((t, i) => (
                  <div key={i} className="flex items-start gap-3 px-4 py-3">
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-foreground leading-snug">
                        {t.title}
                      </p>
                      <div className="mt-0.5 flex items-center gap-2">
                        {t.voivodeship && (
                          <span className="text-[11px] text-muted-foreground">
                            {t.voivodeship}
                          </span>
                        )}
                        {t.published_at && (
                          <span className="text-[11px] text-zinc-600">
                            {new Date(t.published_at).toLocaleDateString(
                              "pl-PL"
                            )}
                          </span>
                        )}
                      </div>
                    </div>
                    {t.budget_max != null && (
                      <span className="shrink-0 font-mono text-[11px] tabular-nums text-zinc-400">
                        {fmt(t.budget_max)}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Voivodeship distribution — 2 cols */}
        <div className="lg:col-span-2">
          <h2 className="mb-3 text-sm font-semibold text-foreground">
            Rozkład regionów
          </h2>
          <div className="overflow-hidden rounded-xl border border-zinc-800/60 px-4 py-3">
            {voivodeshipList.length === 0 ? (
              <p className="py-4 text-center text-sm text-muted-foreground">
                Brak danych
              </p>
            ) : (
              <div className="space-y-2.5">
                {voivodeshipList.map(([region, count]) => (
                  <div key={region}>
                    <div className="mb-0.5 flex items-center justify-between gap-2">
                      <span className="truncate text-xs text-zinc-400">
                        {region}
                      </span>
                      <span className="shrink-0 font-mono text-xs tabular-nums text-zinc-300">
                        {count}
                      </span>
                    </div>
                    <div className="h-1.5 overflow-hidden rounded-full bg-zinc-800/70">
                      <div
                        className="h-full rounded-full bg-sky-500/70"
                        style={{
                          width: `${Math.round((count / maxVoivodeship) * 100)}%`,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Pro+ upsell */}
      <Card className="mt-6 border-[#0EA5E9]/30 bg-[#0EA5E9]/5">
        <CardContent className="py-4">
          <div className="flex items-start gap-3">
            <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-[#0EA5E9]/15 text-[#0EA5E9]">
              <Lock className="size-4" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-foreground">
                Więcej statystyk w planie Pro+
              </p>
              <p className="mt-0.5 text-xs text-muted-foreground">
                Odblokuj pełne raporty: trendy rynkowe, analizę konkurencji,
                historię wygranych zamówień i prognozę budżetową.
              </p>
            </div>
            <Badge variant="outline" className="shrink-0 text-xs">
              Pro+
            </Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// ─── StatCard ────────────────────────────────────────────────────────────────

interface StatCardProps {
  label: string
  value: string
  icon: React.ElementType
  description: string
  highlight?: boolean
}

import type React from "react"

function StatCard({ label, value, icon: Icon, description, highlight }: StatCardProps) {
  return (
    <Card>
      <CardHeader className="pb-0">
        <div className="flex items-center justify-between">
          <CardDescription className="text-xs">{label}</CardDescription>
          <div
            className={`flex size-7 items-center justify-center rounded-md ${
              highlight
                ? "bg-[#0EA5E9]/15 text-[#0EA5E9]"
                : "bg-muted text-muted-foreground"
            }`}
          >
            <Icon className="size-4" />
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-2">
        <p
          className={`font-mono text-3xl font-bold tabular-nums ${
            highlight ? "text-[#0EA5E9]" : "text-foreground"
          }`}
        >
          {value}
        </p>
        <p className="mt-0.5 text-xs text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  )
}
