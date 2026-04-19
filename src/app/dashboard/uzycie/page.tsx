import { Sparkles, Target, FileText, MessageSquare } from "lucide-react"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { getTodayAiUsage, type AiUsageSummary } from "@/lib/actions/ai-usage"
import { getTierLabel, type SubscriptionTier } from "@/lib/subscription"
import type { AiEndpoint } from "@/lib/subscription"

const ENDPOINT_META: Record<AiEndpoint, { label: string; description: string; icon: typeof Target }> = {
  score: {
    label: "Ocena dopasowania",
    description: "AI scoring przetargu pod Twój profil",
    icon: Target,
  },
  summary: {
    label: "Streszczenie",
    description: "Skrót kluczowych informacji z przetargu",
    icon: FileText,
  },
  "bid-coach": {
    label: "Bid Coach",
    description: "Doradztwo strategiczne do oferty",
    icon: MessageSquare,
  },
}

export default async function AiUsagePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/auth/login")

  const { data: profile } = await supabase
    .from("profiles")
    .select("subscription_tier")
    .eq("id", user.id)
    .single<{ subscription_tier: SubscriptionTier }>()

  const tier: SubscriptionTier = profile?.subscription_tier ?? "free"
  const usage = await getTodayAiUsage()

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-3">
        <Sparkles className="size-6 text-sky-500" />
        <h1 className="text-2xl font-semibold tracking-tight">Użycie AI</h1>
        <Badge className="bg-sky-500/15 text-sky-400 border border-sky-500/20 text-sm px-2.5 h-6">
          Plan {getTierLabel(tier)}
        </Badge>
      </div>

      <p className="text-sm text-muted-foreground">
        Dzienne limity wywołań funkcji AI. Licznik resetuje się o północy (czas polski).
      </p>

      <div className="grid gap-4 md:grid-cols-3">
        {usage.map((row) => (
          <UsageCard key={row.endpoint} row={row} />
        ))}
      </div>
    </div>
  )
}

function UsageCard({ row }: { row: AiUsageSummary }) {
  const meta = ENDPOINT_META[row.endpoint]
  const Icon = meta.icon
  const pct = row.limit === 0 ? 0 : Math.min(100, (row.used / row.limit) * 100)
  const barColor = pct >= 90 ? "bg-red-500" : pct >= 70 ? "bg-amber-500" : "bg-sky-500"
  const unavailable = row.limit === 0

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Icon className="size-4 text-sky-500" />
          <CardTitle className="text-base">{meta.label}</CardTitle>
        </div>
        <CardDescription>{meta.description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {unavailable ? (
          <p className="text-sm text-muted-foreground">
            Niedostępne w Twoim planie.
          </p>
        ) : (
          <>
            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-semibold tabular-nums">
                {row.used}
                <span className="text-muted-foreground"> / {row.limit}</span>
              </span>
              <span className="text-xs text-muted-foreground">
                {row.remaining} pozostało
              </span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
              <div
                className={`h-full rounded-full transition-all ${barColor}`}
                style={{ width: `${pct}%` }}
              />
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}
