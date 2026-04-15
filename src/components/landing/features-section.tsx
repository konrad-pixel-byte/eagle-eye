"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import {
  Bell,
  Brain,
  Calculator,
  GraduationCap,
  Map,
  Search,
  Shield,
  Zap,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface Feature {
  icon: LucideIcon;
  title: string;
  description: string;
  span: string; // grid span class
}

const features: Feature[] = [
  {
    icon: Search,
    title: "Monitoring 24/7",
    description:
      "BZP, TED, Baza Konkurencyjności. Nowe przetargi szkoleniowe w minuty od publikacji. Zero ręcznego przeglądania.",
    span: "md:col-span-2 md:row-span-2",
  },
  {
    icon: Brain,
    title: "AI Bid Coach",
    description:
      "Analiza SWZ, benchmarki cenowe, scoring szans na wygranie. Coaching ofertowy, nie tylko dane.",
    span: "md:col-span-1",
  },
  {
    icon: Bell,
    title: "Alerty dopasowane do profilu",
    description:
      "Email, push, SMS — co chcesz, kiedy chcesz. Spersonalizowane pod Twoje CPV i regiony.",
    span: "md:col-span-1",
  },
  {
    icon: Map,
    title: "KFS + BUR w jednym",
    description:
      "Jedyne narzędzie łączące przetargi + nabory KFS z 340 PUP-ów + nabory BUR od 40 operatorów PSF. Pełen obraz finansowania.",
    span: "md:col-span-2",
  },
  {
    icon: Calculator,
    title: "Kalkulator ofert szkoleniowych",
    description:
      "Osobodzień, stawka trenera, materiały, catering, marża. Porównanie z historycznymi zwycięskimi cenami.",
    span: "md:col-span-1",
  },
  {
    icon: GraduationCap,
    title: "Akademia ZP",
    description:
      "Darmowy kurs z certyfikatem. Od podstaw PZP po strategię wygrywania przetargów.",
    span: "md:col-span-1",
  },
  {
    icon: Shield,
    title: "Analiza konkurencji",
    description:
      "Kto wygrywa w Twoim regionie, za ile, ile ofert było. Watch list na konkurentów.",
    span: "md:col-span-1",
  },
  {
    icon: Zap,
    title: "Cmd+K i skróty klawiszowe",
    description:
      "Command palette, keyboard-first navigation. Zbudowane dla ludzi, którzy pracują szybko.",
    span: "md:col-span-1",
  },
];

function FeatureTile({ feature, index }: { feature: Feature; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });

  const isLarge = feature.span.includes("row-span-2");

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{
        type: "spring",
        stiffness: 80,
        damping: 20,
        delay: index * 0.05,
      }}
      className={`group relative rounded-2xl border border-zinc-800/60 bg-zinc-900/40 p-6 transition-colors hover:border-zinc-700/80 hover:bg-zinc-900/60 ${feature.span}`}
    >
      {/* Inner refraction border — liquid glass */}
      <div className="pointer-events-none absolute inset-0 rounded-2xl border border-white/[0.03] shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]" />

      <div className="relative">
        <feature.icon
          className="h-5 w-5 text-zinc-500 transition-colors group-hover:text-[#0EA5E9]"
          strokeWidth={1.5}
        />

        <h3 className={`mt-4 font-semibold tracking-tight text-zinc-200 ${isLarge ? "text-lg" : "text-sm"}`}>
          {feature.title}
        </h3>

        <p className={`mt-2 leading-relaxed text-zinc-500 ${isLarge ? "text-sm max-w-[50ch]" : "text-xs"}`}>
          {feature.description}
        </p>
      </div>
    </motion.div>
  );
}

export function FeaturesSection() {
  return (
    <section id="funkcje" className="border-t border-zinc-800/60 py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-12 max-w-md">
          <p className="font-mono text-xs uppercase tracking-widest text-zinc-600">
            Funkcje
          </p>
          <h2 className="mt-2 text-2xl font-bold tracking-tighter text-zinc-200 md:text-3xl">
            Nie tylko monitoring.
            <br />
            <span className="text-zinc-500">Pełny arsenał.</span>
          </h2>
        </div>

        {/* Bento grid — asymmetric, not 4-equal-columns */}
        <div className="grid gap-3 md:grid-cols-4 md:auto-rows-[minmax(140px,auto)]">
          {features.map((feature, i) => (
            <FeatureTile key={feature.title} feature={feature} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
