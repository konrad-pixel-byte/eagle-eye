import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { getAdminStats } from "@/lib/actions/admin"
import { ScraperTriggers } from "./AdminClient"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { FileText, Users, Bookmark, Database, Zap, Clock, TrendingUp, AlertCircle, Activity, CheckCircle2, XCircle } from "lucide-react"

export default async function AdminPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const adminEmail = process.env.ADMIN_EMAIL
  if (!user || !adminEmail || user.email !== adminEmail) redirect("/dashboard")

  const stats = await getAdminStats()

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      {/* Header */}
      <div className="mb-8 flex items-center gap-3">
        <div className="flex size-10 items-center justify-center rounded-lg bg-violet-950/50">
          <Database className="size-5 text-violet-400" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Panel administratora</h1>
          <p className="text-sm text-zinc-500">Scraperzy, statystyki, monitoring</p>
        </div>
        <Badge variant="outline" className="ml-auto border-violet-800 text-violet-400">
          Admin
        </Badge>
      </div>

      {/* Stat cards */}
      <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatCard icon={FileText} label="Przetargi" value={stats.tenderCount} color="sky" />
        <StatCard icon={Users} label="Użytkownicy" value={stats.userCount} color="emerald" />
        <StatCard icon={Bookmark} label="Zapisane" value={stats.savedTenderCount} color="amber" />
        <div className="col-span-2 sm:col-span-1">
          <Card className="h-full border-zinc-800 bg-zinc-900/50">
            <CardContent className="flex h-full flex-col justify-center p-4">
              <p className="text-xs text-zinc-500 mb-2">Źródła</p>
              <div className="flex gap-3">
                <div>
                  <p className="font-mono text-lg font-bold text-zinc-200">{stats.bzpCount}</p>
                  <p className="text-xs text-zinc-600">BZP</p>
                </div>
                <div className="w-px bg-zinc-800" />
                <div>
                  <p className="font-mono text-lg font-bold text-zinc-200">{stats.tedCount}</p>
                  <p className="text-xs text-zinc-600">TED</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Revenue & subscriptions */}
      <Card className="mb-8 border-zinc-800 bg-zinc-900/50">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <TrendingUp className="size-4 text-emerald-400" />
            Przychody i subskrypcje
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <div>
              <p className="text-xs text-zinc-500 mb-1">MRR</p>
              <p className="font-mono text-2xl font-bold text-emerald-400">
                {(stats.mrrGrosze / 100).toLocaleString("pl-PL", {
                  style: "currency",
                  currency: "PLN",
                  maximumFractionDigits: 0,
                })}
              </p>
            </div>
            <div>
              <p className="text-xs text-zinc-500 mb-1">Aktywnie płacący</p>
              <p className="font-mono text-2xl font-bold text-zinc-200">{stats.activePaying}</p>
            </div>
            <div>
              <p className="text-xs text-zinc-500 mb-1">W trialu</p>
              <p className="font-mono text-2xl font-bold text-sky-400">{stats.trialingCount}</p>
            </div>
            <div>
              <p className="text-xs text-zinc-500 mb-1 flex items-center gap-1">
                {stats.pastDueCount > 0 && <AlertCircle className="size-3 text-red-400" />}
                Past due
              </p>
              <p className={`font-mono text-2xl font-bold ${stats.pastDueCount > 0 ? "text-red-400" : "text-zinc-600"}`}>
                {stats.pastDueCount}
              </p>
            </div>
          </div>

          <div className="border-t border-zinc-800 pt-4">
            <p className="text-xs text-zinc-500 mb-2">Podział planów</p>
            <div className="grid grid-cols-4 gap-3">
              <TierPill label="Free" count={stats.tierBreakdown.free} color="zinc" />
              <TierPill label="Basic" count={stats.tierBreakdown.basic} color="sky" />
              <TierPill label="Pro" count={stats.tierBreakdown.pro} color="violet" />
              <TierPill label="Enterprise" count={stats.tierBreakdown.enterprise} color="amber" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Scraper triggers */}
      <Card className="mb-8 border-zinc-800 bg-zinc-900/50">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <Zap className="size-4 text-yellow-400" />
            Ręczne uruchomienie scraperów
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4 text-sm text-zinc-500">
            Wymaga ustawionego <code className="rounded bg-zinc-800 px-1 py-0.5 text-xs">CRON_SECRET</code>{" "}
            i{" "}
            <code className="rounded bg-zinc-800 px-1 py-0.5 text-xs">NEXT_PUBLIC_APP_URL</code>{" "}
            w zmiennych środowiskowych Coolify.
          </p>
          <ScraperTriggers />
        </CardContent>
      </Card>

      {/* Cron heartbeats */}
      <Card className="mb-8 border-zinc-800 bg-zinc-900/50">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <Activity className="size-4 text-sky-400" />
            Status zadań cyklicznych
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {stats.cronHeartbeats.length === 0 ? (
            <p className="px-6 py-8 text-center text-sm text-zinc-500">
              Brak danych — żadne zadanie cykliczne jeszcze nie zaraportowało.
            </p>
          ) : (
            <div className="divide-y divide-zinc-800">
              {stats.cronHeartbeats.map((hb) => {
                const ageMs = Date.now() - new Date(hb.last_run_at).getTime()
                const ageH = ageMs / (1000 * 60 * 60)
                const stale =
                  (hb.job_name.startsWith("scraper") && ageH > 25) ||
                  (hb.job_name === "notifications-daily" && ageH > 25)
                const statusOk = hb.last_status === "ok" && !stale
                return (
                  <div key={hb.job_name} className="flex items-center gap-3 px-4 py-3">
                    {statusOk ? (
                      <CheckCircle2 className="size-4 text-emerald-400 shrink-0" />
                    ) : (
                      <XCircle className="size-4 text-red-400 shrink-0" />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="font-mono text-sm text-zinc-200">{hb.job_name}</p>
                      {hb.details && (
                        <p className="truncate text-xs text-zinc-500">
                          {JSON.stringify(hb.details)}
                        </p>
                      )}
                    </div>
                    <div className="shrink-0 text-right">
                      <p className="font-mono text-xs text-zinc-400">
                        {new Date(hb.last_run_at).toLocaleString("pl-PL", {
                          day: "2-digit",
                          month: "2-digit",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                      {hb.duration_ms !== null && (
                        <p className="font-mono text-xs text-zinc-600">
                          {hb.duration_ms}ms
                        </p>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recent signups */}
      <Card className="mb-8 border-zinc-800 bg-zinc-900/50">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <Users className="size-4 text-emerald-400" />
            Ostatnio zarejestrowani
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {stats.recentUsers.length === 0 ? (
            <p className="px-6 py-8 text-center text-sm text-zinc-500">
              Brak użytkowników.
            </p>
          ) : (
            <div className="divide-y divide-zinc-800">
              {stats.recentUsers.map((u) => (
                <div key={u.id} className="flex items-center gap-3 px-4 py-3">
                  <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-emerald-950/50 text-xs font-semibold uppercase text-emerald-400">
                    {u.email.slice(0, 2)}
                  </div>
                  <p className="flex-1 truncate text-sm text-zinc-300">{u.email}</p>
                  <span className="shrink-0 font-mono text-xs text-zinc-600">
                    {new Date(u.created_at).toLocaleString("pl-PL", {
                      day: "2-digit",
                      month: "2-digit",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recent tenders */}
      <Card className="border-zinc-800 bg-zinc-900/50">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <Clock className="size-4 text-zinc-400" />
            Ostatnio dodane przetargi
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {stats.recentTenders.length === 0 ? (
            <p className="px-6 py-8 text-center text-sm text-zinc-500">
              Brak danych — uruchom scraper.
            </p>
          ) : (
            <div className="divide-y divide-zinc-800">
              {stats.recentTenders.map((t) => (
                <div key={t.id} className="flex items-center gap-3 px-4 py-3">
                  <Badge
                    variant="outline"
                    className={
                      t.source === "TED"
                        ? "shrink-0 border-sky-800 text-sky-400 text-xs"
                        : "shrink-0 border-emerald-800 text-emerald-400 text-xs"
                    }
                  >
                    {t.source}
                  </Badge>
                  <p className="flex-1 truncate text-sm text-zinc-300">{t.title}</p>
                  <span className="shrink-0 font-mono text-xs text-zinc-600">
                    {new Date(t.created_at).toLocaleString("pl-PL", {
                      day: "2-digit",
                      month: "2-digit",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

function TierPill({
  label,
  count,
  color,
}: {
  label: string
  count: number
  color: "zinc" | "sky" | "violet" | "amber"
}) {
  const colorMap = {
    zinc: "border-zinc-700 text-zinc-400",
    sky: "border-sky-800 text-sky-400",
    violet: "border-violet-800 text-violet-400",
    amber: "border-amber-800 text-amber-400",
  }

  return (
    <div className={`rounded-md border bg-zinc-950/50 px-3 py-2 ${colorMap[color]}`}>
      <p className="text-xs opacity-70">{label}</p>
      <p className="font-mono text-lg font-bold">{count}</p>
    </div>
  )
}

function StatCard({
  icon: Icon,
  label,
  value,
  color,
}: {
  icon: React.ElementType
  label: string
  value: number
  color: "sky" | "emerald" | "amber"
}) {
  const colorMap = {
    sky: "text-sky-400 bg-sky-950/40",
    emerald: "text-emerald-400 bg-emerald-950/40",
    amber: "text-amber-400 bg-amber-950/40",
  }

  return (
    <Card className="border-zinc-800 bg-zinc-900/50">
      <CardContent className="p-4">
        <div className={`mb-2 inline-flex size-8 items-center justify-center rounded-lg ${colorMap[color]}`}>
          <Icon className="size-4" />
        </div>
        <p className="font-mono text-2xl font-bold text-zinc-200">
          {value.toLocaleString("pl-PL")}
        </p>
        <p className="text-xs text-zinc-500">{label}</p>
      </CardContent>
    </Card>
  )
}
