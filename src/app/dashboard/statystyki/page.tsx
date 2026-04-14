"use client"

import type { ElementType } from "react"
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Eye, FileText, Trophy, TrendingUp, Lock, InfoIcon } from "lucide-react"

interface StatCard {
  label: string
  value: string | number
  icon: ElementType
  description: string
  highlight?: boolean
}

const STAT_CARDS: StatCard[] = [
  {
    label: "Przeglądnięte przetargi",
    value: 27,
    icon: Eye,
    description: "Łącznie w tym miesiącu",
  },
  {
    label: "Złożone oferty",
    value: 3,
    icon: FileText,
    description: "Aktywne i zakończone",
  },
  {
    label: "Wygrane",
    value: 1,
    icon: Trophy,
    description: "Potwierdzonych wygranych",
    highlight: true,
  },
  {
    label: "Win rate",
    value: "33%",
    icon: TrendingUp,
    description: "Skuteczność ofert",
    highlight: true,
  },
]

export default function StatystykiPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-foreground">Statystyki</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Przegląd Twojej aktywności na platformie
        </p>
      </div>

      {/* Stat cards grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {STAT_CARDS.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.label}>
              <CardHeader className="pb-0">
                <div className="flex items-center justify-between">
                  <CardDescription className="text-xs">
                    {stat.label}
                  </CardDescription>
                  <div
                    className={`flex size-7 items-center justify-center rounded-md ${
                      stat.highlight
                        ? "bg-[#0EA5E9]/15 text-[#0EA5E9]"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    <Icon className="size-4" />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-2">
                <p
                  className={`text-3xl font-bold tabular-nums ${
                    stat.highlight ? "text-[#0EA5E9]" : "text-foreground"
                  }`}
                >
                  {stat.value}
                </p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {stat.description}
                </p>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Pro+ info card */}
      <Card className="mt-4 border-[#0EA5E9]/30 bg-[#0EA5E9]/5">
        <CardContent className="py-4">
          <div className="flex items-start gap-3">
            <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-[#0EA5E9]/15 text-[#0EA5E9]">
              <Lock className="size-4" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-foreground">
                Więcej statystyk dostępne w planie Pro+
              </p>
              <p className="mt-0.5 text-xs text-muted-foreground">
                Odblokuj pełne raporty: trendy rynkowe, analizę konkurencji,
                historię wygranych zamówień i prognozę budżetową.
              </p>
            </div>
            <Badge variant="outline" className="shrink-0 text-xs">
              Pro+
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Heatmap placeholder */}
      <Card className="mt-4">
        <CardHeader>
          <div className="flex items-center gap-2">
            <CardTitle>Aktywność w czasie</CardTitle>
            <Badge variant="outline" className="text-xs">
              Pro+
            </Badge>
          </div>
          <CardDescription>
            Mapa aktywności przeglądania przetargów — dostępna w planie Pro+
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative flex h-40 items-center justify-center overflow-hidden rounded-lg border border-dashed border-border bg-muted/30">
            <div className="absolute inset-0 grid grid-cols-12 gap-1 p-4 opacity-20">
              {Array.from({ length: 84 }).map((_, i) => (
                <div
                  key={i}
                  className="rounded-sm bg-[#0EA5E9]"
                  style={{ opacity: Math.random() * 0.8 + 0.1 }}
                />
              ))}
            </div>
            <div className="relative flex flex-col items-center gap-2 text-center">
              <div className="flex size-10 items-center justify-center rounded-full bg-muted text-muted-foreground">
                <InfoIcon className="size-5" />
              </div>
              <p className="text-sm font-medium text-muted-foreground">
                Heatmap aktywności
              </p>
              <p className="text-xs text-muted-foreground">
                Dostępny po uaktualnieniu do planu Pro+
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
