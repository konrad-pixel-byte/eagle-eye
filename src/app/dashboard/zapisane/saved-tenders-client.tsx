"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Bookmark, Calendar, MapPin, Building2, Trash2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { EmptyState } from "@/components/empty-state"
import { buttonVariants } from "@/components/ui/button"
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

export function SavedTendersClient({ savedTenders }: SavedTendersClientProps) {
  const router = useRouter()
  const [items, setItems] = useState(savedTenders)
  const [removingIds, setRemovingIds] = useState<Set<string>>(() => new Set())

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

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
      {items.map((row) => {
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
  )
}
