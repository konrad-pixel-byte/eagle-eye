"use client"

import { useState, useTransition } from "react"
import { MailWarning, Loader2, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"

interface EmailVerificationBannerProps {
  email: string
}

export function EmailVerificationBanner({ email }: EmailVerificationBannerProps) {
  const [sent, setSent] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [pending, startTransition] = useTransition()

  function handleResend() {
    setError(null)
    startTransition(async () => {
      try {
        const res = await fetch("/api/auth/resend-verification", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        })
        if (!res.ok) {
          const body = (await res.json().catch(() => ({}))) as { error?: string }
          setError(body.error ?? "Nie udało się wysłać maila")
          return
        }
        setSent(true)
      } catch {
        setError("Błąd połączenia")
      }
    })
  }

  return (
    <div className="flex items-start gap-3 rounded-lg border border-amber-500/30 bg-amber-500/10 px-4 py-3">
      <MailWarning className="size-5 text-amber-400 shrink-0 mt-0.5" />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-amber-200">
          Potwierdź adres email
        </p>
        <p className="text-xs text-amber-200/80 mt-0.5">
          Wysłaliśmy link weryfikacyjny na <span className="font-medium">{email}</span>.
          Bez potwierdzenia nie będziesz otrzymywać powiadomień o nowych przetargach.
        </p>
        {error && <p className="text-xs text-red-300 mt-1">{error}</p>}
      </div>
      <div className="shrink-0">
        {sent ? (
          <span className="flex items-center gap-1.5 text-xs text-emerald-400">
            <CheckCircle2 className="size-4" />
            Wysłano
          </span>
        ) : (
          <Button
            size="sm"
            variant="outline"
            onClick={handleResend}
            disabled={pending}
            className="border-amber-500/30 hover:bg-amber-500/10"
          >
            {pending ? <Loader2 className="size-3.5 animate-spin" /> : "Wyślij ponownie"}
          </Button>
        )}
      </div>
    </div>
  )
}
