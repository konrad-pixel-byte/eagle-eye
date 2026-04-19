import { notFound } from "next/navigation"
import Link from "next/link"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button, buttonVariants } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import {
  BrainIcon,
  ChevronLeftIcon,
  FileTextIcon,
  FileIcon,
  PaperclipIcon,
  BookmarkIcon,
  CalculatorIcon,
  BellIcon,
  LockIcon,
  CalendarIcon,
  BuildingIcon,
  MapPinIcon,
  TagIcon,
  ClockIcon,
  StarIcon,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { createClient } from "@/lib/supabase/server"
import { getUserBookmarks } from "@/lib/actions/bookmarks"
import { getUserTier } from "@/lib/actions/subscription"
import { recordTenderView } from "@/lib/actions/gamification"
import { BookmarkButton } from "@/components/dashboard/bookmark-button"
import { CopyLinkButton } from "@/components/dashboard/copy-link-button"
import { AiPanel } from "./ai-panel"
import type { Tender } from "@/lib/types"

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

type TenderStatus = Tender["status"]

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
    month: "long",
    year: "numeric",
  })
}

function StatusBadge({ status }: { status: TenderStatus }) {
  const config: Record<TenderStatus, { label: string; className: string }> = {
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
  const { label, className } = config[status]
  return <Badge className={`border text-sm px-3 h-7 ${className}`}>{label}</Badge>
}

function DeadlineBadge({ deadline }: { deadline: string }) {
  const msLeft = new Date(deadline).getTime() - Date.now()
  const daysLeft = Math.ceil(msLeft / (1000 * 60 * 60 * 24))

  if (daysLeft < 0) {
    return (
      <Badge className="bg-muted text-muted-foreground border border-border text-sm px-3 h-7 gap-1.5">
        <ClockIcon className="size-3.5" />
        Termin minął
      </Badge>
    )
  }

  const className =
    daysLeft <= 3
      ? "bg-red-500/15 text-red-400 border-red-500/20"
      : daysLeft <= 7
        ? "bg-amber-500/15 text-amber-400 border-amber-500/20"
        : "bg-sky-500/15 text-sky-400 border-sky-500/20"

  const label =
    daysLeft === 0
      ? "Dziś termin!"
      : daysLeft === 1
        ? "Zostaje 1 dzień"
        : `Zostaje ${daysLeft} dni`

  return (
    <Badge className={`border text-sm px-3 h-7 gap-1.5 ${className}`}>
      <ClockIcon className="size-3.5" />
      {label}
    </Badge>
  )
}

function AiScoreBadge({ score }: { score: number }) {
  const className =
    score >= 70
      ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/20"
      : score >= 40
        ? "bg-amber-500/15 text-amber-400 border-amber-500/20"
        : "bg-red-500/15 text-red-400 border-red-500/20"

  return (
    <Badge className={`border text-sm px-3 h-7 gap-1.5 ${className}`}>
      <StarIcon className="size-3.5" />
      AI Score: {score}/100
    </Badge>
  )
}

function DocumentTypeIcon({ name }: { name: string }) {
  const lower = name.toLowerCase()
  if (lower.includes("swz") || lower.includes("specyfikacja"))
    return <FileTextIcon className="size-4 text-sky-400 shrink-0" />
  if (lower.includes("formularz"))
    return <FileIcon className="size-4 text-amber-400 shrink-0" />
  return <PaperclipIcon className="size-4 text-muted-foreground shrink-0" />
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()

  const [{ data: tender }, bookmarkedIds, userTier] = await Promise.all([
    supabase.from("tenders").select("*").eq("id", id).single<Tender>(),
    getUserBookmarks(),
    getUserTier(),
  ])

  // Fire-and-forget XP for viewing this tender
  void recordTenderView(id)

  if (!tender) {
    notFound()
  }

  const isBookmarked = bookmarkedIds.includes(tender.id)

  return (
    <div className="flex flex-col gap-6 p-6">
      {/* Back navigation */}
      <div>
        <Link
          href="/dashboard/przetargi"
          className={cn(
            buttonVariants({ variant: "ghost", size: "sm" }),
            "-ml-2 text-muted-foreground hover:text-foreground"
          )}
        >
          <ChevronLeftIcon className="size-4" />
          Wróć do listy przetargów
        </Link>
      </div>

      {/* Title + badges */}
      <div className="flex flex-col gap-3">
        <h1 className="text-2xl font-semibold leading-tight tracking-tight">
          {tender.title}
        </h1>
        <div className="flex flex-wrap items-center gap-2">
          <StatusBadge status={tender.status} />
          {tender.deadline_submission && tender.status === "active" && (
            <DeadlineBadge deadline={tender.deadline_submission} />
          )}
          {tender.ai_relevance_score !== null && (
            <AiScoreBadge score={tender.ai_relevance_score} />
          )}
        </div>
      </div>

      {/* Main grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left column — 2/3 */}
        <div className="flex flex-col gap-6 lg:col-span-2">
          {/* AI Panel */}
          <AiPanel
            tenderId={tender.id}
            userTier={userTier}
            initialSummary={tender.ai_summary}
            initialScore={tender.ai_relevance_score}
          />

          {/* Key details */}
          <Card>
            <CardHeader>
              <CardTitle>Szczegóły przetargu</CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {tender.contracting_authority && (
                  <div className="flex flex-col gap-1">
                    <dt className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground uppercase tracking-wide">
                      <BuildingIcon className="size-3.5" />
                      Zamawiający
                    </dt>
                    <dd className="text-sm text-foreground font-medium">
                      {tender.contracting_authority}
                    </dd>
                    {tender.contracting_authority_address && (
                      <dd className="text-xs text-muted-foreground">
                        {tender.contracting_authority_address}
                      </dd>
                    )}
                  </div>
                )}

                {tender.voivodeship && (
                  <div className="flex flex-col gap-1">
                    <dt className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground uppercase tracking-wide">
                      <MapPinIcon className="size-3.5" />
                      Region
                    </dt>
                    <dd className="text-sm text-foreground font-medium capitalize">
                      {tender.voivodeship}
                      {tender.city ? ` — ${tender.city}` : ""}
                    </dd>
                  </div>
                )}

                {tender.cpv_codes && tender.cpv_codes.length > 0 && (
                  <div className="flex flex-col gap-1 sm:col-span-2">
                    <dt className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground uppercase tracking-wide">
                      <TagIcon className="size-3.5" />
                      Kody CPV
                    </dt>
                    <dd className="flex flex-col gap-1.5">
                      {tender.cpv_codes.map((code) => (
                        <div key={code} className="flex items-center gap-2">
                          <Badge variant="outline" className="font-mono text-xs">
                            {code}
                          </Badge>
                        </div>
                      ))}
                    </dd>
                  </div>
                )}

                <Separator className="sm:col-span-2" />

                {tender.published_at && (
                  <div className="flex flex-col gap-1">
                    <dt className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground uppercase tracking-wide">
                      <CalendarIcon className="size-3.5" />
                      Opublikowano
                    </dt>
                    <dd className="text-sm text-foreground">
                      {formatDate(tender.published_at)}
                    </dd>
                  </div>
                )}

                {tender.deadline_submission && (
                  <div className="flex flex-col gap-1">
                    <dt className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground uppercase tracking-wide">
                      <ClockIcon className="size-3.5" />
                      Termin składania ofert
                    </dt>
                    <dd className="text-sm text-foreground font-medium">
                      {formatDate(tender.deadline_submission)}
                    </dd>
                  </div>
                )}

                {tender.deadline_questions && (
                  <div className="flex flex-col gap-1">
                    <dt className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground uppercase tracking-wide">
                      <ClockIcon className="size-3.5" />
                      Termin na pytania
                    </dt>
                    <dd className="text-sm text-foreground">
                      {formatDate(tender.deadline_questions)}
                    </dd>
                  </div>
                )}

                {(tender.budget_min !== null || tender.budget_max !== null) && (
                  <div className="flex flex-col gap-1">
                    <dt className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground uppercase tracking-wide">
                      Budżet szacunkowy
                    </dt>
                    <dd className="text-sm text-foreground">
                      {tender.budget_min !== null && (
                        <>
                          <span className="text-muted-foreground">od </span>
                          <span className="font-medium">{formatPLN(tender.budget_min)}</span>
                        </>
                      )}
                      {tender.budget_max !== null && (
                        <>
                          <span className="text-muted-foreground"> do </span>
                          <span className="font-semibold text-sky-400">{formatPLN(tender.budget_max)}</span>
                        </>
                      )}
                    </dd>
                  </div>
                )}
              </dl>
            </CardContent>
          </Card>

          {/* Description */}
          {tender.description && (
            <Card>
              <CardHeader>
                <CardTitle>Opis przedmiotu zamówienia</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-foreground leading-relaxed whitespace-pre-line">
                  {tender.description}
                </p>
              </CardContent>
            </Card>
          )}

          {/* Documents placeholder */}
          <Card>
            <CardHeader>
              <CardTitle>Dokumenty</CardTitle>
              <CardDescription>
                Pliki dostępne w ramach postępowania
              </CardDescription>
            </CardHeader>
            <CardContent>
              {tender.source_url ? (
                <ul className="flex flex-col divide-y divide-border">
                  <li className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
                    <DocumentTypeIcon name="Specyfikacja Warunków Zamówienia" />
                    <span className="flex-1 text-sm text-foreground">
                      Specyfikacja Warunków Zamówienia (SWZ)
                    </span>
                    <a
                      href={tender.source_url ?? "#"}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={cn(
                        buttonVariants({ variant: "ghost", size: "sm" }),
                        "text-xs text-muted-foreground"
                      )}
                    >
                      Otwórz
                    </a>
                  </li>
                </ul>
              ) : (
                <p className="text-sm text-muted-foreground text-center py-6">
                  Brak dostępnych dokumentów
                </p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right column — 1/3 */}
        <div className="flex flex-col gap-6">
          {/* Quick actions */}
          <Card>
            <CardHeader>
              <CardTitle>Szybkie akcje</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-2">
                <BookmarkButton tenderId={tender.id} isBookmarked={isBookmarked} />
                <CopyLinkButton />
                <Button
                  variant="outline"
                  className="w-full justify-start gap-2"
                >
                  <CalculatorIcon className="size-4 text-sky-400" />
                  Oblicz ofertę
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start gap-2"
                >
                  <BellIcon className="size-4 text-emerald-400" />
                  Ustaw alert
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Bid Calculator — upgrade gate */}
          <Card className="relative overflow-hidden">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CalculatorIcon className="size-5 text-muted-foreground" />
                Kalkulator ofert
              </CardTitle>
              <CardDescription>
                Kalkulator ofert — dostępny w planie Basic+
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center gap-4 rounded-lg border border-dashed border-border bg-muted/20 px-4 py-8 text-center">
                <div className="flex size-12 items-center justify-center rounded-full bg-muted">
                  <LockIcon className="size-5 text-muted-foreground" />
                </div>
                <div className="flex flex-col gap-1">
                  <p className="text-sm font-medium text-foreground">
                    Funkcja niedostępna w Twoim planie
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Kalkulator ofert pozwala automatycznie wyliczyć optymalną cenę na podstawie historycznych danych.
                  </p>
                </div>
                <Button
                  size="sm"
                  className="bg-amber-500 hover:bg-amber-600 text-white border-0 w-full"
                >
                  Przejdź na plan Basic+
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
