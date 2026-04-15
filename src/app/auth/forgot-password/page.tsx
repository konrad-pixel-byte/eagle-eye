"use client"

import { useState } from "react"
import Link from "next/link"
import { Eye, MailCheck } from "lucide-react"

import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
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
      <div className="flex min-h-[100dvh]">
        {/* Left brand panel */}
        <div className="hidden lg:flex lg:w-1/2 flex-col justify-between bg-zinc-950 px-12 py-10">
          <div className="flex items-center gap-2.5">
            <Eye className="size-5 text-zinc-100" />
            <span className="text-sm font-semibold tracking-tight text-zinc-100">Eagle Eye</span>
          </div>

          <div className="space-y-4">
            <h1 className="text-4xl font-bold text-zinc-100 leading-tight">
              Nie pamiętasz hasła?
            </h1>
            <p className="text-zinc-500 text-base leading-relaxed max-w-sm">
              Zdarza się każdemu. Wyślemy Ci link — nowe hasło ustawisz w mniej niż minutę.
            </p>
          </div>

          <p className="text-xs text-zinc-700 font-mono">eagle-eye.hatedapps.pl</p>
        </div>

        {/* Right success panel */}
        <div className="flex w-full lg:w-1/2 flex-col justify-center px-6 py-10 sm:px-12 bg-zinc-950 lg:bg-white">
          <div className="w-full max-w-sm mx-auto">
            <div className="flex flex-col items-center gap-4 text-center py-8">
              <MailCheck className="size-12 text-[#0EA5E9]" />
              <div className="space-y-2">
                <h2 className="text-xl font-bold text-zinc-100 lg:text-zinc-950">E-mail wysłany</h2>
                <p className="text-sm text-zinc-500 leading-relaxed">
                  Jeśli konto o adresie{" "}
                  <span className="font-medium text-zinc-100 lg:text-zinc-950 font-mono">{email}</span>{" "}
                  istnieje, otrzymasz wiadomość z linkiem do resetowania hasła.
                </p>
              </div>
              <Link
                href="/auth/login"
                className="mt-2 text-sm text-[#0EA5E9] hover:text-[#0EA5E9]/80 transition-colors"
              >
                Wróć do logowania
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-[100dvh]">
      {/* Left brand panel */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-between bg-zinc-950 px-12 py-10">
        <div className="flex items-center gap-2.5">
          <Eye className="size-5 text-zinc-100" />
          <span className="text-sm font-semibold tracking-tight text-zinc-100">Eagle Eye</span>
        </div>

        <div className="space-y-4">
          <h1 className="text-4xl font-bold text-zinc-100 leading-tight">
            Nie pamiętasz hasła?
          </h1>
          <p className="text-zinc-500 text-base leading-relaxed max-w-sm">
            Zdarza się każdemu. Wyślemy Ci link — nowe hasło ustawisz w mniej niż minutę.
          </p>
        </div>

        <p className="text-xs text-zinc-700 font-mono">eagle-eye.hatedapps.pl</p>
      </div>

      {/* Right form panel */}
      <div className="flex w-full lg:w-1/2 flex-col justify-center px-6 py-10 sm:px-12 bg-zinc-950 lg:bg-white">
        {/* Mobile logo */}
        <div className="flex items-center gap-2 mb-10 lg:hidden">
          <Eye className="size-5 text-zinc-100" />
          <span className="text-sm font-semibold tracking-tight text-zinc-100">Eagle Eye</span>
        </div>

        <div className="w-full max-w-sm mx-auto">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-zinc-100 lg:text-zinc-950">Zresetuj hasło</h2>
            <p className="mt-1.5 text-sm text-zinc-500">
              Podaj adres email powiązany z kontem — wyślemy Ci link do resetowania.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="email" className="text-zinc-100 lg:text-zinc-950">Adres email</Label>
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
              <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                {error}
              </p>
            )}

            <Button
              type="submit"
              className="w-full bg-zinc-100 text-zinc-950 hover:bg-white active:scale-[0.98] transition-all font-medium"
              disabled={isLoading}
            >
              {isLoading ? "Wysyłanie…" : "Wyślij link resetujący"}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-zinc-500">
            <Link
              href="/auth/login"
              className="text-[#0EA5E9] hover:text-[#0EA5E9]/80 transition-colors"
            >
              Wróć do logowania
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
