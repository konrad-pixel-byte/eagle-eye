import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Odzyskiwanie hasła",
  description: "Zresetuj hasło do konta Eagle Eye za pomocą linku e-mail.",
}

export default function ForgotPasswordLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
