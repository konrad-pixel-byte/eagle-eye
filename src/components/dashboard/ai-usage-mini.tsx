import Link from "next/link"
import { Sparkles } from "lucide-react"
import { getTodayAiUsage } from "@/lib/actions/ai-usage"
import type { AiEndpoint } from "@/lib/subscription"

const LABELS: Record<AiEndpoint, string> = {
  score: "Score",
  summary: "Streszczenie",
  "bid-coach": "Coach",
}

// Compact quota strip rendered above the tender AI panel so users can see
// remaining daily calls without leaving the tender page. Hidden when quotas
// are effectively unlimited (enterprise) to reduce clutter.
export async function AiUsageMini() {
  const usage = await getTodayAiUsage()
  if (usage.length === 0) return null

  const isUnlimited = usage.every((u) => u.limit >= 9999)
  if (isUnlimited) return null

  return (
    <Link
      href="/dashboard/uzycie"
      className="group flex flex-wrap items-center gap-3 rounded-lg border border-border/50 bg-card/40 px-3 py-2 text-xs transition-colors hover:bg-muted/30"
    >
      <div className="flex items-center gap-1.5 text-muted-foreground">
        <Sparkles className="size-3.5 text-amber-400" />
        <span>Dzienny limit AI:</span>
      </div>
      {usage.map((u) => {
        const ratio = u.limit > 0 ? u.used / u.limit : 0
        const color =
          ratio >= 1
            ? "text-red-400"
            : ratio >= 0.7
              ? "text-amber-400"
              : "text-emerald-400"
        return (
          <span key={u.endpoint} className="flex items-center gap-1">
            <span className="text-muted-foreground">{LABELS[u.endpoint]}:</span>
            <span className={`font-mono tabular-nums ${color}`}>
              {u.used}/{u.limit}
            </span>
          </span>
        )
      })}
      <span className="ml-auto text-[11px] text-muted-foreground group-hover:text-foreground">
        Szczegóły →
      </span>
    </Link>
  )
}
