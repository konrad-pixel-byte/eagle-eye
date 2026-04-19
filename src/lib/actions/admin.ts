"use server"

import { createClient } from "@/lib/supabase/server"
import { createAdminClient } from "@/lib/supabase/admin"
import { redirect } from "next/navigation"
import type { AdminStats } from "@/lib/types"
import { PLANS } from "@/lib/stripe"

function getAdminEmail(): string {
  const email = process.env.ADMIN_EMAIL
  if (!email) throw new Error("ADMIN_EMAIL env var is not set")
  return email
}

async function requireAdmin(): Promise<string> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user || user.email !== getAdminEmail()) redirect("/dashboard")
  return user.id
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
    profilesResult,
    heartbeatsResult,
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
    admin
      .from("profiles")
      .select("subscription_tier, subscription_status"),
    admin
      .from("cron_heartbeats")
      .select("job_name, last_run_at, last_status, duration_ms, details")
      .order("job_name"),
  ])

  const tierBreakdown = { free: 0, basic: 0, pro: 0, enterprise: 0 }
  let activePaying = 0
  let trialingCount = 0
  let pastDueCount = 0
  let mrrGrosze = 0

  const profileRows = (profilesResult.data ?? []) as Array<{
    subscription_tier: string | null
    subscription_status: string | null
  }>

  for (const row of profileRows) {
    const tier = (row.subscription_tier ?? "free") as keyof typeof tierBreakdown
    if (tier in tierBreakdown) tierBreakdown[tier] += 1

    const status = row.subscription_status
    if (tier !== "free" && status === "active") {
      activePaying += 1
      if (tier === "basic" || tier === "pro" || tier === "enterprise") {
        mrrGrosze += PLANS[tier].price
      }
    }
    if (status === "trialing") trialingCount += 1
    if (status === "past_due") pastDueCount += 1
  }

  // User count + recent signups via auth.users (requires service_role)
  let userCount = 0
  let recentUsers: AdminStats["recentUsers"] = []
  try {
    const { data: authData } = await admin.auth.admin.listUsers({
      page: 1,
      perPage: 10,
    })
    userCount = ("total" in authData ? authData.total : null) ?? authData.users.length
    recentUsers = authData.users
      .slice()
      .sort((a, b) => (b.created_at ?? "").localeCompare(a.created_at ?? ""))
      .slice(0, 10)
      .map((u) => ({
        id: u.id,
        email: u.email ?? "(brak emaila)",
        created_at: u.created_at ?? new Date().toISOString(),
      }))
  } catch {
    // Falls back to 0 / [] if auth admin API unavailable
  }

  return {
    tenderCount: tenderResult.count ?? 0,
    bzpCount: bzpResult.count ?? 0,
    tedCount: tedResult.count ?? 0,
    savedTenderCount: savedResult.count ?? 0,
    userCount,
    tierBreakdown,
    activePaying,
    trialingCount,
    pastDueCount,
    mrrGrosze,
    recentTenders: (recentTendersResult.data ?? []).map((t) => ({
      id: t.id,
      title: t.title ?? "(brak tytułu)",
      source: t.source ?? "?",
      created_at: t.created_at,
    })),
    recentUsers,
    cronHeartbeats: (heartbeatsResult.data ?? []) as AdminStats["cronHeartbeats"],
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
