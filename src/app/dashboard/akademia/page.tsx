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
import { Button } from "@/components/ui/button"
import { BookOpen, FileEdit, Target, Zap, Lock, PlayCircle } from "lucide-react"

interface AcademyModule {
  id: number
  title: string
  description: string
  icon: ElementType
  badge: string
  badgeVariant: "default" | "secondary" | "outline"
  locked: boolean
  progress: number | null
}

const MODULES: AcademyModule[] = [
  {
    id: 1,
    title: "Podstawy zamówień publicznych",
    description:
      "Poznaj fundamenty systemu zamówień publicznych w Polsce. Dowiedz się, czym są przetargi i jak działa Ustawa PZP.",
    icon: BookOpen,
    badge: "Darmowy",
    badgeVariant: "secondary",
    locked: false,
    progress: null,
  },
  {
    id: 2,
    title: "Przygotowanie oferty",
    description:
      "Naucz się tworzyć oferty, które spełniają wymagania zamawiającego. Krok po kroku przez SIWZ i dokumentację.",
    icon: FileEdit,
    badge: "Darmowy",
    badgeVariant: "secondary",
    locked: false,
    progress: null,
  },
  {
    id: 3,
    title: "Strategia wygrywania",
    description:
      "Zaawansowane techniki zwiększania szans na wygraną. Analiza konkurencji, ceny ofertowe i kryteria oceny.",
    icon: Target,
    badge: "Basic+",
    badgeVariant: "outline",
    locked: true,
    progress: null,
  },
  {
    id: 4,
    title: "Zaawansowane techniki",
    description:
      "Konsorcja, podwykonawstwo, odwołania do KIO oraz zarządzanie portfelem zamówień na poziomie eksperckim.",
    icon: Zap,
    badge: "Pro+",
    badgeVariant: "outline",
    locked: true,
    progress: null,
  },
]

export default function AkademiaPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-foreground">
          Akademia Zamówień Publicznych
        </h1>
        <p className="mt-2 text-base text-muted-foreground">
          Naucz się wygrywać przetargi
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {MODULES.map((mod) => {
          const Icon = mod.icon
          return (
            <Card
              key={mod.id}
              className={mod.locked ? "opacity-75" : undefined}
            >
              <CardHeader>
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex size-10 shrink-0 items-center justify-center rounded-lg ${
                        mod.locked
                          ? "bg-muted text-muted-foreground"
                          : "bg-[#0EA5E9]/15 text-[#0EA5E9]"
                      }`}
                    >
                      {mod.locked ? (
                        <Lock className="size-5" />
                      ) : (
                        <Icon className="size-5" />
                      )}
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">
                        Moduł {mod.id}
                      </p>
                      <CardTitle className="text-base">{mod.title}</CardTitle>
                    </div>
                  </div>
                  <Badge variant={mod.badgeVariant}>{mod.badge}</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <CardDescription>{mod.description}</CardDescription>

                {/* Progress bar placeholder */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Postęp</span>
                    <span>{mod.locked ? "—" : "Nie rozpoczęto"}</span>
                  </div>
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full rounded-full bg-[#0EA5E9] transition-all"
                      style={{ width: `${mod.progress ?? 0}%` }}
                    />
                  </div>
                </div>

                {mod.locked ? (
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full"
                    disabled
                  >
                    <Lock className="size-3.5" />
                    Odblokuj w planie {mod.badge}
                  </Button>
                ) : (
                  <Button
                    size="sm"
                    className="w-full bg-[#0EA5E9] text-white hover:bg-[#0EA5E9]/90"
                  >
                    <PlayCircle className="size-3.5" />
                    Rozpocznij moduł
                  </Button>
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
