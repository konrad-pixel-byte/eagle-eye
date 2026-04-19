"use client"

import { useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Bookmark, Calendar, MapPin, Building2, Trash2, Search, X } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { EmptyState } from "@/components/empty-state"
import { buttonVariants } from "@/components/ui/button"
import { DeadlineProximity } from "@/components/deadline-proximity"
import { removeSavedTender } from "@/lib/actions/saved-tenders"
import { cn } from "@/lib/utils"
import type { Tender } from "@/lib/types"

export interface SavedTenderRow {
  id: string
  created_at: string
  tenders: Tender
}

interface SavedTendersClientProps {
  savedTenders: SavedTenderRow[]
}

function formatPLN(value: number): string {
  return new Intl.NumberFormat("pl-PL", {
    style: "currency",
    currency: "PLN",
    maximumFractionDigits: 0,
  }).format(value)
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("pl-PL", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  })
}

function AiScoreBar({ score }: { score: number }) {
  const barColor =
    score >= 70 ? "bg-emerald-500" : score >= 40 ? "bg-amber-500" : "bg-red-500"
  const textColor =
    score >= 70 ? "text-emerald-400" : score >= 40 ? "text-amber-400" : "text-red-400"

  return (
    <div className="flex items-center gap-2 min-w-[80px]">
      <div className="flex-1 h-1.5 rounded-full bg-zinc-800 overflow-hidden">
        <div className={`h-full rounded-full ${barColor}`} style={{ width: `${score}%` }} />
      </div>
      <span className={`text-xs font-semibold font-mono tabular-nums ${textColor}`}>
        {score}
      </span>
    </div>
  )
}

type SourceFilter = "all" | "BZP" | "TED"
type StatusFilter = "all" | "active" | "inactive"

export function SavedTendersClient({ savedTenders }: SavedTendersClientProps) {
  const router = useRouter()
  const [items, setItems] = useState(savedTenders)
  const [removingIds, setRemovingIds] = useState<Set<string>>(() => new Set())
  const [query, setQuery] = useState("")
  const [source, setSource] = useState<SourceFilter>("all")
  const [status, setStatus] = useState<StatusFilter>("all")

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return items.filter((row) => {
      const t = row.tenders
      if (source !== "all" && t.source !== source) return false
      if (status === "active" && t.status !== "active") return false
      if (status === "inactive" && t.status === "active") return false
      if (q) {
        const hay = `${t.title} ${t.contracting_authority ?? ""} ${t.voivodeship ?? ""}`.toLowerCase()
        if (!hay.includes(q)) return false
      }
      return true
    })
  }, [items, query, source, status])

  async function handleRemove(e: React.MouseEvent, savedId: string) {
    e.stopPropagation()
    if (removingIds.has(savedId)) return
    setRemovingIds((prev) => new Set(prev).add(savedId))
    // Optimistic removal
    setItems((prev) => prev.filter((row) => row.id !== savedId))
    try {
      await removeSavedTender(savedId)
    } catch {
      // Rollback on error
      setItems(savedTenders)
    } finally {
      setRemovingIds((prev) => {
        const next = new Set(prev)
        next.delete(savedId)
        return next
      })
    }
  }

  if (items.length === 0) {
    return (
      <EmptyState
        icon={Bookmark}
        title="Nie masz jeszcze zapisanych przetargów"
        description="Przeglądaj przetargi i zapisuj te, które Cię interesują — znajdziesz je tutaj."
        action={
          <Link
            href="/dashboard/przetargi"
            className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
          >
            Przeglądaj przetargi
          </Link>
        }
      />
    )
  }

  const filtersActive = query !== "" || source !== "all" || status !== "all"

  return (
    <div className="flex flex-col gap-4">
      {/* Filter bar */}
      <div className="flex flex-wrap items-center gap-2">
        <div className="relative min-w-[200px] flex-1 max-w-md">
          <Search className="absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Szukaj po tytule, zamawiającym, województwie…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="h-9 w-full rounded-md border border-input bg-transparent pl-8 pr-8 text-sm outline-none placeholder:text-muted-foreground focus:border-[#0EA5E9]"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              aria-label="Wyczyść wyszukiwanie"
            >
              <X className="size-3.5" />
            </button>
          )}
        </div>
        <div className="flex items-center gap-1 rounded-md border border-input p-0.5">
          {(["all", "BZP", "TED"] as const).map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setSource(s)}
              className={cn(
                "rounded px-2.5 py-1 text-xs font-medium transition-colors",
                source === s
                  ? "bg-[#0EA5E9]/15 text-[#0EA5E9]"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {s === "all" ? "Wszystkie" : s}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-1 rounded-md border border-input p-0.5">
          {(["all", "active", "inactive"] as const).map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setStatus(s)}
              className={cn(
                "rounded px-2.5 py-1 text-xs font-medium transition-colors",
                status === s
                  ? "bg-[#0EA5E9]/15 text-[#0EA5E9]"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {s === "all" ? "Dowolny" : s === "active" ? "Aktywne" : "Zakończone"}
            </button>
          ))}
        </div>
        <span className="ml-auto font-mono text-xs text-muted-foreground">
          {filtered.length} / {items.length}
        </span>
      </div>

      {filtered.length === 0 && filtersActive ? (
        <div className="rounded-lg border border-dashed border-border/50 p-8 text-center text-sm text-muted-foreground">
          Żaden zapisany przetarg nie pasuje do filtrów.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
      {filtered.map((row) => {
        const tender = row.tenders
        return (
          <Card
            key={row.id}
            className="cursor-pointer border border-border/50 bg-card/60 transition-colors hover:bg-muted/30"
            onClick={() => router.push(`/dashboard/przetargi/${tender.id}`)}
          >
            <CardContent className="p-4 flex flex-col gap-3">
              {/* Title */}
              <p className="text-sm font-medium text-foreground line-clamp-3 leading-snug">
                {tender.title}
              </p>

              {/* Meta */}
              <div className="flex flex-col gap-1.5">
                {tender.contracting_authority && (
                  <div className="flex items-start gap-1.5 text-xs text-muted-foreground">
                    <Building2 className="size-3 mt-0.5 shrink-0" />
                    <span className="line-clamp-1">{tender.contracting_authority}</span>
                  </div>
                )}
                {tender.voivodeship && (
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <MapPin className="size-3 shrink-0" />
                    <span className="capitalize">{tender.voivodeship}</span>
                  </div>
                )}
                {tender.deadline_submission && (
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Calendar className="size-3 shrink-0" />
                    <span className="font-mono tabular-nums">
                      {formatDate(tender.deadline_submission)}
                    </span>
                    <DeadlineProximity
                      deadline={tender.deadline_submission}
                      className="ml-auto"
                    />
                  </div>
                )}
              </div>

              {/* Budget */}
              {(tender.budget_min !== null || tender.budget_max !== null) && (
                <div className="flex items-center gap-1 text-xs">
                  {tender.budget_min !== null && (
                    <span className="text-muted-foreground font-mono">
                      {formatPLN(tender.budget_min)}
                    </span>
                  )}
                  {tender.budget_min !== null && tender.budget_max !== null && (
                    <span className="text-muted-foreground">—</span>
                  )}
                  {tender.budget_max !== null && (
                    <span className="font-semibold text-foreground font-mono">
                      {formatPLN(tender.budget_max)}
                    </span>
                  )}
                </div>
              )}

              {/* Footer: AI score + status + remove */}
              <div className="flex items-center justify-between gap-2 pt-1 border-t border-border/40">
                <div className="flex items-center gap-2">
                  {tender.ai_relevance_score !== null && (
                    <AiScoreBar score={tender.ai_relevance_score} />
                  )}
                  <Badge
                    className={cn(
                      "border text-xs",
                      tender.status === "active"
                        ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/20"
                        : "bg-muted text-muted-foreground border-border"
                    )}
                  >
                    {tender.status === "active"
                      ? "Aktywny"
                      : tender.status === "expired"
                        ? "Wygasły"
                        : tender.status === "awarded"
                          ? "Rozstrzygnięty"
                          : "Anulowany"}
                  </Badge>
                </div>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  onClick={(e) => handleRemove(e, row.id)}
                  disabled={removingIds.has(row.id)}
                  aria-label="Usuń z zapisanych"
                  className="shrink-0 text-muted-foreground hover:text-red-400"
                >
                  <Trash2 className="size-3.5" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )
      })}
        </div>
      )}
    </div>
  )
}
