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

export function getTierLabel(tier: SubscriptionTier): string {
  const labels: Record<SubscriptionTier, string> = {
    free: "Free",
    basic: "Basic",
    pro: "Pro",
    enterprise: "Enterprise",
  };
  return labels[tier];
}
