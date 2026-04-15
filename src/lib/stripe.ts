import Stripe from "stripe";

// Lazy init — avoid crash at build time when env vars aren't set
let _stripe: Stripe | null = null;

export function getStripe(): Stripe {
  if (!_stripe) {
    const key = process.env.STRIPE_SECRET_KEY;
    if (!key) throw new Error("STRIPE_SECRET_KEY is not configured");
    _stripe = new Stripe(key, {
      apiVersion: "2026-03-25.dahlia",
      typescript: true,
    });
  }
  return _stripe;
}

export const PLANS = {
  basic: {
    name: "Basic",
    price: 29900, // 299 PLN in grosze
    priceId: process.env.STRIPE_BASIC_PRICE_ID ?? "",
    features: [
      "Nieograniczone przetargi",
      "Alerty 2x/dziennie",
      "Kalkulator ofert",
      "Akademia ZP",
    ],
  },
  pro: {
    name: "Pro",
    price: 59900, // 599 PLN
    priceId: process.env.STRIPE_PRO_PRICE_ID ?? "",
    features: [
      "Wszystko z Basic",
      "AI Bid Coach",
      "Alerty real-time",
      "Analiza konkurencji",
      "KFS + BUR",
    ],
  },
  enterprise: {
    name: "Enterprise",
    price: 179900, // 1799 PLN
    priceId: process.env.STRIPE_ENTERPRISE_PRICE_ID ?? "",
    features: [
      "Wszystko z Pro",
      "API access",
      "Webhook",
      "Dedicated AM",
      "SLA 99.9%",
    ],
  },
} as const;

export type PlanKey = keyof typeof PLANS;
