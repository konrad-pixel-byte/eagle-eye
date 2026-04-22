"use server"

import { createClient } from "@/lib/supabase/server"
import { createAdminClient } from "@/lib/supabase/admin"
import {
  XP_REWARDS,
  MONTHLY_CHALLENGES,
  getLevelForXp,
  getCurrentMonthKey,
  getBadge as _getBadge,
  type XpEventType,
  type UserGamificationState,
  type MonthlyChallengeProgress,
  type LeaderboardEntry,
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

// ─── Monthly challenges ───────────────────────────────────────────────────────

export async function getMonthlyChallengesProgress(): Promise<MonthlyChallengeProgress[]> {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return []

    const admin = createAdminClient()
    const monthKey = getCurrentMonthKey()
    const monthStart = `${monthKey}-01`

    // Fetch event counts for this month + claimed challenges in parallel
    const [eventRows, claimedRows] = await Promise.all([
      admin
        .from("xp_events")
        .select("event_type")
        .eq("user_id", user.id)
        .gte("created_at", monthStart),
      admin
        .from("user_monthly_achievements")
        .select("challenge_id")
        .eq("user_id", user.id)
        .eq("month_key", monthKey),
    ])

    // Count events per type for the current month
    const countMap = new Map<string, number>()
    for (const row of eventRows.data ?? []) {
      countMap.set(row.event_type, (countMap.get(row.event_type) ?? 0) + 1)
    }

    const claimedIds = new Set((claimedRows.data ?? []).map((r) => r.challenge_id))

    return MONTHLY_CHALLENGES.map((challenge) => {
      const progress = countMap.get(challenge.trackedEvent) ?? 0
      return {
        challenge,
        progress,
        claimed: claimedIds.has(challenge.id),
        completed: progress >= challenge.target,
      }
    })
  } catch {
    return MONTHLY_CHALLENGES.map((challenge) => ({
      challenge,
      progress: 0,
      claimed: false,
      completed: false,
    }))
  }
}

export async function claimMonthlyChallenge(
  challengeId: string
): Promise<{ success: boolean; xpAwarded: number; error?: string }> {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { success: false, xpAwarded: 0, error: "Not authenticated" }

    const challenge = MONTHLY_CHALLENGES.find((c) => c.id === challengeId)
    if (!challenge) return { success: false, xpAwarded: 0, error: "Unknown challenge" }

    const admin = createAdminClient()
    const monthKey = getCurrentMonthKey()
    const monthStart = `${monthKey}-01`

    // Verify progress is sufficient
    const { data: eventRows } = await admin
      .from("xp_events")
      .select("event_type")
      .eq("user_id", user.id)
      .eq("event_type", challenge.trackedEvent)
      .gte("created_at", monthStart)

    const count = (eventRows ?? []).length
    if (count < challenge.target) {
      return { success: false, xpAwarded: 0, error: "Challenge not completed yet" }
    }

    // Insert claim — unique constraint prevents double-claim
    const { error: insertError } = await admin
      .from("user_monthly_achievements")
      .insert({
        user_id: user.id,
        challenge_id: challengeId,
        month_key: monthKey,
        xp_awarded: XP_REWARDS[challenge.xpReward],
      })

    if (insertError) {
      if (insertError.code === "23505") {
        return { success: false, xpAwarded: 0, error: "Already claimed" }
      }
      throw insertError
    }

    // Award XP
    await awardXp(challenge.xpReward)

    return { success: true, xpAwarded: XP_REWARDS[challenge.xpReward] }
  } catch {
    return { success: false, xpAwarded: 0, error: "Server error" }
  }
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

    // Read current level before atomic increment to detect level-up
    const { data: prevRow } = await admin.from("user_xp").select("level").eq("user_id", user.id).maybeSingle()
    const prevLevel = prevRow?.level ?? 1

    // Atomic increment via RPC — avoids read-modify-write race condition
    const { data: rpcResult } = await admin.rpc("increment_user_xp", {
      p_user_id: user.id,
      p_xp: xpEarned,
    })

    const row = Array.isArray(rpcResult) ? rpcResult[0] : rpcResult
    const newXp: number = row?.new_xp ?? xpEarned
    const newLevel: number = row?.new_level ?? getLevelForXp(newXp).level
    const leveledUp = newLevel > prevLevel

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

export async function updateLoginStreak(): Promise<{
  streak: number
  bonusXp: number
  newBadges: string[]
}> {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { streak: 0, bonusXp: 0, newBadges: [] }

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
      return { streak: currentStreak, bonusXp: 0, newBadges: [] }
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
    const bonusXp = newStreak > 1
      ? XP_REWARDS.daily_login + XP_REWARDS.streak_bonus * (newStreak - 1)
      : XP_REWARDS.daily_login
    const { newBadges: xpBadges } = await awardXp("daily_login", { streak: newStreak })

    // Check streak-specific badges
    const streakBadges = await checkStreakBadges(user.id, newStreak)

    return { streak: newStreak, bonusXp, newBadges: [...xpBadges, ...streakBadges] }
  } catch {
    return { streak: 0, bonusXp: 0, newBadges: [] }
  }
}

// ─── Record tender view ───────────────────────────────────────────────────────

export async function recordTenderView(tenderId: string): Promise<void> {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const admin = createAdminClient()

    // Atomic increment via RPC — avoids race condition on concurrent views
    const { data: newViewsData } = await admin.rpc("increment_tender_views", { p_user_id: user.id })
    const newViews: number = typeof newViewsData === "number" ? newViewsData : 1

    // Award XP
    await awardXp("tender_view", { tender_id: tenderId })

    // Check view badges (including new Phase 2 thresholds)
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

  if (savedCount === 1)  await grantBadgeIfNew(admin, user.id, "first_save")
  if (savedCount >= 10)  await grantBadgeIfNew(admin, user.id, "save_10")
  if (savedCount >= 25)  await grantBadgeIfNew(admin, user.id, "save_25")
  if (savedCount >= 50)  await grantBadgeIfNew(admin, user.id, "save_50")
}

// ─── Record AI analysis ───────────────────────────────────────────────────────

export async function recordAiAnalysis(): Promise<void> {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const admin = createAdminClient()

    // Increment lifetime AI total and get new count
    const { data: newTotal } = await admin.rpc("increment_ai_total", { p_user_id: user.id })
    const total: number = typeof newTotal === "number" ? newTotal : 1

    // Award XP for the analysis
    await awardXp("ai_analysis")

    // Check AI badges
    if (total === 1)  await grantBadgeIfNew(admin, user.id, "first_ai")
    if (total >= 10)  await grantBadgeIfNew(admin, user.id, "ai_power")
  } catch {
    // Fail silently — AI analysis itself should not be gated on badge tracking
  }
}

// ─── Record lesson completion ─────────────────────────────────────────────────

export async function recordLessonCompletion(
  userId: string,
  moduleId: number,
  totalLessonsInModule: number
): Promise<void> {
  try {
    const admin = createAdminClient()

    // Award lesson XP
    await awardXpForUser(admin, userId, "complete_lesson", { module_id: moduleId })

    // Check first lesson badge
    const { count } = await admin
      .from("course_progress")
      .select("id", { count: "exact", head: true })
      .eq("user_id", userId)
    if ((count ?? 0) >= 1) await grantBadgeIfNew(admin, userId, "first_lesson")

    // Check if user completed all lessons in a module
    const { count: moduleCount } = await admin
      .from("course_progress")
      .select("id", { count: "exact", head: true })
      .eq("user_id", userId)
      .eq("module_id", moduleId)
    if ((moduleCount ?? 0) >= totalLessonsInModule) {
      await grantBadgeIfNew(admin, userId, "first_module")
    }

    // Check if all 4 modules complete (3 lessons each = 12 total)
    const { count: totalCount } = await admin
      .from("course_progress")
      .select("id", { count: "exact", head: true })
      .eq("user_id", userId)
    if ((totalCount ?? 0) >= 12) {
      await grantBadgeIfNew(admin, userId, "all_modules")
    }
  } catch {
    // Fail silently
  }
}

// ─── Badge helpers ────────────────────────────────────────────────────────────

async function checkAndGrantBadges(userId: string, _xp: number, level: number): Promise<string[]> {
  const admin = createAdminClient()
  const granted: string[] = []

  const levelBadges: Array<{ minLevel: number; id: string }> = [
    { minLevel: 3,  id: "level_3" },
    { minLevel: 5,  id: "level_5" },
    { minLevel: 7,  id: "level_7" },
    { minLevel: 10, id: "level_10" },
  ]

  for (const { minLevel, id } of levelBadges) {
    if (level >= minLevel) {
      const ok = await grantBadgeIfNew(admin, userId, id)
      if (ok) granted.push(id)
    }
  }

  return granted
}

async function checkViewBadges(userId: string, views: number): Promise<void> {
  const admin = createAdminClient()
  if (views >= 10)  await grantBadgeIfNew(admin, userId, "spy_10")
  if (views >= 50)  await grantBadgeIfNew(admin, userId, "spy_50")
  if (views >= 100) await grantBadgeIfNew(admin, userId, "spy_100")
  if (views >= 250) await grantBadgeIfNew(admin, userId, "spy_250")
  if (views >= 500) await grantBadgeIfNew(admin, userId, "spy_500")
}

async function checkStreakBadges(userId: string, streak: number): Promise<string[]> {
  const admin = createAdminClient()
  const granted: string[] = []

  const thresholds: Array<{ min: number; id: string }> = [
    { min: 3,   id: "streak_3" },
    { min: 7,   id: "streak_7" },
    { min: 14,  id: "streak_14" },
    { min: 30,  id: "streak_30" },
    { min: 60,  id: "streak_60" },
    { min: 100, id: "streak_100" },
  ]

  for (const { min, id } of thresholds) {
    if (streak >= min) {
      const ok = await grantBadgeIfNew(admin, userId, id)
      if (ok) granted.push(id)
    }
  }

  return granted
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

  if (!error) return true
  // 23505 = unique_violation — badge already granted, not an error
  if ((error as { code?: string }).code === "23505") return false
  console.error(`[grantBadgeIfNew] Unexpected error granting ${badgeId}:`, (error as { message?: string }).message)
  return false
}

// Helper: award XP for a specific userId (used by server-side lesson completion)
async function awardXpForUser(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  admin: any,
  userId: string,
  eventType: XpEventType,
  metadata: Record<string, unknown> = {}
): Promise<void> {
  const xpEarned = XP_REWARDS[eventType]
  try {
    await admin.rpc("increment_user_xp", { p_user_id: userId, p_xp: xpEarned })
    await admin.from("xp_events").insert({
      user_id: userId,
      event_type: eventType,
      xp_earned: xpEarned,
      metadata,
    })
  } catch {
    // Fail silently
  }
}

// ─── Leaderboard ─────────────────────────────────────────────────────────────

export async function getLeaderboard(limit = 20): Promise<LeaderboardEntry[]> {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return []

    const admin = createAdminClient()

    // Fetch top users by XP
    const { data: xpRows, error } = await admin
      .from("user_xp")
      .select("user_id, total_xp, level")
      .order("total_xp", { ascending: false })
      .limit(limit)

    if (error || !xpRows?.length) return []

    const userIds = xpRows.map((r) => r.user_id)

    // Parallel: streaks, badges, views, profiles
    const [streakRows, badgeRows, viewRows, profileRows] = await Promise.all([
      admin.from("user_streaks").select("user_id, current_streak").in("user_id", userIds),
      admin.from("user_badges").select("user_id, badge_id").in("user_id", userIds),
      admin.from("user_tender_views").select("user_id, total_views").in("user_id", userIds),
      admin.from("profiles").select("id, full_name, company_name").in("id", userIds),
    ])

    const streakMap = new Map((streakRows.data ?? []).map((r) => [r.user_id, r.current_streak]))
    const viewMap = new Map((viewRows.data ?? []).map((r) => [r.user_id, r.total_views]))
    const profileMap = new Map((profileRows.data ?? []).map((r) => [r.id, r]))

    // Count badges per user
    const badgeCountMap = new Map<string, number>()
    for (const b of badgeRows.data ?? []) {
      badgeCountMap.set(b.user_id, (badgeCountMap.get(b.user_id) ?? 0) + 1)
    }

    return xpRows.map((row, i) => {
      const levelCfg = getLevelForXp(row.total_xp)
      const profile = profileMap.get(row.user_id)
      const displayName =
        profile?.full_name?.trim() ||
        profile?.company_name?.trim() ||
        `Użytkownik #${i + 1}`

      return {
        rank: i + 1,
        userId: row.user_id,
        displayName,
        totalXp: row.total_xp,
        level: levelCfg.level,
        levelTitle: levelCfg.title,
        levelIcon: levelCfg.icon,
        currentStreak: streakMap.get(row.user_id) ?? 0,
        badgeCount: badgeCountMap.get(row.user_id) ?? 0,
        tenderViews: viewMap.get(row.user_id) ?? 0,
        isCurrentUser: row.user_id === user.id,
      }
    })
  } catch {
    return []
  }
}

export async function grantWelcomeBadge(): Promise<void> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return

  const admin = createAdminClient()
  await grantBadgeIfNew(admin, user.id, "welcome")
  await awardXp("complete_onboarding")
}
