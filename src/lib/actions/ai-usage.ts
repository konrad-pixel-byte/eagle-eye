"use server"

import { createClient } from "@/lib/supabase/server"
import { AI_DAILY_QUOTA, type AiEndpoint, type SubscriptionTier } from "@/lib/subscription"

export interface AiUsageSummary {
  endpoint: AiEndpoint
  used: number
  limit: number
  remaining: number
}

export async function getTodayAiUsage(): Promise<AiUsageSummary[]> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return []

  const { data: profile } = await supabase
    .from("profiles")
    .select("subscription_tier")
    .eq("id", user.id)
    .single<{ subscription_tier: SubscriptionTier }>()

  const tier: SubscriptionTier = profile?.subscription_tier ?? "free"
  const quotas = AI_DAILY_QUOTA[tier]

  const today = new Date().toISOString().slice(0, 10)
  const { data: rows } = await supabase
    .from("ai_usage")
    .select("endpoint, call_count")
    .eq("user_id", user.id)
    .eq("usage_date", today)

  const usageMap = new Map<string, number>(
    (rows ?? []).map((r: { endpoint: string; call_count: number }) => [
      r.endpoint,
      r.call_count,
    ])
  )

  const endpoints: AiEndpoint[] = ["score", "summary", "bid-coach"]
  return endpoints.map((endpoint) => {
    const used = usageMap.get(endpoint) ?? 0
    const limit = quotas[endpoint]
    return {
      endpoint,
      used,
      limit,
      remaining: Math.max(0, limit - used),
    }
  })
}
