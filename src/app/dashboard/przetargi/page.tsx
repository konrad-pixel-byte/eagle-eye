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
import { SearchIcon, ChevronLeftIcon, ChevronRightIcon } from "lucide-react"

type TenderStatus = "aktywne" | "wygasle" | "rozstrzygniete" | "anulowane"

interface Tender {
  id: string
  title: string
  zamawiajacy: string
  region: string
  cpvGroup: string
  budzetMin: number
  budzetMax: number
  termin: string
  status: TenderStatus
  aiScore: number
}

const MOCK_TENDERS: Tender[] = [
  {
    id: "1",
    title: "Szkolenia z zakresu obsługi klienta dla pracowników urzędu",
    zamawiajacy: "Urząd Miasta Warszawa",
    region: "mazowieckie",
    cpvGroup: "Szkolenia personelu",
    budzetMin: 50000,
    budzetMax: 150000,
    termin: "2025-05-15",
    status: "aktywne",
    aiScore: 87,
  },
  {
    id: "2",
    title: "Kursy językowe dla kadry zarządzającej",
    zamawiajacy: "Urząd Marszałkowski Województwa Małopolskiego",
    region: "małopolskie",
    cpvGroup: "Językowe",
    budzetMin: 20000,
    budzetMax: 80000,
    termin: "2025-04-30",
    status: "aktywne",
    aiScore: 72,
  },
  {
    id: "3",
    title: "Szkolenia BHP dla pracowników zakładu produkcyjnego",
    zamawiajacy: "Zakłady Przemysłowe Wrocław Sp. z o.o.",
    region: "dolnośląskie",
    cpvGroup: "BHP",
    budzetMin: 15000,
    budzetMax: 45000,
    termin: "2025-03-20",
    status: "rozstrzygniete",
    aiScore: 55,
  },
  {
    id: "4",
    title: "Program szkoleń IT — cyberbezpieczeństwo i chmura obliczeniowa",
    zamawiajacy: "Agencja Rozwoju Regionalnego",
    region: "śląskie",
    cpvGroup: "IT",
    budzetMin: 100000,
    budzetMax: 300000,
    termin: "2025-06-01",
    status: "aktywne",
    aiScore: 93,
  },
  {
    id: "5",
    title: "Szkolenia miękkie — komunikacja i praca zespołowa",
    zamawiajacy: "Starostwo Powiatowe w Poznaniu",
    region: "wielkopolskie",
    cpvGroup: "Soft skills",
    budzetMin: 30000,
    budzetMax: 90000,
    termin: "2025-02-28",
    status: "wygasle",
    aiScore: 38,
  },
  {
    id: "6",
    title: "Zawodowe szkolenia spawalnicze z certyfikacją UDT",
    zamawiajacy: "Centrum Kształcenia Zawodowego Gdańsk",
    region: "pomorskie",
    cpvGroup: "Szkolenia zawodowe",
    budzetMin: 60000,
    budzetMax: 180000,
    termin: "2025-05-20",
    status: "aktywne",
    aiScore: 65,
  },
  {
    id: "7",
    title: "Kurs obsługi specjalistycznego oprogramowania ERP",
    zamawiajacy: "Szpital Wojewódzki im. Jana Pawła II",
    region: "lubelskie",
    cpvGroup: "IT",
    budzetMin: 25000,
    budzetMax: 70000,
    termin: "2025-01-15",
    status: "anulowane",
    aiScore: 22,
  },
  {
    id: "8",
    title: "Szkolenia z zakresu zarządzania projektami (PRINCE2/PMP)",
    zamawiajacy: "Ministerstwo Funduszy i Polityki Regionalnej",
    region: "mazowieckie",
    cpvGroup: "Szkolenia personelu",
    budzetMin: 80000,
    budzetMax: 250000,
    termin: "2025-07-10",
    status: "aktywne",
    aiScore: 81,
  },
]

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

const CPV_GROUPS = [
  "Szkolenia personelu",
  "Szkolenia zawodowe",
  "BHP",
  "Soft skills",
  "IT",
  "Językowe",
]

const PAGE_SIZE = 5

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
  return (
    <Badge className={`border ${className}`}>
      {label}
    </Badge>
  )
}

function AiScoreIndicator({ score }: { score: number }) {
  const color =
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
          className={`h-full rounded-full ${color}`}
          style={{ width: `${score}%` }}
        />
      </div>
      <span className={`text-xs font-semibold tabular-nums ${textColor}`}>
        {score}
      </span>
    </div>
  )
}

export default function PrzetargiPage() {
  const router = useRouter()

  const [search, setSearch] = useState("")
  const [region, setRegion] = useState<string>("all")
  const [status, setStatus] = useState<string>("all")
  const [cpvGroup, setCpvGroup] = useState<string>("all")
  const [budzetMin, setBudzetMin] = useState("")
  const [budzetMax, setBudzetMax] = useState("")
  const [page, setPage] = useState(1)

  const filtered = useMemo(() => {
    return MOCK_TENDERS.filter((t) => {
      if (search && !t.title.toLowerCase().includes(search.toLowerCase()))
        return false
      if (region !== "all" && t.region !== region) return false
      if (status !== "all" && t.status !== status) return false
      if (cpvGroup !== "all" && t.cpvGroup !== cpvGroup) return false
      if (budzetMin && t.budzetMax < Number(budzetMin)) return false
      if (budzetMax && t.budzetMin > Number(budzetMax)) return false
      return true
    })
  }, [search, region, status, cpvGroup, budzetMin, budzetMax])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const currentPage = Math.min(page, totalPages)
  const paginatedItems = filtered.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  )

  function handleFilterChange() {
    setPage(1)
  }

  return (
    <div className="flex flex-col gap-6 p-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <h1 className="text-2xl font-semibold tracking-tight">
          Przetargi szkoleniowe
        </h1>
        <Badge className="bg-sky-500/15 text-sky-400 border border-sky-500/20 text-sm px-2.5 h-6">
          {filtered.length}
        </Badge>
      </div>

      {/* Filter Bar */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm text-muted-foreground font-normal">
            Filtruj przetargi
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
            {/* Search */}
            <div className="relative xl:col-span-2">
              <SearchIcon className="absolute left-2.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
              <Input
                placeholder="Szukaj po tytule..."
                className="pl-8"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value)
                  handleFilterChange()
                }}
              />
            </div>

            {/* Region */}
            <Select
              value={region}
              onValueChange={(v) => {
                setRegion(v ?? "all")
                handleFilterChange()
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
                handleFilterChange()
              }}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Wszystkie statusy</SelectItem>
                <SelectItem value="aktywne">Aktywne</SelectItem>
                <SelectItem value="wygasle">Wygasłe</SelectItem>
                <SelectItem value="rozstrzygniete">Rozstrzygnięte</SelectItem>
                <SelectItem value="anulowane">Anulowane</SelectItem>
              </SelectContent>
            </Select>

            {/* CPV Group */}
            <Select
              value={cpvGroup}
              onValueChange={(v) => {
                setCpvGroup(v ?? "all")
                handleFilterChange()
              }}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Grupa CPV" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Wszystkie grupy CPV</SelectItem>
                {CPV_GROUPS.map((g) => (
                  <SelectItem key={g} value={g}>
                    {g}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Budget range */}
            <div className="flex items-center gap-1.5">
              <Input
                type="number"
                placeholder="Budżet min"
                value={budzetMin}
                onChange={(e) => {
                  setBudzetMin(e.target.value)
                  handleFilterChange()
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
                  handleFilterChange()
                }}
                className="w-full"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="border-b border-border/50">
                <TableHead className="pl-4">Tytuł</TableHead>
                <TableHead>Zamawiający</TableHead>
                <TableHead>Region</TableHead>
                <TableHead>Budżet</TableHead>
                <TableHead>Termin</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="pr-4">AI Score</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedItems.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="py-12 text-center text-muted-foreground"
                  >
                    Brak wyników pasujących do wybranych filtrów.
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
                        {tender.zamawiajacy}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="capitalize text-muted-foreground text-xs">
                        {tender.region}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-0.5">
                        <span className="text-xs text-muted-foreground">
                          {formatPLN(tender.budzetMin)}
                        </span>
                        <span className="text-xs text-foreground font-medium">
                          {formatPLN(tender.budzetMax)}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm tabular-nums">
                        {formatDate(tender.termin)}
                      </span>
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={tender.status} />
                    </TableCell>
                    <TableCell className="pr-4">
                      <AiScoreIndicator score={tender.aiScore} />
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Wyświetlono{" "}
          <span className="font-medium text-foreground">
            {Math.min((currentPage - 1) * PAGE_SIZE + 1, filtered.length)}–
            {Math.min(currentPage * PAGE_SIZE, filtered.length)}
          </span>{" "}
          z <span className="font-medium text-foreground">{filtered.length}</span> wyników
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
