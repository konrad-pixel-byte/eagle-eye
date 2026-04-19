"use client"

import { useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { SearchIcon, ChevronLeftIcon, ChevronRightIcon, Bookmark } from "lucide-react"
import { toggleBookmark } from "@/lib/actions/bookmarks"
import { EmptyState } from "@/components/empty-state"
import { DeadlineProximity } from "@/components/deadline-proximity"
import type { Tender } from "@/lib/types"

const WOJEWODZTWA = [
  "dolnośląskie",
  "kujawsko-pomorskie",
  "lubelskie",
  "lubuskie",
  "łódzkie",
  "małopolskie",
  "mazowieckie",
  "opolskie",
  "podkarpackie",
  "podlaskie",
  "pomorskie",
  "śląskie",
  "świętokrzyskie",
  "warmińsko-mazurskie",
  "wielkopolskie",
  "zachodniopomorskie",
]

const PAGE_SIZE = 5

type DbStatus = Tender["status"]

const STATUS_MAP: Record<DbStatus, { label: string; className: string }> = {
  active: {
    label: "Aktywne",
    className: "bg-emerald-500/15 text-emerald-400 border-emerald-500/20",
  },
  expired: {
    label: "Wygasłe",
    className: "bg-muted text-muted-foreground border-border",
  },
  awarded: {
    label: "Rozstrzygnięte",
    className: "bg-sky-500/15 text-sky-400 border-sky-500/20",
  },
  cancelled: {
    label: "Anulowane",
    className: "bg-red-500/15 text-red-400 border-red-500/20",
  },
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

function StatusBadge({ status }: { status: DbStatus }) {
  const config = STATUS_MAP[status] ?? STATUS_MAP.expired
  return (
    <Badge className={`border ${config.className}`}>
      {config.label}
    </Badge>
  )
}

function AiScoreIndicator({ score }: { score: number }) {
  const barColor =
    score >= 70
      ? "bg-emerald-500"
      : score >= 40
        ? "bg-amber-500"
        : "bg-red-500"
  const textColor =
    score >= 70
      ? "text-emerald-400"
      : score >= 40
        ? "text-amber-400"
        : "text-red-400"

  return (
    <div className="flex items-center gap-2 min-w-[80px]">
      <div className="flex-1 h-1.5 rounded-full bg-muted overflow-hidden">
        <div
          className={`h-full rounded-full ${barColor}`}
          style={{ width: `${score}%` }}
        />
      </div>
      <span className={`text-xs font-semibold tabular-nums ${textColor}`}>
        {score}
      </span>
    </div>
  )
}

interface TenderListClientProps {
  tenders: Tender[]
  bookmarkedIds: string[]
}

export function TenderListClient({ tenders, bookmarkedIds }: TenderListClientProps) {
  const router = useRouter()

  const [search, setSearch] = useState("")
  const [region, setRegion] = useState<string>("all")
  const [status, setStatus] = useState<string>("all")
  const [cpvSearch, setCpvSearch] = useState("")
  const [budzetMin, setBudzetMin] = useState("")
  const [budzetMax, setBudzetMax] = useState("")
  const [page, setPage] = useState(1)
  const [savedIds, setSavedIds] = useState<Set<string>>(() => new Set(bookmarkedIds))
  const [togglingIds, setTogglingIds] = useState<Set<string>>(() => new Set())

  function resetPage() {
    setPage(1)
  }

  async function handleToggleBookmark(e: React.MouseEvent, tenderId: string) {
    e.stopPropagation()
    if (togglingIds.has(tenderId)) return
    setTogglingIds((prev) => new Set(prev).add(tenderId))
    const wasBookmarked = savedIds.has(tenderId)
    setSavedIds((prev) => {
      const next = new Set(prev)
      if (wasBookmarked) {
        next.delete(tenderId)
      } else {
        next.add(tenderId)
      }
      return next
    })
    try {
      await toggleBookmark(tenderId)
    } catch {
      setSavedIds((prev) => {
        const next = new Set(prev)
        if (wasBookmarked) {
          next.add(tenderId)
        } else {
          next.delete(tenderId)
        }
        return next
      })
    } finally {
      setTogglingIds((prev) => {
        const next = new Set(prev)
        next.delete(tenderId)
        return next
      })
    }
  }

  const filtered = useMemo(() => {
    return tenders.filter((t) => {
      if (search && !t.title.toLowerCase().includes(search.toLowerCase())) {
        return false
      }
      if (region !== "all" && t.voivodeship !== region) return false
      if (status !== "all" && t.status !== status) return false
      if (cpvSearch) {
        const q = cpvSearch.toLowerCase()
        const matches = t.cpv_codes.some((c) => c.toLowerCase().includes(q))
        if (!matches) return false
      }
      const budgetMinNum = budzetMin ? Number(budzetMin) : null
      const budgetMaxNum = budzetMax ? Number(budzetMax) : null
      if (budgetMinNum !== null && t.budget_max !== null && t.budget_max < budgetMinNum) {
        return false
      }
      if (budgetMaxNum !== null && t.budget_min !== null && t.budget_min > budgetMaxNum) {
        return false
      }
      return true
    })
  }, [tenders, search, region, status, cpvSearch, budzetMin, budzetMax])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const currentPage = Math.min(page, totalPages)
  const paginatedItems = filtered.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  )

  return (
    <div className="flex flex-col gap-6 p-6">
      {/* Nagłówek */}
      <div className="flex items-center gap-3">
        <h1 className="text-2xl font-semibold tracking-tight">
          Przetargi szkoleniowe
        </h1>
        <Badge className="bg-sky-500/15 text-sky-400 border border-sky-500/20 text-sm px-2.5 h-6">
          {filtered.length}
        </Badge>
      </div>

      {/* Filtry */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm text-muted-foreground font-normal">
            Filtruj przetargi
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
            {/* Wyszukiwarka */}
            <div className="relative xl:col-span-2">
              <SearchIcon className="absolute left-2.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
              <Input
                placeholder="Szukaj po tytule..."
                className="pl-8"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value)
                  resetPage()
                }}
              />
            </div>

            {/* Województwo */}
            <Select
              value={region}
              onValueChange={(v) => {
                setRegion(v ?? "all")
                resetPage()
              }}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Województwo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Wszystkie regiony</SelectItem>
                {WOJEWODZTWA.map((w) => (
                  <SelectItem key={w} value={w}>
                    {w.charAt(0).toUpperCase() + w.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Status */}
            <Select
              value={status}
              onValueChange={(v) => {
                setStatus(v ?? "all")
                resetPage()
              }}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Wszystkie statusy</SelectItem>
                <SelectItem value="active">Aktywne</SelectItem>
                <SelectItem value="expired">Wygasłe</SelectItem>
                <SelectItem value="awarded">Rozstrzygnięte</SelectItem>
                <SelectItem value="cancelled">Anulowane</SelectItem>
              </SelectContent>
            </Select>

            {/* Kody CPV */}
            <Input
              placeholder="Filtruj po CPV..."
              value={cpvSearch}
              onChange={(e) => {
                setCpvSearch(e.target.value)
                resetPage()
              }}
            />

            {/* Przedział budżetu */}
            <div className="flex items-center gap-1.5">
              <Input
                type="number"
                placeholder="Budżet min"
                value={budzetMin}
                onChange={(e) => {
                  setBudzetMin(e.target.value)
                  resetPage()
                }}
                className="w-full"
              />
              <span className="text-muted-foreground text-sm shrink-0">—</span>
              <Input
                type="number"
                placeholder="max"
                value={budzetMax}
                onChange={(e) => {
                  setBudzetMax(e.target.value)
                  resetPage()
                }}
                className="w-full"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabela */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="border-b border-border/50">
                <TableHead className="pl-4">Tytuł</TableHead>
                <TableHead>Zamawiający</TableHead>
                <TableHead>Region</TableHead>
                <TableHead>Budżet</TableHead>
                <TableHead>Termin składania</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="pr-4">AI Score</TableHead>
                <TableHead className="w-8 pr-4" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedItems.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="p-0">
                    <EmptyState
                      icon={SearchIcon}
                      title="Brak przetargów pasujących do filtrów"
                      description="Zmień kryteria wyszukiwania lub zresetuj filtry, aby zobaczyć dostępne przetargi."
                    />
                  </TableCell>
                </TableRow>
              ) : (
                paginatedItems.map((tender) => (
                  <TableRow
                    key={tender.id}
                    className="cursor-pointer hover:bg-muted/60 transition-colors"
                    onClick={() =>
                      router.push(`/dashboard/przetargi/${tender.id}`)
                    }
                  >
                    <TableCell className="pl-4 max-w-[280px]">
                      <span className="line-clamp-2 whitespace-normal leading-snug font-medium text-foreground">
                        {tender.title}
                      </span>
                    </TableCell>
                    <TableCell className="max-w-[180px]">
                      <span className="line-clamp-2 whitespace-normal text-muted-foreground text-xs">
                        {tender.contracting_authority ?? "—"}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="capitalize text-muted-foreground text-xs">
                        {tender.voivodeship ?? "—"}
                      </span>
                    </TableCell>
                    <TableCell>
                      {tender.budget_min !== null || tender.budget_max !== null ? (
                        <div className="flex flex-col gap-0.5">
                          {tender.budget_min !== null && (
                            <span className="text-xs text-muted-foreground">
                              {formatPLN(tender.budget_min)}
                            </span>
                          )}
                          {tender.budget_max !== null && (
                            <span className="text-xs text-foreground font-medium">
                              {formatPLN(tender.budget_max)}
                            </span>
                          )}
                        </div>
                      ) : (
                        <span className="text-xs text-muted-foreground">—</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {tender.deadline_submission ? (
                        <div className="flex items-center gap-2">
                          <span className="text-sm tabular-nums">
                            {formatDate(tender.deadline_submission)}
                          </span>
                          <DeadlineProximity deadline={tender.deadline_submission} />
                        </div>
                      ) : (
                        <span className="text-sm tabular-nums">—</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={tender.status} />
                    </TableCell>
                    <TableCell className="pr-4">
                      {tender.ai_relevance_score !== null ? (
                        <AiScoreIndicator score={tender.ai_relevance_score} />
                      ) : (
                        <span className="text-xs text-muted-foreground">—</span>
                      )}
                    </TableCell>
                    <TableCell className="pr-4 w-8">
                      <button
                        onClick={(e) => handleToggleBookmark(e, tender.id)}
                        disabled={togglingIds.has(tender.id)}
                        className="p-1 rounded transition-colors hover:bg-muted disabled:opacity-50 disabled:pointer-events-none"
                        aria-label={savedIds.has(tender.id) ? "Usuń z zapisanych" : "Zapisz przetarg"}
                      >
                        {togglingIds.has(tender.id) ? (
                          <span className="block size-3.5 rounded-full border-2 border-zinc-500 border-t-transparent animate-spin" />
                        ) : (
                          <Bookmark
                            size={14}
                            fill={savedIds.has(tender.id) ? "#F59E0B" : "none"}
                            style={{ color: savedIds.has(tender.id) ? "#F59E0B" : undefined }}
                            className={savedIds.has(tender.id) ? "" : "text-zinc-500"}
                          />
                        )}
                      </button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Paginacja */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Wyświetlono{" "}
          <span className="font-medium text-foreground">
            {filtered.length === 0
              ? 0
              : Math.min((currentPage - 1) * PAGE_SIZE + 1, filtered.length)}
            –{Math.min(currentPage * PAGE_SIZE, filtered.length)}
          </span>{" "}
          z{" "}
          <span className="font-medium text-foreground">{filtered.length}</span>{" "}
          wyników
        </p>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={currentPage <= 1}
          >
            <ChevronLeftIcon className="size-4" />
            Poprzednia
          </Button>
          <span className="text-sm text-muted-foreground px-1">
            Strona {currentPage} z {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage >= totalPages}
          >
            Następna
            <ChevronRightIcon className="size-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
