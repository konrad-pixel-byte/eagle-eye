"use client";

import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { Check, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";

interface Tier {
  name: string;
  audience: string;
  price: string;
  period: string;
  cta: string;
  href: string;
  highlighted: boolean;
  features: string[];
}

const tiers: Tier[] = [
  {
    name: "Free",
    audience: "Na rozpoznanie rynku",
    price: "0",
    period: "na zawsze",
    cta: "Rozpocznij",
    href: "/auth/signup",
    highlighted: false,
    features: [
      "10 przetargów dziennie (nagłówki)",
      "Akademia ZP — Moduł 1-2",
      "Alerty email 1x/dziennie",
      "Podstawowe filtry CPV",
    ],
  },
  {
    name: "Basic",
    audience: "Dla firm startujących w przetargach",
    price: "299",
    period: "/mies.",
    cta: "14 dni za darmo",
    href: "/auth/signup?plan=basic",
    highlighted: false,
    features: [
      "Nieograniczone przetargi + pełne detale",
      "Alerty 2x/dziennie (email + push)",
      "Filtry CPV / region / budżet",
      "Kalkulator ofert",
      "Akademia ZP + certyfikat",
      "1 użytkownik",
    ],
  },
  {
    name: "Pro",
    audience: "Dla firm wygrywających 2-5 przetargów/mies.",
    price: "599",
    period: "/mies.",
    cta: "14 dni za darmo",
    href: "/auth/signup?plan=pro",
    highlighted: true,
    features: [
      "Wszystko z Basic",
      "AI Bid Coach — sugestie + benchmarki",
      "Alerty real-time (push w 30 min)",
      "Wyniki przetargów (kto wygrał, za ile)",
      "Analiza konkurencji",
      "Monitoring KFS + BUR",
      "Do 3 użytkowników",
    ],
  },
  {
    name: "Enterprise",
    audience: "Zespoły 5+ osób, duże organizacje",
    price: "1 799",
    period: "/mies.",
    cta: "Porozmawiajmy",
    href: "#kontakt",
    highlighted: false,
    features: [
      "Wszystko z Pro",
      "Nieograniczeni użytkownicy",
      "API + webhook + SMS",
      "Advanced analytics",
      "Dedicated Account Manager",
      "SLA 99.9%",
    ],
  },
];

function PricingCard({ tier, index }: { tier: Tier; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-40px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{
        type: "spring",
        stiffness: 80,
        damping: 20,
        delay: index * 0.08,
      }}
      className={cn(
        "relative flex flex-col rounded-2xl p-6 transition-colors",
        tier.highlighted
          ? "border border-zinc-100/10 bg-zinc-100/[0.04] shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]"
          : "border border-zinc-800/40"
      )}
    >
      {tier.highlighted && (
        <div className="absolute -top-px left-8 right-8 h-px bg-gradient-to-r from-transparent via-[#0EA5E9]/50 to-transparent" />
      )}

      <div>
        <p className="font-mono text-xs uppercase tracking-widest text-zinc-600">
          {tier.name}
        </p>
        <p className="mt-1 text-xs text-zinc-500">{tier.audience}</p>
      </div>

      <div className="mt-4 flex items-baseline gap-1">
        <span className="font-mono text-3xl font-bold tracking-tight text-zinc-100">
          {tier.price}
        </span>
        <span className="text-sm text-zinc-600">
          PLN{tier.period}
        </span>
      </div>

      <Link
        href={tier.href}
        className={cn(
          buttonVariants({
            variant: tier.highlighted ? "default" : "outline",
            size: "default",
          }),
          "mt-5 w-full active:scale-[0.98] transition-all",
          tier.highlighted
            ? "bg-zinc-100 text-zinc-950 hover:bg-white"
            : "border-zinc-800 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200"
        )}
      >
        {tier.cta}
        {tier.highlighted && <ArrowRight className="ml-2 h-3.5 w-3.5" />}
      </Link>

      <ul className="mt-6 flex-1 space-y-2.5 border-t border-zinc-800/40 pt-6">
        {tier.features.map((feature) => (
          <li
            key={feature}
            className="flex items-start gap-2.5 text-sm text-zinc-500"
          >
            <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-zinc-600" strokeWidth={2} />
            <span>{feature}</span>
          </li>
        ))}
      </ul>
    </motion.div>
  );
}

export function PricingSection() {
  return (
    <section id="cennik" className="border-t border-zinc-800/60 py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-12 grid gap-4 lg:grid-cols-[1fr_1fr] lg:items-end">
          <div>
            <p className="font-mono text-xs uppercase tracking-widest text-zinc-600">
              Cennik
            </p>
            <h2 className="mt-2 text-2xl font-bold tracking-tighter text-zinc-200 md:text-3xl">
              299 PLN to koszt 2.5h pracy specjalisty.
            </h2>
          </div>
          <p className="max-w-[50ch] text-sm leading-relaxed text-zinc-500 lg:text-right">
            Jeden wygrany przetarg = 100 000+ PLN.
            30 dni pełnego dostępu. Nie spodobało się? Zwrot bez pytań.
          </p>
        </div>

        {/* Grid: 4 columns on desktop, with Pro visually elevated */}
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {tiers.map((tier, i) => (
            <PricingCard key={tier.name} tier={tier} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
