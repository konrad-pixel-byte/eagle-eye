"use client"

import { useState } from "react"
import Link from "next/link"
import { Eye, MailCheck } from "lucide-react"

import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    const supabase = createClient()
    const { error: authError } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/callback?next=/auth/update-password`,
    })

    if (authError) {
      setError("Nie udało się wysłać e-maila. Sprawdź adres i spróbuj ponownie.")
      setIsLoading(false)
      return
    }

    setIsSuccess(true)
    setIsLoading(false)
  }

  if (isSuccess) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-4">
        <div className="w-full max-w-sm">
          <div className="mb-6 flex flex-col items-center gap-2">
            <div className="flex size-12 items-center justify-center rounded-xl bg-[#0EA5E9]">
              <Eye className="size-6 text-white" />
            </div>
            <span className="text-lg font-semibold tracking-tight text-foreground">
              Eagle Eye
            </span>
          </div>

          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center gap-3 py-4 text-center">
                <MailCheck className="size-10 text-[#0EA5E9]" />
                <h2 className="text-base font-semibold">E-mail wysłany</h2>
                <p className="text-sm text-muted-foreground">
                  Jeśli konto o adresie{" "}
                  <span className="font-medium text-foreground">{email}</span> istnieje,
                  otrzymasz wiadomość z linkiem do resetowania hasła.
                </p>
                <Link
                  href="/auth/login"
                  className="mt-2 text-sm text-[#0EA5E9] underline-offset-4 hover:underline"
                >
                  Wróć do logowania
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm">
        <div className="mb-6 flex flex-col items-center gap-2">
          <div className="flex size-12 items-center justify-center rounded-xl bg-[#0EA5E9]">
            <Eye className="size-6 text-white" />
          </div>
          <span className="text-lg font-semibold tracking-tight text-foreground">
            Eagle Eye
          </span>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Resetuj hasło</CardTitle>
            <CardDescription>
              Podaj swój adres e-mail, a wyślemy Ci link do resetowania hasła.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form id="forgot-form" onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="email">Adres e-mail</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="ty@firma.pl"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              {error && (
                <p className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">
                  {error}
                </p>
              )}
            </form>
          </CardContent>

          <CardFooter className="flex flex-col gap-3">
            <Button
              type="submit"
              form="forgot-form"
              className="w-full bg-[#0EA5E9] text-white hover:bg-[#0EA5E9]/90"
              disabled={isLoading}
            >
              {isLoading ? "Wysyłanie…" : "Wyślij link resetujący"}
            </Button>

            <Link
              href="/auth/login"
              className="text-center text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
            >
              Wróć do logowania
            </Link>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
