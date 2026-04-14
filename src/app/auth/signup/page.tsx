"use client"

import { useState } from "react"
import Link from "next/link"
import { Eye, CheckCircle } from "lucide-react"

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

export default function SignupPage() {
  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    const supabase = createClient()
    const { error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName },
      },
    })

    if (authError) {
      setError(
        authError.message === "User already registered"
          ? "Konto z tym adresem e-mail już istnieje."
          : "Rejestracja nie powiodła się. Spróbuj ponownie."
      )
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
                <CheckCircle className="size-10 text-[#0EA5E9]" />
                <h2 className="text-base font-semibold">Sprawdź swoją skrzynkę</h2>
                <p className="text-sm text-muted-foreground">
                  Wysłaliśmy link weryfikacyjny na adres{" "}
                  <span className="font-medium text-foreground">{email}</span>.
                  Kliknij go, aby aktywować konto.
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
            <CardTitle>Utwórz konto</CardTitle>
            <CardDescription>
              Zarejestruj się, aby monitorować przetargi szkoleniowe.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form id="signup-form" onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="full_name">Imię i nazwisko</Label>
                <Input
                  id="full_name"
                  type="text"
                  placeholder="Jan Kowalski"
                  autoComplete="name"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                />
              </div>

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

              <div className="flex flex-col gap-1.5">
                <Label htmlFor="password">Hasło</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  autoComplete="new-password"
                  required
                  minLength={8}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">Minimum 8 znaków.</p>
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
              form="signup-form"
              className="w-full bg-[#0EA5E9] text-white hover:bg-[#0EA5E9]/90"
              disabled={isLoading}
            >
              {isLoading ? "Rejestracja…" : "Zarejestruj się"}
            </Button>

            <p className="text-center text-sm text-muted-foreground">
              Masz już konto?{" "}
              <Link
                href="/auth/login"
                className="text-foreground underline-offset-4 hover:underline"
              >
                Zaloguj się
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
