import { redirect } from "next/navigation"
import Link from "next/link"
import { CreditCard, CheckCircle2, AlertCircle } from "lucide-react"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button, buttonVariants } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/server"
import { getTierLabel, type SubscriptionTier } from "@/lib/subscription"
import { PLANS } from "@/lib/stripe"
import { BillingPortalButton } from "./billing-portal-button"

interface BillingProfile {
  subscription_tier: SubscriptionTier
  subscription_status: string | null
  stripe_customer_id: string | null
  subscription_period_end: string | null
  trial_ends_at: string | null
}

function formatDate(iso: string | null): string {
  if (!iso) return "—"
  return new Date(iso).toLocaleDateString("pl-PL", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  })
}

function StatusBadge({ status }: { status: string | null }) {
  const config: Record<string, { label: string; className: string }> = {
    active: { label: "Aktywna", className: "bg-emerald-500/15 text-emerald-400 border-emerald-500/20" },
    trialing: { label: "Trial", className: "bg-sky-500/15 text-sky-400 border-sky-500/20" },
    past_due: { label: "Zaległa", className: "bg-red-500/15 text-red-400 border-red-500/20" },
    canceled: { label: "Anulowana", className: "bg-muted text-muted-foreground border-border" },
    incomplete: { label: "Niekompletna", className: "bg-amber-500/15 text-amber-400 border-amber-500/20" },
  }
  const key = status ?? "free"
  const entry = config[key] ?? { label: "Brak", className: "bg-muted text-muted-foreground border-border" }
  return <Badge className={`border text-sm px-3 h-7 ${entry.className}`}>{entry.label}</Badge>
}

export default async function BillingPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/auth/login")

  const { data: profile } = await supabase
    .from("profiles")
    .select("subscription_tier, subscription_status, stripe_customer_id, subscription_period_end, trial_ends_at")
    .eq("id", user.id)
    .single<BillingProfile>()

  const tier: SubscriptionTier = profile?.subscription_tier ?? "free"
  const status = profile?.subscription_status ?? null
  const hasStripeCustomer = Boolean(profile?.stripe_customer_id)
  const isPaidTier = tier !== "free"
  const planPrice =
    tier === "basic" || tier === "pro" || tier === "enterprise"
      ? PLANS[tier].price
      : null

  const pastDue = status === "past_due"

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-3">
        <CreditCard className="size-6 text-sky-500" />
        <h1 className="text-2xl font-semibold tracking-tight">Rozliczenia</h1>
      </div>

      {pastDue && (
        <div className="flex items-start gap-3 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3">
          <AlertCircle className="size-5 text-red-400 shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm font-medium text-red-300">Płatność nie powiodła się</p>
            <p className="text-xs text-red-300/80 mt-0.5">
              Zaktualizuj metodę płatności, aby uniknąć utraty dostępu do płatnych funkcji.
            </p>
          </div>
        </div>
      )}

      <Card>
        <CardHeader>
          <div className="flex items-start justify-between gap-4">
            <div>
              <CardTitle className="text-xl">Plan {getTierLabel(tier)}</CardTitle>
              <CardDescription className="mt-1">
                {isPaidTier
                  ? "Zarządzaj swoją subskrypcją w portalu Stripe"
                  : "Przejdź na płatny plan, aby odblokować wszystkie funkcje"}
              </CardDescription>
            </div>
            <StatusBadge status={isPaidTier ? status : null} />
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {planPrice !== null && (
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-bold">
                {(planPrice / 100).toLocaleString("pl-PL", {
                  style: "currency",
                  currency: "PLN",
                  maximumFractionDigits: 0,
                })}
              </span>
              <span className="text-sm text-muted-foreground">/ miesiąc</span>
            </div>
          )}

          {isPaidTier && (
            <div className="grid grid-cols-1 gap-3 border-t border-border pt-4 sm:grid-cols-2">
              {profile?.subscription_period_end && (
                <div>
                  <p className="text-xs text-muted-foreground mb-1">
                    {status === "canceled" ? "Dostęp do" : "Następne rozliczenie"}
                  </p>
                  <p className="text-sm font-medium">
                    {formatDate(profile.subscription_period_end)}
                  </p>
                </div>
              )}
              {profile?.trial_ends_at && (
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Trial do</p>
                  <p className="text-sm font-medium">
                    {formatDate(profile.trial_ends_at)}
                  </p>
                </div>
              )}
            </div>
          )}

          <div className="flex flex-wrap gap-2 pt-2">
            {hasStripeCustomer ? (
              <BillingPortalButton />
            ) : (
              <Link
                href="/#pricing"
                className={buttonVariants({ variant: "default" })}
              >
                Wybierz plan
              </Link>
            )}
            {isPaidTier && tier !== "enterprise" && (
              <Link
                href="/#pricing"
                className={buttonVariants({ variant: "outline" })}
              >
                Zmień plan
              </Link>
            )}
          </div>
        </CardContent>
      </Card>

      {isPaidTier && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Portal Stripe pozwala</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              {[
                "Zaktualizować kartę płatniczą",
                "Pobrać faktury VAT",
                "Zmienić plan subskrypcji",
                "Anulować subskrypcję jednym kliknięciem",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <CheckCircle2 className="size-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {!isPaidTier && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Dlaczego warto przejść na plan płatny?</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p className="flex items-start gap-2">
              <CheckCircle2 className="size-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>Nieograniczona liczba zapisywanych przetargów</span>
            </p>
            <p className="flex items-start gap-2">
              <CheckCircle2 className="size-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>AI scoring i streszczenia dostępne na żądanie</span>
            </p>
            <p className="flex items-start gap-2">
              <CheckCircle2 className="size-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>Alerty email o nowych przetargach</span>
            </p>
            <p className="flex items-start gap-2">
              <CheckCircle2 className="size-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>14 dni trialu — bez karty</span>
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
