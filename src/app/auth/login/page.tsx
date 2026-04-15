"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Eye } from "lucide-react"

import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

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
    <div className="flex min-h-[100dvh]">
      {/* Left brand panel */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-between bg-zinc-950 px-12 py-10">
        <div className="flex items-center gap-2.5">
          <Eye className="size-5 text-zinc-100" />
          <span className="text-sm font-semibold tracking-tight text-zinc-100">Eagle Eye</span>
        </div>

        <div className="space-y-4">
          <h1 className="text-4xl font-bold text-zinc-100 leading-tight">
            Witaj z powrotem.
          </h1>
          <p className="text-zinc-500 text-base leading-relaxed max-w-sm">
            Monitoruj przetargi szkoleniowe w czasie rzeczywistym. Nie przegap żadnej okazji — system pracuje za Ciebie.
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
            <h2 className="text-2xl font-bold text-zinc-100 lg:text-zinc-950">Zaloguj się</h2>
            <p className="mt-1.5 text-sm text-zinc-500">
              Wpisz swoje dane, aby kontynuować.
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

            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-zinc-100 lg:text-zinc-950">Hasło</Label>
                <Link
                  href="/auth/forgot-password"
                  className="text-xs text-[#0EA5E9] hover:text-[#0EA5E9]/80 transition-colors"
                >
                  Nie pamiętasz hasła?
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
              <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                {error}
              </p>
            )}

            <Button
              type="submit"
              className="w-full bg-zinc-100 text-zinc-950 hover:bg-white active:scale-[0.98] transition-all font-medium"
              disabled={isLoading}
            >
              {isLoading ? "Logowanie…" : "Zaloguj się"}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-zinc-500">
            Nie masz konta?{" "}
            <Link
              href="/auth/signup"
              className="text-[#0EA5E9] hover:text-[#0EA5E9]/80 transition-colors"
            >
              Utwórz konto
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
