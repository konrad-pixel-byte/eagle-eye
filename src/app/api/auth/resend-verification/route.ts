import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

// Resends the signup confirmation email for the currently logged-in user.
// Requires a valid session so anonymous callers cannot enumerate emails.
export async function POST(req: Request) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: "Brak sesji" }, { status: 401 })
  }

  if (user.email_confirmed_at) {
    return NextResponse.json({ error: "Email już potwierdzony" }, { status: 400 })
  }

  let bodyEmail: string | undefined
  try {
    const body = (await req.json()) as { email?: string }
    bodyEmail = body.email
  } catch {
    // no body — fall back to session email
  }

  const email = bodyEmail ?? user.email
  if (!email) {
    return NextResponse.json({ error: "Brak adresu email" }, { status: 400 })
  }

  // Only the session-owner's email is accepted; mismatches suggest tampering.
  if (email !== user.email) {
    return NextResponse.json({ error: "Email nie zgadza się z sesją" }, { status: 400 })
  }

  const { error } = await supabase.auth.resend({ type: "signup", email })
  if (error) {
    console.error("[resend-verification]", error.message)
    return NextResponse.json({ error: "Nie udało się wysłać maila" }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
