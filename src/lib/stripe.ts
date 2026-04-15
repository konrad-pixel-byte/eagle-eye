import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2026-03-25.dahlia",
  typescript: true,
});

export const PLANS = {
  basic: {
    name: "Basic",
    price: 29900, // 299 PLN in grosze
    priceId: process.env.STRIPE_BASIC_PRICE_ID!,
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
    priceId: process.env.STRIPE_PRO_PRICE_ID!,
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
    priceId: process.env.STRIPE_ENTERPRISE_PRICE_ID!,
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
