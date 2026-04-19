import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Rejestracja",
  description:
    "Załóż konto Eagle Eye i zacznij wygrywać przetargi szkoleniowe już dziś.",
}

export default function SignupLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
