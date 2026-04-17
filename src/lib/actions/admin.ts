"use server"

import { createClient } from "@/lib/supabase/server"
import { createAdminClient } from "@/lib/supabase/admin"
import { redirect } from "next/navigation"

const ADMIN_EMAIL = process.env.ADMIN_EMAIL ?? "conrad.bednarski@gmail.com"

async function requireAdmin(): Promise<string> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user || user.email !== ADMIN_EMAIL) redirect("/dashboard")
  return user.id
}

export interface AdminStats {
  tenderCount: number
  userCount: number
  bzpCount: number
  tedCount: number
  savedTenderCount: number
  recentTenders: { id: string; title: string; source: string; created_at: string }[]
  recentUsers: { id: string; email: string; created_at: string }[]
}

export async function getAdminStats(): Promise<AdminStats> {
  await requireAdmin()
  const admin = createAdminClient()

  const [
    tenderResult,
    bzpResult,
    tedResult,
    savedResult,
    recentTendersResult,
  ] = await Promise.all([
    admin.from("tenders").select("id", { count: "exact", head: true }),
    admin.from("tenders").select("id", { count: "exact", head: true }).eq("source", "BZP"),
    admin.from("tenders").select("id", { count: "exact", head: true }).eq("source", "TED"),
    admin.from("saved_tenders").select("id", { count: "exact", head: true }),
    admin
      .from("tenders")
      .select("id, title, source, created_at")
      .order("created_at", { ascending: false })
      .limit(10),
  ])

  // User count via auth.users requires service_role
  let userCount = 0
  try {
    const { data: authData } = await admin.auth.admin.listUsers({ perPage: 1 })
    userCount = ("total" in authData ? authData.total : null) ?? authData.users.length
  } catch {
    // Falls back to 0 if auth admin API unavailable
  }

  return {
    tenderCount: tenderResult.count ?? 0,
    bzpCount: bzpResult.count ?? 0,
    tedCount: tedResult.count ?? 0,
    savedTenderCount: savedResult.count ?? 0,
    userCount,
    recentTenders: (recentTendersResult.data ?? []).map((t) => ({
      id: t.id,
      title: t.title ?? "(brak tytułu)",
      source: t.source ?? "?",
      created_at: t.created_at,
    })),
    recentUsers: [],
  }
}

export async function triggerScraper(
  type: "bzp" | "ted" | "all"
): Promise<{ ok: boolean; message: string; added?: number }> {
  await requireAdmin()

  const cronSecret = process.env.CRON_SECRET
  if (!cronSecret) {
    return { ok: false, message: "CRON_SECRET nie ustawiony — nie można uruchomić scrapera." }
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://eagle-eye.hatedapps.pl"
  const endpoint = `${appUrl}/api/scraper/${type}`

  try {
    const res = await fetch(endpoint, {
      method: "POST",
      headers: { Authorization: `Bearer ${cronSecret}` },
    })
    const body = await res.json() as Record<string, unknown>

    if (!res.ok) {
      return { ok: false, message: `HTTP ${res.status}: ${JSON.stringify(body)}` }
    }

    // Extract "added" count from response shapes
    if (type === "all") {
      const bzpAdded = (body.bzp as Record<string, unknown>)?.added as number ?? 0
      const tedAdded = (body.ted as Record<string, unknown>)?.added as number ?? 0
      return { ok: true, message: `BZP: +${bzpAdded} | TED: +${tedAdded}`, added: bzpAdded + tedAdded }
    }
    const added = body.added as number ?? 0
    return { ok: true, message: `Scraper ${type.toUpperCase()}: +${added} nowych przetargów`, added }
  } catch (err) {
    return { ok: false, message: err instanceof Error ? err.message : "Błąd połączenia" }
  }
}
