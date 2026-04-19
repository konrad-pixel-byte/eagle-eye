"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { BellOff, Check, CheckCheck, Clock, MapPin } from "lucide-react"
import type { AlertRow } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { markAlertAsRead, markAllAlertsAsRead } from "@/lib/actions/alerts"

interface AlertsClientProps {
  alerts: AlertRow[]
}

function formatRelative(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return "przed chwilą"
  if (mins < 60) return `${mins} min temu`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours} godz. temu`
  const days = Math.floor(hours / 24)
  if (days < 7) return `${days} dni temu`
  return new Date(iso).toLocaleDateString("pl-PL")
}

function formatDate(iso: string | null): string | null {
  if (!iso) return null
  return new Date(iso).toLocaleDateString("pl-PL", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  })
}

export function AlertsClient({ alerts }: AlertsClientProps) {
  const router = useRouter()
  const [isPending, startTransition] = React.useTransition()

  const unread = alerts.filter((a) => !a.read)
  const read = alerts.filter((a) => a.read)

  function handleMarkOne(id: string) {
    startTransition(async () => {
      await markAlertAsRead(id)
      router.refresh()
    })
  }

  function handleMarkAll() {
    startTransition(async () => {
      await markAllAlertsAsRead()
      router.refresh()
    })
  }

  if (alerts.length === 0) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-lg border border-dashed border-border/60 bg-muted/30 p-12 text-center">
        <BellOff className="size-10 text-muted-foreground" />
        <div>
          <p className="font-medium text-foreground">Brak powiadomień</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Dodaj preferowane CPV i województwa w{" "}
            <Link
              href="/dashboard/ustawienia"
              className="text-sky-400 hover:underline"
            >
              ustawieniach
            </Link>
            , żebyśmy mogli wysyłać Ci alerty.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-5">
      {unread.length > 0 && (
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-medium text-muted-foreground">
            Nieprzeczytane ({unread.length})
          </h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleMarkAll}
            disabled={isPending}
          >
            <CheckCheck className="size-4" />
            Oznacz wszystkie jako przeczytane
          </Button>
        </div>
      )}

      <ul className="flex flex-col gap-2">
        {unread.map((alert) => (
          <AlertCard
            key={alert.id}
            alert={alert}
            onMarkRead={handleMarkOne}
            isPending={isPending}
          />
        ))}
      </ul>

      {read.length > 0 && (
        <>
          <h2 className="mt-4 text-sm font-medium text-muted-foreground">
            Przeczytane ({read.length})
          </h2>
          <ul className="flex flex-col gap-2">
            {read.map((alert) => (
              <AlertCard
                key={alert.id}
                alert={alert}
                onMarkRead={handleMarkOne}
                isPending={isPending}
              />
            ))}
          </ul>
        </>
      )}
    </div>
  )
}

interface AlertCardProps {
  alert: AlertRow
  onMarkRead: (id: string) => void
  isPending: boolean
}

function AlertCard({ alert, onMarkRead, isPending }: AlertCardProps) {
  const deadline = formatDate(alert.tender?.deadline_submission ?? null)
  const href = alert.tender_id
    ? `/dashboard/przetargi/${alert.tender_id}`
    : "/dashboard/przetargi"

  return (
    <li
      className={cn(
        "group flex items-start gap-3 rounded-lg border p-4 transition-colors",
        alert.read
          ? "border-border/40 bg-background hover:bg-muted/30"
          : "border-sky-500/20 bg-sky-500/5 hover:bg-sky-500/10"
      )}
    >
      <div
        className={cn(
          "mt-1.5 size-2 shrink-0 rounded-full",
          alert.read ? "bg-muted-foreground/30" : "bg-sky-500"
        )}
        aria-hidden
      />

      <div className="min-w-0 flex-1">
        <Link href={href} className="block">
          <p className="truncate text-sm font-medium text-foreground group-hover:text-sky-400">
            {alert.title}
          </p>
          {alert.body && (
            <p className="mt-0.5 line-clamp-2 text-xs text-muted-foreground">
              {alert.body}
            </p>
          )}
        </Link>

        <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1">
            <Clock className="size-3" />
            {formatRelative(alert.sent_at)}
          </span>
          {alert.tender?.voivodeship && (
            <span className="inline-flex items-center gap-1">
              <MapPin className="size-3" />
              {alert.tender.voivodeship}
            </span>
          )}
          {alert.tender?.source && (
            <Badge className="border border-border/60 bg-muted/40 text-[10px] px-1.5 h-5 text-muted-foreground">
              {alert.tender.source}
            </Badge>
          )}
          {deadline && (
            <span className="text-muted-foreground">
              Termin: <span className="text-foreground">{deadline}</span>
            </span>
          )}
        </div>
      </div>

      {!alert.read && (
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={(e) => {
            e.preventDefault()
            onMarkRead(alert.id)
          }}
          disabled={isPending}
          aria-label="Oznacz jako przeczytane"
          className="shrink-0 text-muted-foreground hover:text-sky-400"
        >
          <Check className="size-4" />
        </Button>
      )}
    </li>
  )
}
