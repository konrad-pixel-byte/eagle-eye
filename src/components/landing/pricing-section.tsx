import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

const tiers = [
  {
    name: "Free",
    description: "Na start — sprawdź wartość Eagle Eye",
    price: "0",
    period: "na zawsze",
    cta: "Rozpocznij za darmo",
    href: "/auth/signup",
    highlighted: false,
    features: [
      "10 przetargów/dzień (nagłówki)",
      "Akademia ZP — Moduł 1-2",
      "Alerty email 1x/dziennie",
      "Podstawowe filtry CPV",
    ],
  },
  {
    name: "Basic",
    description: "Dla firm startujących w przetargach",
    price: "299",
    period: "/miesiąc",
    cta: "Wypróbuj 14 dni za darmo",
    href: "/auth/signup?plan=basic",
    highlighted: false,
    features: [
      "Nieograniczone przetargi",
      "Pełne detale + SWZ",
      "Alerty 2x/dziennie (email + push)",
      "Filtry CPV / region / budżet",
      "Zapisywanie przetargów",
      "Kalkulator ofert (basic)",
      "Akademia ZP kompletna + certyfikat",
      "1 użytkownik",
    ],
  },
  {
    name: "Pro",
    description: "Dla firm wygrywających 2-5 przetargów/mies.",
    price: "599",
    period: "/miesiąc",
    cta: "Wypróbuj 14 dni za darmo",
    href: "/auth/signup?plan=pro",
    highlighted: true,
    badge: "Najpopularniejszy",
    features: [
      "Wszystko z Basic +",
      "AI Bid Coach (sugestie, benchmarki)",
      "Alerty real-time (push w 30 min)",
      "Wyniki przetargów (kto wygrał, za ile)",
      "Kalkulator zaawansowany",
      "Analiza konkurencji",
      "Monitoring KFS + BUR",
      "Strefa Firm Premium",
      "Do 3 użytkowników",
    ],
  },
  {
    name: "Enterprise",
    description: "Dla zespołów 5+ osób i dużych firm",
    price: "1 799",
    period: "/miesiąc",
    cta: "Skontaktuj się",
    href: "#kontakt",
    highlighted: false,
    features: [
      "Wszystko z Pro +",
      "Nieograniczona liczba użytkowników",
      "API access + webhook",
      "SMS alerty",
      "Advanced analytics + raporty",
      "Dedicated Account Manager",
      "Onboarding 1:1",
      "SLA 99.9%",
    ],
  },
];

export function PricingSection() {
  return (
    <section
      id="cennik"
      className="border-y border-border/40 bg-muted/30 py-16 sm:py-24"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Prosta cena. Ogromna wartość.
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            249 PLN to koszt 2.5 godzin pracy specjalisty. Jeden wygrany
            przetarg = 100 000+ PLN. ROI: 1 800%.
          </p>
        </div>

        <div className="mx-auto mt-12 grid max-w-5xl gap-6 lg:grid-cols-4">
          {tiers.map((tier) => (
            <div
              key={tier.name}
              className={cn(
                "relative flex flex-col rounded-xl border p-6 transition-all",
                tier.highlighted
                  ? "border-[#0EA5E9] bg-card shadow-lg shadow-[#0EA5E9]/10"
                  : "border-border/50 bg-card hover:border-border"
              )}
            >
              {tier.badge && (
                <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#0EA5E9] text-white hover:bg-[#0EA5E9]">
                  {tier.badge}
                </Badge>
              )}

              <div>
                <h3 className="text-lg font-semibold">{tier.name}</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  {tier.description}
                </p>
              </div>

              <div className="mt-4 flex items-baseline">
                <span className="text-3xl font-bold tracking-tight">
                  {tier.price}
                </span>
                <span className="ml-1 text-sm text-muted-foreground">
                  PLN{tier.period}
                </span>
              </div>

              <Link
                href={tier.href}
                className={cn(
                  buttonVariants({
                    variant: tier.highlighted ? "default" : "outline",
                  }),
                  "mt-6 w-full",
                  tier.highlighted &&
                    "bg-[#0EA5E9] text-white hover:bg-[#0EA5E9]/90"
                )}
              >
                {tier.cta}
              </Link>

              <ul className="mt-6 flex-1 space-y-3">
                {tier.features.map((feature) => (
                  <li
                    key={feature}
                    className="flex items-start gap-2 text-sm text-muted-foreground"
                  >
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-[#10B981]" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
