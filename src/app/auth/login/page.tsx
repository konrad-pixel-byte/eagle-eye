"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Eye } from "lucide-react"

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
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    const supabase = createClient()
    const { error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (authError) {
      setError("Nieprawidłowy adres e-mail lub hasło. Spróbuj ponownie.")
      setIsLoading(false)
      return
    }

    router.push("/dashboard")
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
            <CardTitle>Zaloguj się</CardTitle>
            <CardDescription>
              Wpisz swój adres e-mail i hasło, aby kontynuować.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form id="login-form" onSubmit={handleSubmit} className="flex flex-col gap-4">
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
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Hasło</Label>
                  <Link
                    href="/auth/forgot-password"
                    className="text-xs text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
                  >
                    Nie pamiętam hasła
                  </Link>
                </div>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
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
              form="login-form"
              className="w-full bg-[#0EA5E9] text-white hover:bg-[#0EA5E9]/90"
              disabled={isLoading}
            >
              {isLoading ? "Logowanie…" : "Zaloguj się"}
            </Button>

            <p className="text-center text-sm text-muted-foreground">
              Nie masz konta?{" "}
              <Link
                href="/auth/signup"
                className="text-foreground underline-offset-4 hover:underline"
              >
                Zarejestruj się
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
