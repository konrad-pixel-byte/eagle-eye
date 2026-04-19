"use client"

import { useState, useTransition } from "react"
import { Button } from "@/components/ui/button"
import { ExternalLink, Loader2 } from "lucide-react"

export function BillingPortalButton() {
  const [error, setError] = useState<string | null>(null)
  const [pending, startTransition] = useTransition()

  function handleClick() {
    setError(null)
    startTransition(async () => {
      try {
        const res = await fetch("/api/stripe/portal", { method: "POST" })
        const body = (await res.json()) as { url?: string; error?: string }
        if (!res.ok || !body.url) {
          setError(body.error ?? "Nie udało się otworzyć portalu")
          return
        }
        window.location.href = body.url
      } catch {
        setError("Błąd połączenia")
      }
    })
  }

  return (
    <div className="flex flex-col gap-2">
      <Button onClick={handleClick} disabled={pending} className="gap-2">
        {pending ? (
          <Loader2 className="size-4 animate-spin" />
        ) : (
          <ExternalLink className="size-4" />
        )}
        Otwórz portal Stripe
      </Button>
      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  )
}
