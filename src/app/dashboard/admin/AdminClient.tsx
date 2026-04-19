"use client"

import { useState, useTransition } from "react"
import { triggerScraper, triggerNotifications } from "@/lib/actions/admin"
import { Button } from "@/components/ui/button"
import { RefreshCw, Zap, CheckCircle, XCircle, Mail } from "lucide-react"
import { cn } from "@/lib/utils"

interface ScraperResult {
  ok: boolean
  message: string
  added?: number
}

export function ScraperTriggers() {
  const [results, setResults] = useState<Record<string, ScraperResult>>({})
  const [pending, startTransition] = useTransition()
  const [activeType, setActiveType] = useState<string | null>(null)

  function run(type: "bzp" | "ted" | "all") {
    setActiveType(type)
    startTransition(async () => {
      const result = await triggerScraper(type)
      setResults((prev) => ({ ...prev, [type]: result }))
      setActiveType(null)
    })
  }

  function runNotifications() {
    setActiveType("notifications")
    startTransition(async () => {
      const result = await triggerNotifications()
      setResults((prev) => ({ ...prev, notifications: result }))
      setActiveType(null)
    })
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-3">
        {(["bzp", "ted", "all"] as const).map((type) => (
          <Button
            key={type}
            variant="outline"
            size="sm"
            disabled={pending}
            onClick={() => run(type)}
            className={cn(
              "border-zinc-700 text-zinc-300 hover:bg-zinc-800",
              activeType === type && "opacity-60"
            )}
          >
            {activeType === type ? (
              <RefreshCw className="size-3.5 animate-spin" />
            ) : (
              <Zap className="size-3.5" />
            )}
            {type === "all" ? "Oba scraperzy" : `Scraper ${type.toUpperCase()}`}
          </Button>
        ))}
        <Button
          variant="outline"
          size="sm"
          disabled={pending}
          onClick={runNotifications}
          className={cn(
            "border-zinc-700 text-zinc-300 hover:bg-zinc-800",
            activeType === "notifications" && "opacity-60"
          )}
        >
          {activeType === "notifications" ? (
            <RefreshCw className="size-3.5 animate-spin" />
          ) : (
            <Mail className="size-3.5" />
          )}
          Digest dzienny
        </Button>
      </div>

      {Object.entries(results).map(([type, result]) => (
        <div
          key={type}
          className={cn(
            "flex items-start gap-2 rounded-lg border px-3 py-2 text-sm",
            result.ok
              ? "border-emerald-800/50 bg-emerald-950/20 text-emerald-400"
              : "border-red-800/50 bg-red-950/20 text-red-400"
          )}
        >
          {result.ok ? (
            <CheckCircle className="size-4 mt-0.5 shrink-0" />
          ) : (
            <XCircle className="size-4 mt-0.5 shrink-0" />
          )}
          <div>
            <span className="font-mono text-xs font-bold uppercase">{type}</span>
            {" — "}
            {result.message}
          </div>
        </div>
      ))}
    </div>
  )
}
