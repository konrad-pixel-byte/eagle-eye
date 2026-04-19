export type SubscriptionTier = "free" | "basic" | "pro" | "enterprise";

// Feature gates — which tier is needed
export const FEATURE_ACCESS: Record<string, SubscriptionTier> = {
  "tender-list": "free",
  "tender-detail-basic": "free",
  "tender-detail-full": "basic",
  "tender-save": "basic",
  "tender-filters-advanced": "basic",
  "bid-calculator": "basic",
  "akademia-full": "basic",
  "kfs-bur-dashboard": "pro",
  "ai-bid-coach": "pro",
  "competitor-analysis": "pro",
  "real-time-alerts": "pro",
  "api-access": "enterprise",
  "webhook": "enterprise",
  "unlimited-users": "enterprise",
};

const TIER_LEVEL: Record<SubscriptionTier, number> = {
  free: 0,
  basic: 1,
  pro: 2,
  enterprise: 3,
};

export function hasAccess(userTier: SubscriptionTier, requiredTier: SubscriptionTier): boolean {
  return TIER_LEVEL[userTier] >= TIER_LEVEL[requiredTier];
}

export function canAccessFeature(userTier: SubscriptionTier, feature: string): boolean {
  const required = FEATURE_ACCESS[feature];
  if (!required) return true; // unknown features are allowed
  return hasAccess(userTier, required);
}

export function getRequiredTierForFeature(feature: string): SubscriptionTier {
  return FEATURE_ACCESS[feature] ?? "free";
}

// ─── AI usage quotas (calls per day per endpoint) ────────────────────────────

export type AiEndpoint = "score" | "summary" | "bid-coach";

export const AI_DAILY_QUOTA: Record<SubscriptionTier, Record<AiEndpoint, number>> = {
  free:       { score: 10,  summary: 0,   "bid-coach": 0   },
  basic:      { score: 100, summary: 50,  "bid-coach": 0   },
  pro:        { score: 500, summary: 250, "bid-coach": 100 },
  enterprise: { score: 5000, summary: 2500, "bid-coach": 1000 },
};

export function getAiQuota(tier: SubscriptionTier, endpoint: AiEndpoint): number {
  return AI_DAILY_QUOTA[tier][endpoint];
}


export function getTierLabel(tier: SubscriptionTier): string {
  const labels: Record<SubscriptionTier, string> = {
    free: "Free",
    basic: "Basic",
    pro: "Pro",
    enterprise: "Enterprise",
  };
  return labels[tier];
}
