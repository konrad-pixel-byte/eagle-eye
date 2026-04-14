"use client"

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

const MOCK_TENDER = {
  id: "1",
  title: "Szkolenia z zakresu obsługi klienta dla pracowników urzędu",
  zamawiajacy: "Urząd Miasta Warszawa",
  adresZamawiajacego: "pl. Bankowy 3/5, 00-950 Warszawa",
  region: "mazowieckie",
  cpvCodes: [
    { code: "80533100-0", label: "Usługi szkolenia komputerowego" },
    { code: "80500000-9", label: "Usługi szkoleniowe" },
    { code: "80521000-2", label: "Usługi opracowywania programów szkoleniowych" },
  ],
  cpvGroup: "Szkolenia personelu",
  budzetMin: 50000,
  budzetMax: 150000,
  opublikowano: "2025-03-01",
  terminSkladaniaOfert: "2025-05-15",
  terminNaPytania: "2025-04-30",
  status: "aktywne" as const,
  aiScore: 87,
  dokumenty: [
    { nazwa: "Specyfikacja Warunków Zamówienia (SWZ)", typ: "swz" },
    { nazwa: "Formularz ofertowy — Załącznik nr 1", typ: "formularz" },
    { nazwa: "Wzór umowy — Załącznik nr 2", typ: "zalacznik" },
    { nazwa: "Opis przedmiotu zamówienia — Załącznik nr 3", typ: "zalacznik" },
  ],
}

type TenderStatus = "aktywne" | "wygasle" | "rozstrzygniete" | "anulowane"

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
    aktywne: {
      label: "Aktywne",
      className: "bg-emerald-500/15 text-emerald-400 border-emerald-500/20",
    },
    wygasle: {
      label: "Wygasłe",
      className: "bg-muted text-muted-foreground border-border",
    },
    rozstrzygniete: {
      label: "Rozstrzygnięte",
      className: "bg-sky-500/15 text-sky-400 border-sky-500/20",
    },
    anulowane: {
      label: "Anulowane",
      className: "bg-red-500/15 text-red-400 border-red-500/20",
    },
  }
  const { label, className } = config[status]
  return <Badge className={`border text-sm px-3 h-7 ${className}`}>{label}</Badge>
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

function DocumentIcon({ typ }: { typ: string }) {
  if (typ === "swz") return <FileTextIcon className="size-4 text-sky-400 shrink-0" />
  if (typ === "formularz") return <FileIcon className="size-4 text-amber-400 shrink-0" />
  return <PaperclipIcon className="size-4 text-muted-foreground shrink-0" />
}

export default function PrzetargDetailPage() {
  const tender = MOCK_TENDER

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
          <AiScoreBadge score={tender.aiScore} />
        </div>
      </div>

      {/* Main grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left column — 2/3 */}
        <div className="flex flex-col gap-6 lg:col-span-2">
          {/* AI Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BrainIcon className="size-5 text-sky-400" />
                Analiza AI
              </CardTitle>
              <CardDescription>
                Automatyczne podsumowanie i ocena dopasowania przetargu
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center gap-4 rounded-lg border border-dashed border-border bg-muted/30 px-6 py-10 text-center">
                <BrainIcon className="size-10 text-sky-400/50" />
                <div className="flex flex-col gap-1">
                  <p className="text-sm font-medium text-foreground">
                    Analiza AI zostanie wygenerowana automatycznie...
                  </p>
                  <p className="text-xs text-muted-foreground">
                    System przetworzy dokumenty i przygotuje szczegółowe podsumowanie wraz z oceną szansy na wygraną.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Key details */}
          <Card>
            <CardHeader>
              <CardTitle>Szczegóły przetargu</CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="flex flex-col gap-1">
                  <dt className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground uppercase tracking-wide">
                    <BuildingIcon className="size-3.5" />
                    Zamawiający
                  </dt>
                  <dd className="text-sm text-foreground font-medium">
                    {tender.zamawiajacy}
                  </dd>
                  <dd className="text-xs text-muted-foreground">
                    {tender.adresZamawiajacego}
                  </dd>
                </div>

                <div className="flex flex-col gap-1">
                  <dt className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground uppercase tracking-wide">
                    <MapPinIcon className="size-3.5" />
                    Region
                  </dt>
                  <dd className="text-sm text-foreground font-medium capitalize">
                    {tender.region}
                  </dd>
                </div>

                <div className="flex flex-col gap-1 sm:col-span-2">
                  <dt className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground uppercase tracking-wide">
                    <TagIcon className="size-3.5" />
                    Kody CPV
                  </dt>
                  <dd className="flex flex-col gap-1.5">
                    {tender.cpvCodes.map((cpv) => (
                      <div key={cpv.code} className="flex items-center gap-2">
                        <Badge variant="outline" className="font-mono text-xs">
                          {cpv.code}
                        </Badge>
                        <span className="text-sm text-muted-foreground">
                          {cpv.label}
                        </span>
                      </div>
                    ))}
                  </dd>
                </div>

                <Separator className="sm:col-span-2" />

                <div className="flex flex-col gap-1">
                  <dt className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground uppercase tracking-wide">
                    <CalendarIcon className="size-3.5" />
                    Opublikowano
                  </dt>
                  <dd className="text-sm text-foreground">
                    {formatDate(tender.opublikowano)}
                  </dd>
                </div>

                <div className="flex flex-col gap-1">
                  <dt className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground uppercase tracking-wide">
                    <ClockIcon className="size-3.5" />
                    Termin składania ofert
                  </dt>
                  <dd className="text-sm text-foreground font-medium">
                    {formatDate(tender.terminSkladaniaOfert)}
                  </dd>
                </div>

                <div className="flex flex-col gap-1">
                  <dt className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground uppercase tracking-wide">
                    <ClockIcon className="size-3.5" />
                    Termin na pytania
                  </dt>
                  <dd className="text-sm text-foreground">
                    {formatDate(tender.terminNaPytania)}
                  </dd>
                </div>

                <div className="flex flex-col gap-1">
                  <dt className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground uppercase tracking-wide">
                    Budżet szacunkowy
                  </dt>
                  <dd className="text-sm text-foreground">
                    <span className="text-muted-foreground">od </span>
                    <span className="font-medium">{formatPLN(tender.budzetMin)}</span>
                    <span className="text-muted-foreground"> do </span>
                    <span className="font-semibold text-sky-400">{formatPLN(tender.budzetMax)}</span>
                  </dd>
                </div>
              </dl>
            </CardContent>
          </Card>

          {/* Documents */}
          <Card>
            <CardHeader>
              <CardTitle>Dokumenty</CardTitle>
              <CardDescription>
                Pliki dostępne w ramach postępowania
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="flex flex-col divide-y divide-border">
                {tender.dokumenty.map((doc, index) => (
                  <li
                    key={index}
                    className="flex items-center gap-3 py-3 first:pt-0 last:pb-0"
                  >
                    <DocumentIcon typ={doc.typ} />
                    <span className="flex-1 text-sm text-foreground">
                      {doc.nazwa}
                    </span>
                    <Button variant="ghost" size="sm" className="text-xs text-muted-foreground">
                      Pobierz
                    </Button>
                  </li>
                ))}
              </ul>
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
                <Button
                  variant="outline"
                  className="w-full justify-start gap-2"
                >
                  <BookmarkIcon className="size-4 text-amber-400" />
                  Zapisz przetarg
                </Button>
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
