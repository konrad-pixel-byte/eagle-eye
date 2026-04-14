"use client"

import { useState } from "react"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from "@/components/ui/tooltip"
import { CalendarIcon, BuildingIcon, MapPinIcon, TrendingUpIcon } from "lucide-react"

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type StatusKFS = "Aktywny" | "Zamknięty" | "Ogłoszony"
type StatusBUR = "Aktywny" | "Zamknięty" | "Wkrótce"

interface KfsNabor {
  id: string
  pupNazwa: string
  wojewodztwo: string
  status: StatusKFS
  budzet: string
  dataOd: string
  dataDo: string
  priorytety: string[]
}

interface BurNabor {
  id: string
  operator: string
  wojewodztwo: string
  program: string
  budzet: string
  dofinansowanie: number
  status: StatusBUR
  dataOd: string
  dataDo: string
  kategorie: string[]
}

// ---------------------------------------------------------------------------
// Mock data
// ---------------------------------------------------------------------------

const MOCK_KFS: KfsNabor[] = [
  {
    id: "kfs-1",
    pupNazwa: "Powiatowy Urząd Pracy w Warszawie",
    wojewodztwo: "Mazowieckie",
    status: "Aktywny",
    budzet: "2 400 000 zł",
    dataOd: "01.04.2025",
    dataDo: "30.06.2025",
    priorytety: ["Cyfryzacja", "Automatyzacja", "Zielona gospodarka"],
  },
  {
    id: "kfs-2",
    pupNazwa: "Powiatowy Urząd Pracy w Krakowie",
    wojewodztwo: "Małopolskie",
    status: "Aktywny",
    budzet: "1 850 000 zł",
    dataOd: "15.03.2025",
    dataDo: "15.06.2025",
    priorytety: ["Przemysł 4.0", "Kompetencje cyfrowe"],
  },
  {
    id: "kfs-3",
    pupNazwa: "Powiatowy Urząd Pracy w Poznaniu",
    wojewodztwo: "Wielkopolskie",
    status: "Ogłoszony",
    budzet: "1 600 000 zł",
    dataOd: "01.05.2025",
    dataDo: "31.07.2025",
    priorytety: ["Logistyka", "Zarządzanie łańcuchem dostaw", "Cyfryzacja"],
  },
  {
    id: "kfs-4",
    pupNazwa: "Powiatowy Urząd Pracy w Gdańsku",
    wojewodztwo: "Pomorskie",
    status: "Aktywny",
    budzet: "980 000 zł",
    dataOd: "01.04.2025",
    dataDo: "30.05.2025",
    priorytety: ["Gospodarka morska", "IT", "Odnawialne źródła energii"],
  },
  {
    id: "kfs-5",
    pupNazwa: "Powiatowy Urząd Pracy we Wrocławiu",
    wojewodztwo: "Dolnośląskie",
    status: "Zamknięty",
    budzet: "1 200 000 zł",
    dataOd: "01.01.2025",
    dataDo: "28.02.2025",
    priorytety: ["Technologie informacyjne", "Automatyzacja przemysłu"],
  },
]

const MOCK_BUR: BurNabor[] = [
  {
    id: "bur-1",
    operator: "Polska Agencja Rozwoju Przedsiębiorczości",
    wojewodztwo: "Mazowieckie",
    program: "Akademia Menadżera MŚP",
    budzet: "8 500 000 zł",
    dofinansowanie: 80,
    status: "Aktywny",
    dataOd: "01.03.2025",
    dataDo: "31.08.2025",
    kategorie: ["Zarządzanie", "Przywództwo", "Finanse"],
  },
  {
    id: "bur-2",
    operator: "Centrum Rozwoju Kadr Sp. z o.o.",
    wojewodztwo: "Śląskie",
    program: "Kompetencje Cyfrowe dla Pracowników",
    budzet: "4 200 000 zł",
    dofinansowanie: 70,
    status: "Aktywny",
    dataOd: "01.04.2025",
    dataDo: "30.09.2025",
    kategorie: ["IT", "Cyberbezpieczeństwo", "Chmura obliczeniowa"],
  },
  {
    id: "bur-3",
    operator: "Instytut Szkoleń Zawodowych",
    wojewodztwo: "Małopolskie",
    program: "Zielone Kompetencje 2025",
    budzet: "3 750 000 zł",
    dofinansowanie: 85,
    status: "Wkrótce",
    dataOd: "01.06.2025",
    dataDo: "30.11.2025",
    kategorie: ["OZE", "Efektywność energetyczna", "ESG"],
  },
  {
    id: "bur-4",
    operator: "Regionalne Centrum Edukacji Zawodowej",
    wojewodztwo: "Wielkopolskie",
    program: "Automatyzacja i Robotyzacja MŚP",
    budzet: "5 100 000 zł",
    dofinansowanie: 75,
    status: "Aktywny",
    dataOd: "15.03.2025",
    dataDo: "15.09.2025",
    kategorie: ["Robotyka", "Automatyzacja", "Przemysł 4.0"],
  },
  {
    id: "bur-5",
    operator: "Akademia Biznesu i Technologii",
    wojewodztwo: "Dolnośląskie",
    program: "E-commerce i Sprzedaż Online",
    budzet: "2 900 000 zł",
    dofinansowanie: 65,
    status: "Zamknięty",
    dataOd: "01.01.2025",
    dataDo: "31.03.2025",
    kategorie: ["Marketing", "Sprzedaż", "Digital"],
  },
]

const WOJEWODZTWA = [
  "Wszystkie",
  "Dolnośląskie",
  "Kujawsko-Pomorskie",
  "Lubelskie",
  "Lubuskie",
  "Łódzkie",
  "Małopolskie",
  "Mazowieckie",
  "Opolskie",
  "Podkarpackie",
  "Podlaskie",
  "Pomorskie",
  "Śląskie",
  "Świętokrzyskie",
  "Warmińsko-Mazurskie",
  "Wielkopolskie",
  "Zachodniopomorskie",
]

// ---------------------------------------------------------------------------
// Voivodeships with active KFS nabory
// ---------------------------------------------------------------------------

const activeKfsWojewodztwa = new Set(
  MOCK_KFS.filter((n) => n.status !== "Zamknięty").map((n) => n.wojewodztwo)
)

// ---------------------------------------------------------------------------
// Poland SVG Map component
// ---------------------------------------------------------------------------

interface VoivodeshipPath {
  id: string
  name: string
  d: string
  labelX: number
  labelY: number
}

const VOIVODESHIPS: VoivodeshipPath[] = [
  {
    id: "zachodniopomorskie",
    name: "Zachodniopomorskie",
    d: "M 20 30 L 80 30 L 90 50 L 80 80 L 50 90 L 20 75 Z",
    labelX: 52,
    labelY: 58,
  },
  {
    id: "pomorskie",
    name: "Pomorskie",
    d: "M 80 30 L 155 20 L 165 50 L 145 65 L 110 70 L 90 50 Z",
    labelX: 122,
    labelY: 43,
  },
  {
    id: "warminsko-mazurskie",
    name: "Warmińsko-Mazurskie",
    d: "M 165 20 L 255 25 L 265 70 L 230 80 L 190 75 L 165 50 Z",
    labelX: 212,
    labelY: 49,
  },
  {
    id: "podlaskie",
    name: "Podlaskie",
    d: "M 255 25 L 310 30 L 315 80 L 275 90 L 245 85 L 230 80 L 265 70 Z",
    labelX: 279,
    labelY: 58,
  },
  {
    id: "lubuskie",
    name: "Lubuskie",
    d: "M 20 90 L 60 90 L 65 130 L 45 155 L 18 145 L 15 115 Z",
    labelX: 38,
    labelY: 120,
  },
  {
    id: "kujawsko-pomorskie",
    name: "Kujawsko-Pomorskie",
    d: "M 80 80 L 145 65 L 165 90 L 160 125 L 120 130 L 85 120 Z",
    labelX: 122,
    labelY: 100,
  },
  {
    id: "wielkopolskie",
    name: "Wielkopolskie",
    d: "M 60 90 L 120 90 L 165 90 L 160 125 L 120 130 L 85 120 L 65 130 Z",
    labelX: 108,
    labelY: 110,
  },
  {
    id: "mazowieckie",
    name: "Mazowieckie",
    d: "M 165 90 L 230 80 L 275 90 L 275 150 L 235 165 L 190 165 L 165 145 Z",
    labelX: 220,
    labelY: 125,
  },
  {
    id: "lodzkie",
    name: "Łódzkie",
    d: "M 120 130 L 165 125 L 190 145 L 185 175 L 150 180 L 115 165 Z",
    labelX: 152,
    labelY: 153,
  },
  {
    id: "dolnoslaskie",
    name: "Dolnośląskie",
    d: "M 18 155 L 75 145 L 90 170 L 80 200 L 45 205 L 18 190 Z",
    labelX: 52,
    labelY: 176,
  },
  {
    id: "opolskie",
    name: "Opolskie",
    d: "M 75 145 L 120 140 L 135 165 L 120 185 L 90 190 L 80 200 L 90 170 Z",
    labelX: 105,
    labelY: 168,
  },
  {
    id: "slaskie",
    name: "Śląskie",
    d: "M 120 140 L 165 145 L 175 175 L 165 200 L 130 205 L 115 185 L 120 185 L 135 165 Z",
    labelX: 145,
    labelY: 178,
  },
  {
    id: "swietokrzyskie",
    name: "Świętokrzyskie",
    d: "M 190 165 L 235 165 L 240 195 L 215 205 L 190 200 L 185 180 Z",
    labelX: 212,
    labelY: 183,
  },
  {
    id: "malopolskie",
    name: "Małopolskie",
    d: "M 165 200 L 215 205 L 230 225 L 200 240 L 165 235 L 150 215 Z",
    labelX: 190,
    labelY: 218,
  },
  {
    id: "podkarpackie",
    name: "Podkarpackie",
    d: "M 230 165 L 275 150 L 300 175 L 295 215 L 260 230 L 230 225 L 215 205 L 240 195 Z",
    labelX: 260,
    labelY: 196,
  },
  {
    id: "lubelskie",
    name: "Lubelskie",
    d: "M 275 90 L 315 80 L 330 140 L 300 175 L 275 150 L 235 165 Z",
    labelX: 298,
    labelY: 128,
  },
]

interface PolandMapProps {
  activeWojewodztwa: Set<string>
  selectedWojewodztwo: string
  onSelectWojewodztwo: (w: string) => void
}

function PolandMap({
  activeWojewodztwa,
  selectedWojewodztwo,
  onSelectWojewodztwo,
}: PolandMapProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null)

  function getFill(v: VoivodeshipPath): string {
    const isSelected = selectedWojewodztwo === v.name
    const isHovered = hoveredId === v.id
    const isActive = activeWojewodztwa.has(v.name)

    if (isSelected) return "#0EA5E9"
    if (isHovered && isActive) return "#059669"
    if (isHovered) return "#6b7280"
    if (isActive) return "#10B981"
    return "#374151"
  }

  return (
    <TooltipProvider>
      <svg
        viewBox="0 0 345 255"
        width="400"
        height="500"
        className="rounded-lg border border-border/40"
        style={{ background: "hsl(var(--card))" }}
        aria-label="Mapa Polski — nabory KFS"
      >
        {VOIVODESHIPS.map((v) => (
          <Tooltip key={v.id}>
            <TooltipTrigger
              render={
                <g
                  onMouseEnter={() => setHoveredId(v.id)}
                  onMouseLeave={() => setHoveredId(null)}
                  onClick={() =>
                    onSelectWojewodztwo(
                      selectedWojewodztwo === v.name ? "Wszystkie" : v.name
                    )
                  }
                  style={{ cursor: "pointer" }}
                >
                  <path
                    d={v.d}
                    fill={getFill(v)}
                    stroke="hsl(var(--background))"
                    strokeWidth="1.5"
                    style={{ transition: "fill 150ms" }}
                  />
                  <text
                    x={v.labelX}
                    y={v.labelY}
                    textAnchor="middle"
                    fontSize="5.5"
                    fill="white"
                    style={{ pointerEvents: "none", userSelect: "none" }}
                  >
                    {v.name.replace("Warmińsko-Mazurskie", "Warm.-Maz.")}
                  </text>
                </g>
              }
            />
            <TooltipContent side="top">
              <span className="font-medium">{v.name}</span>
              {activeWojewodztwa.has(v.name) ? (
                <span className="ml-1 text-[#10B981]">• Aktywne nabory</span>
              ) : (
                <span className="ml-1 text-muted-foreground">• Brak aktywnych naborów</span>
              )}
            </TooltipContent>
          </Tooltip>
        ))}

        {/* Legend */}
        <g>
          <rect x="8" y="232" width="10" height="10" rx="2" fill="#10B981" />
          <text x="21" y="241" fontSize="7" fill="#9ca3af">
            Aktywne nabory
          </text>
          <rect x="105" y="232" width="10" height="10" rx="2" fill="#374151" />
          <text x="118" y="241" fontSize="7" fill="#9ca3af">
            Brak naborów
          </text>
          <rect x="195" y="232" width="10" height="10" rx="2" fill="#0EA5E9" />
          <text x="208" y="241" fontSize="7" fill="#9ca3af">
            Wybrane
          </text>
        </g>
      </svg>
    </TooltipProvider>
  )
}

// ---------------------------------------------------------------------------
// Status badge helpers
// ---------------------------------------------------------------------------

const KFS_STATUS_VARIANT: Record<StatusKFS, string> = {
  Aktywny: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
  Zamknięty: "bg-zinc-500/15 text-zinc-400 border-zinc-500/30",
  Ogłoszony: "bg-sky-500/15 text-sky-400 border-sky-500/30",
}

const BUR_STATUS_VARIANT: Record<StatusBUR, string> = {
  Aktywny: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
  Zamknięty: "bg-zinc-500/15 text-zinc-400 border-zinc-500/30",
  Wkrótce: "bg-amber-500/15 text-amber-400 border-amber-500/30",
}

// ---------------------------------------------------------------------------
// KFS Nabor card
// ---------------------------------------------------------------------------

function KfsNaborItem({ nabor }: { nabor: KfsNabor }) {
  return (
    <Card className="border border-border/40 bg-card/60">
      <CardHeader className="pb-0">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <CardTitle className="text-sm leading-tight">{nabor.pupNazwa}</CardTitle>
            <div className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
              <MapPinIcon className="size-3 shrink-0" />
              {nabor.wojewodztwo}
            </div>
          </div>
          <span
            className={`inline-flex h-5 items-center rounded-full border px-2 text-xs font-medium ${KFS_STATUS_VARIANT[nabor.status]}`}
          >
            {nabor.status}
          </span>
        </div>
      </CardHeader>
      <CardContent className="pt-3 space-y-2">
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1 text-amber-400">
            <TrendingUpIcon className="size-3" />
            <span className="font-semibold">{nabor.budzet}</span>
          </div>
          <div className="flex items-center gap-1 text-muted-foreground">
            <CalendarIcon className="size-3" />
            <span>
              {nabor.dataOd} — {nabor.dataDo}
            </span>
          </div>
        </div>
        <Separator />
        <div className="flex flex-wrap gap-1">
          {nabor.priorytety.map((p) => (
            <span
              key={p}
              className="inline-flex items-center rounded-md border border-sky-500/20 bg-sky-500/10 px-1.5 py-0.5 text-[11px] text-sky-400"
            >
              {p}
            </span>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

// ---------------------------------------------------------------------------
// BUR Nabor card
// ---------------------------------------------------------------------------

function BurNaborCard({ nabor }: { nabor: BurNabor }) {
  return (
    <Card className="border border-border/40 bg-card/60">
      <CardHeader className="pb-0">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <CardTitle className="text-sm leading-tight">{nabor.program}</CardTitle>
            <div className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
              <BuildingIcon className="size-3 shrink-0" />
              {nabor.operator}
            </div>
            <div className="mt-0.5 flex items-center gap-1.5 text-xs text-muted-foreground">
              <MapPinIcon className="size-3 shrink-0" />
              {nabor.wojewodztwo}
            </div>
          </div>
          <span
            className={`inline-flex h-5 items-center rounded-full border px-2 text-xs font-medium ${BUR_STATUS_VARIANT[nabor.status]}`}
          >
            {nabor.status}
          </span>
        </div>
      </CardHeader>
      <CardContent className="pt-3 space-y-2">
        <div className="flex flex-wrap items-center gap-4 text-xs">
          <div className="flex items-center gap-1 text-amber-400">
            <TrendingUpIcon className="size-3" />
            <span className="font-semibold">{nabor.budzet}</span>
          </div>
          <div className="flex items-center gap-1 text-emerald-400">
            <span className="font-semibold">{nabor.dofinansowanie}%</span>
            <span className="text-muted-foreground">dofinansowanie</span>
          </div>
          <div className="flex items-center gap-1 text-muted-foreground">
            <CalendarIcon className="size-3" />
            <span>
              {nabor.dataOd} — {nabor.dataDo}
            </span>
          </div>
        </div>
        <Separator />
        <div className="flex flex-wrap gap-1">
          {nabor.kategorie.map((k) => (
            <span
              key={k}
              className="inline-flex items-center rounded-md border border-violet-500/20 bg-violet-500/10 px-1.5 py-0.5 text-[11px] text-violet-400"
            >
              {k}
            </span>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

// ---------------------------------------------------------------------------
// Main page
// ---------------------------------------------------------------------------

export default function FinansowaniePage() {
  const [kfsFilter, setKfsFilter] = useState("Wszystkie")
  const [burFilter, setBurFilter] = useState("Wszystkie")

  const filteredKfs =
    kfsFilter === "Wszystkie"
      ? MOCK_KFS
      : MOCK_KFS.filter((n) => n.wojewodztwo === kfsFilter)

  const filteredBur =
    burFilter === "Wszystkie"
      ? MOCK_BUR
      : MOCK_BUR.filter((n) => n.wojewodztwo === burFilter)

  const burActive = MOCK_BUR.filter((n) => n.status === "Aktywny").length
  const burTotalBudget = "24 550 000 zł"
  const burAvgFunding = Math.round(
    MOCK_BUR.reduce((sum, n) => sum + n.dofinansowanie, 0) / MOCK_BUR.length
  )

  return (
    <div className="flex flex-col gap-6 p-6">
      <div>
        <h1 className="text-xl font-semibold text-foreground">
          Finansowanie szkoleń
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Przegląd aktywnych naborów KFS i BUR — aktualizacja: 14.04.2025
        </p>
      </div>

      <Tabs defaultValue="kfs">
        <TabsList className="w-full max-w-xl">
          <TabsTrigger value="kfs" className="flex-1">
            KFS — Krajowy Fundusz Szkoleniowy
          </TabsTrigger>
          <TabsTrigger value="bur" className="flex-1">
            BUR — Baza Usług Rozwojowych
          </TabsTrigger>
        </TabsList>

        {/* ---------------------------------------------------------------- */}
        {/* TAB 1 — KFS                                                       */}
        {/* ---------------------------------------------------------------- */}
        <TabsContent value="kfs" className="mt-4">
          <div className="flex gap-6 flex-col lg:flex-row">
            {/* Map — 3/5 */}
            <div className="flex flex-col gap-3 lg:w-3/5">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                  Mapa naborów KFS
                </h2>
                {kfsFilter !== "Wszystkie" && (
                  <button
                    className="text-xs text-sky-400 hover:text-sky-300 transition-colors"
                    onClick={() => setKfsFilter("Wszystkie")}
                  >
                    Wyczyść filtr
                  </button>
                )}
              </div>
              <PolandMap
                activeWojewodztwa={activeKfsWojewodztwa}
                selectedWojewodztwo={kfsFilter}
                onSelectWojewodztwo={setKfsFilter}
              />
            </div>

            {/* List — 2/5 */}
            <div className="flex flex-col gap-3 lg:w-2/5">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                  Aktywne nabory ({filteredKfs.length})
                </h2>
                <Select value={kfsFilter} onValueChange={(v) => setKfsFilter(v ?? "Wszystkie")}>
                  <SelectTrigger className="h-7 text-xs w-44">
                    <SelectValue placeholder="Województwo" />
                  </SelectTrigger>
                  <SelectContent>
                    {WOJEWODZTWA.map((w) => (
                      <SelectItem key={w} value={w}>
                        {w}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex flex-col gap-3 max-h-[500px] overflow-y-auto pr-1">
                {filteredKfs.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-8">
                    Brak naborów dla wybranego województwa.
                  </p>
                ) : (
                  filteredKfs.map((n) => <KfsNaborItem key={n.id} nabor={n} />)
                )}
              </div>
            </div>
          </div>
        </TabsContent>

        {/* ---------------------------------------------------------------- */}
        {/* TAB 2 — BUR                                                       */}
        {/* ---------------------------------------------------------------- */}
        <TabsContent value="bur" className="mt-4">
          <div className="flex flex-col gap-5">
            {/* Summary stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Card className="border border-border/40 bg-card/60">
                <CardContent className="pt-4 pb-4">
                  <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
                    Aktywne nabory
                  </p>
                  <p className="text-2xl font-bold text-sky-400">{burActive}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    z {MOCK_BUR.length} łącznie
                  </p>
                </CardContent>
              </Card>
              <Card className="border border-border/40 bg-card/60">
                <CardContent className="pt-4 pb-4">
                  <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
                    Łączny budżet
                  </p>
                  <p className="text-2xl font-bold text-amber-400">{burTotalBudget}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    wszystkie nabory
                  </p>
                </CardContent>
              </Card>
              <Card className="border border-border/40 bg-card/60">
                <CardContent className="pt-4 pb-4">
                  <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
                    Śr. dofinansowanie
                  </p>
                  <p className="text-2xl font-bold text-emerald-400">{burAvgFunding}%</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    kosztów kwalifikowanych
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Filter + list */}
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                Nabory BUR ({filteredBur.length})
              </h2>
              <Select value={burFilter} onValueChange={(v) => setBurFilter(v ?? "Wszystkie")}>
                <SelectTrigger className="h-7 text-xs w-44">
                  <SelectValue placeholder="Województwo" />
                </SelectTrigger>
                <SelectContent>
                  {WOJEWODZTWA.map((w) => (
                    <SelectItem key={w} value={w}>
                      {w}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredBur.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-8 col-span-2">
                  Brak naborów dla wybranego województwa.
                </p>
              ) : (
                filteredBur.map((n) => <BurNaborCard key={n.id} nabor={n} />)
              )}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
