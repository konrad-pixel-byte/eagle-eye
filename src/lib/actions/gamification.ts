"use server"

import { createClient } from "@/lib/supabase/server"
import { createAdminClient } from "@/lib/supabase/admin"
import {
  XP_REWARDS,
  getLevelForXp,
  BADGES,
  type XpEventType,
  type UserGamificationState,
  xpToNextLevel,
} from "@/lib/gamification"

// ─── Read ─────────────────────────────────────────────────────────────────────

export async function getGamificationState(): Promise<UserGamificationState | null> {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return null

    const [xpResult, streakResult, badgesResult, viewsResult] = await Promise.all([
      supabase.from("user_xp").select("*").eq("user_id", user.id).maybeSingle(),
      supabase.from("user_streaks").select("*").eq("user_id", user.id).maybeSingle(),
      supabase.from("user_badges").select("badge_id").eq("user_id", user.id),
      supabase.from("user_tender_views").select("total_views").eq("user_id", user.id).maybeSingle(),
    ])

    // If tables don't exist yet (migration pending), return zeroed state
    if (xpResult.error?.message?.includes("does not exist")) {
      return getZeroState()
    }

    const totalXp = xpResult.data?.total_xp ?? 0
    const { current, next, progress } = xpToNextLevel(totalXp)

    return {
      totalXp,
      level: current.level,
      levelConfig: current,
      nextLevel: next,
      xpProgress: progress,
      currentStreak: streakResult.data?.current_streak ?? 0,
      longestStreak: streakResult.data?.longest_streak ?? 0,
      badges: (badgesResult.data ?? []).map((b) => b.badge_id),
      tenderViews: viewsResult.data?.total_views ?? 0,
    }
  } catch {
    return getZeroState()
  }
}

function getZeroState(): UserGamificationState {
  const { current, next, progress } = xpToNextLevel(0)
  return {
    totalXp: 0,
    level: 1,
    levelConfig: current,
    nextLevel: next,
    xpProgress: progress,
    currentStreak: 0,
    longestStreak: 0,
    badges: [],
    tenderViews: 0,
  }
}

export async function getRecentXpEvents(limit = 10) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return []

  const { data } = await supabase
    .from("xp_events")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(limit)

  return data ?? []
}

// ─── Award XP ─────────────────────────────────────────────────────────────────

export async function awardXp(
  eventType: XpEventType,
  metadata: Record<string, unknown> = {}
): Promise<{ newXp: number; newLevel: number; leveledUp: boolean; newBadges: string[] }> {
  try {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { newXp: 0, newLevel: 1, leveledUp: false, newBadges: [] }

  const admin = createAdminClient()
  const xpEarned = XP_REWARDS[eventType]

  // Upsert XP record
  const { data: existing } = await admin
    .from("user_xp")
    .select("total_xp, level")
    .eq("user_id", user.id)
    .maybeSingle()

  const prevXp = existing?.total_xp ?? 0
  const prevLevel = existing?.level ?? 1
  const newXp = prevXp + xpEarned
  const newLevel = getLevelForXp(newXp).level
  const leveledUp = newLevel > prevLevel

  await admin.from("user_xp").upsert(
    { user_id: user.id, total_xp: newXp, level: newLevel, updated_at: new Date().toISOString() },
    { onConflict: "user_id" }
  )

  // Log the event
  await admin.from("xp_events").insert({
    user_id: user.id,
    event_type: eventType,
    xp_earned: xpEarned,
    metadata,
  })

  // Check badges
  const newBadges = await checkAndGrantBadges(user.id, newXp, newLevel)

  return { newXp, newLevel, leveledUp, newBadges }
  } catch {
    return { newXp: 0, newLevel: 1, leveledUp: false, newBadges: [] }
  }
}

// ─── Login streak ─────────────────────────────────────────────────────────────

export async function updateLoginStreak(): Promise<{ streak: number; bonusXp: number }> {
  try {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { streak: 0, bonusXp: 0 }

  const admin = createAdminClient()
  const today = new Date().toISOString().split("T")[0]

  const { data: existing } = await admin
    .from("user_streaks")
    .select("*")
    .eq("user_id", user.id)
    .maybeSingle()

  const lastDate = existing?.last_login_date
  const currentStreak = existing?.current_streak ?? 0
  const longestStreak = existing?.longest_streak ?? 0

  if (lastDate === today) {
    return { streak: currentStreak, bonusXp: 0 }
  }

  const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0]
  const newStreak = lastDate === yesterday ? currentStreak + 1 : 1
  const newLongest = Math.max(longestStreak, newStreak)

  await admin.from("user_streaks").upsert(
    {
      user_id: user.id,
      current_streak: newStreak,
      longest_streak: newLongest,
      last_login_date: today,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "user_id" }
  )

  // Award daily login XP
  const bonusXp = newStreak > 1 ? XP_REWARDS.daily_login + XP_REWARDS.streak_bonus * (newStreak - 1) : XP_REWARDS.daily_login
  await awardXp("daily_login", { streak: newStreak })

  // Check streak badges
  await checkStreakBadges(user.id, newStreak)

  return { streak: newStreak, bonusXp }
  } catch {
    return { streak: 0, bonusXp: 0 }
  }
}

// ─── Record tender view ───────────────────────────────────────────────────────

export async function recordTenderView(tenderId: string): Promise<void> {
  try {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return

  const admin = createAdminClient()

  // Increment view counter
  const { data: existing } = await admin
    .from("user_tender_views")
    .select("total_views")
    .eq("user_id", user.id)
    .maybeSingle()

  const newViews = (existing?.total_views ?? 0) + 1

  await admin.from("user_tender_views").upsert(
    { user_id: user.id, total_views: newViews, updated_at: new Date().toISOString() },
    { onConflict: "user_id" }
  )

  // Award XP
  await awardXp("tender_view", { tender_id: tenderId })

  // Check view badges
  await checkViewBadges(user.id, newViews)
  } catch {
    // Tables may not exist yet — fail silently
  }
}

// ─── Record save tender ───────────────────────────────────────────────────────

export async function recordSaveTender(savedCount: number): Promise<void> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return

  await awardXp("save_tender")

  const admin = createAdminClient()

  if (savedCount === 1) {
    await grantBadgeIfNew(admin, user.id, "first_save")
  }
  if (savedCount >= 10) {
    await grantBadgeIfNew(admin, user.id, "save_10")
  }
}

// ─── Badge helpers ────────────────────────────────────────────────────────────

async function checkAndGrantBadges(userId: string, _xp: number, level: number): Promise<string[]> {
  const admin = createAdminClient()
  const granted: string[] = []

  if (level >= 5) {
    const ok = await grantBadgeIfNew(admin, userId, "level_5")
    if (ok) granted.push("level_5")
  }
  if (level >= 10) {
    const ok = await grantBadgeIfNew(admin, userId, "level_10")
    if (ok) granted.push("level_10")
  }

  return granted
}

async function checkViewBadges(userId: string, views: number): Promise<void> {
  const admin = createAdminClient()
  if (views >= 10) await grantBadgeIfNew(admin, userId, "spy_10")
  if (views >= 50) await grantBadgeIfNew(admin, userId, "spy_50")
  if (views >= 100) await grantBadgeIfNew(admin, userId, "spy_100")
}

async function checkStreakBadges(userId: string, streak: number): Promise<void> {
  const admin = createAdminClient()
  if (streak >= 7) await grantBadgeIfNew(admin, userId, "streak_7")
  if (streak >= 30) await grantBadgeIfNew(admin, userId, "streak_30")
}

async function grantBadgeIfNew(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  admin: any,
  userId: string,
  badgeId: string
): Promise<boolean> {
  const { error } = await admin
    .from("user_badges")
    .insert({ user_id: userId, badge_id: badgeId })

  return !error
}

export async function grantWelcomeBadge(): Promise<void> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return

  const admin = createAdminClient()
  await grantBadgeIfNew(admin, user.id, "welcome")
  await awardXp("complete_onboarding")
}

export { BADGES }
