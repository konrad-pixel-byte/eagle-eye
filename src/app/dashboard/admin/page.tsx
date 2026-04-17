import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { getAdminStats } from "@/lib/actions/admin"
import { ScraperTriggers } from "./AdminClient"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { FileText, Users, Bookmark, Database, Zap, Clock } from "lucide-react"

const ADMIN_EMAIL = process.env.ADMIN_EMAIL ?? "conrad.bednarski@gmail.com"

export default async function AdminPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user || user.email !== ADMIN_EMAIL) redirect("/dashboard")

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
