"use client";

import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

function LivePulse() {
  return (
    <span className="relative mr-2 flex h-2 w-2">
      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
      <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
    </span>
  );
}

function FloatingTenderCard() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40, rotateX: 8 }}
      animate={{ opacity: 1, y: 0, rotateX: 0 }}
      transition={{ type: "spring", stiffness: 80, damping: 20, delay: 0.4 }}
      className="relative w-full max-w-md"
    >
      {/* Main card — glass panel */}
      <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-5 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.3)] backdrop-blur-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-zinc-500">
            <LivePulse />
            <span className="font-mono">BZP-2026/S 078-214391</span>
          </div>
          <span className="rounded-md bg-emerald-500/10 px-2 py-0.5 font-mono text-[11px] font-medium text-emerald-400">
            AI 94/100
          </span>
        </div>

        <h3 className="mt-3 text-sm font-medium leading-snug text-zinc-200">
          Przeprowadzenie szkolen z zakresu kompetencji cyfrowych
          dla pracownikow JST woj. malopolskiego
        </h3>

        <div className="mt-3 grid grid-cols-3 gap-3">
          <div>
            <span className="text-[10px] uppercase tracking-wider text-zinc-600">Budzet</span>
            <p className="font-mono text-sm font-medium text-zinc-300">847 200 PLN</p>
          </div>
          <div>
            <span className="text-[10px] uppercase tracking-wider text-zinc-600">Region</span>
            <p className="text-sm text-zinc-300">Malopolskie</p>
          </div>
          <div>
            <span className="text-[10px] uppercase tracking-wider text-zinc-600">Termin</span>
            <p className="font-mono text-sm text-zinc-300">28.04.2026</p>
          </div>
        </div>
      </div>

      {/* Stacked cards behind — depth illusion */}
      <div className="absolute -bottom-2 left-3 right-3 -z-10 h-8 rounded-2xl border border-white/[0.04] bg-white/[0.015]" />
      <div className="absolute -bottom-4 left-6 right-6 -z-20 h-8 rounded-2xl border border-white/[0.02] bg-white/[0.008]" />
    </motion.div>
  );
}

export function HeroSection() {
  return (
    <section className="relative min-h-[100dvh] overflow-hidden">
      {/* Subtle grid background */}
      <div
        className="pointer-events-none fixed inset-0 -z-10 opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      {/* Content — asymmetric split */}
      <div className="mx-auto grid max-w-7xl gap-12 px-6 pt-32 pb-20 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:gap-16 lg:pt-40 lg:pb-32">
        {/* Left — copy */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ type: "spring", stiffness: 60, damping: 20 }}
        >
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-zinc-800 bg-zinc-900/80 px-3 py-1 text-xs font-medium text-zinc-400">
            <LivePulse />
            17 nowych przetargow dzisiaj
          </div>

          <h1 className="text-4xl font-bold tracking-tighter leading-none text-zinc-100 md:text-6xl">
            Przestaniesz szukac.
            <br />
            <span className="text-zinc-500">Zaczniesz wygrywac.</span>
          </h1>

          <p className="mt-6 max-w-[52ch] text-base leading-relaxed text-zinc-500">
            Eagle Eye monitoruje BZP, TED i Baze Konkurencyjnosci 24/7.
            Gdy pojawia sie przetarg szkoleniowy dopasowany do Twojego profilu
            — wiesz o nim w minuty, nie w dni.
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-3">
            <Link
              href="/auth/signup"
              className={cn(
                buttonVariants({ size: "lg" }),
                "bg-zinc-100 text-zinc-950 hover:bg-white active:scale-[0.98] transition-all"
              )}
            >
              Zacznij za darmo
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
            <Link
              href="#cennik"
              className={cn(
                buttonVariants({ variant: "ghost", size: "lg" }),
                "text-zinc-400 hover:text-zinc-200"
              )}
            >
              Zobacz cennik
            </Link>
          </div>

          {/* Social proof — not generic */}
          <div className="mt-10 flex items-center gap-6 border-t border-zinc-800/60 pt-6">
            <div>
              <p className="font-mono text-2xl font-bold tracking-tight text-zinc-200">4 mld</p>
              <p className="text-xs text-zinc-600">PLN rocznie w przetargach szkoleniowych</p>
            </div>
            <div className="h-8 w-px bg-zinc-800" />
            <div>
              <p className="font-mono text-2xl font-bold tracking-tight text-zinc-200">~2.3</p>
              <p className="text-xs text-zinc-600">oferty na przetarg — Twoja szansa to 43%</p>
            </div>
            <div className="hidden h-8 w-px bg-zinc-800 sm:block" />
            <div className="hidden sm:block">
              <p className="font-mono text-2xl font-bold tracking-tight text-zinc-200">12h</p>
              <p className="text-xs text-zinc-600">oszczedzasz tygodniowo</p>
            </div>
          </div>
        </motion.div>

        {/* Right — floating tender card */}
        <div className="hidden lg:flex lg:justify-end">
          <FloatingTenderCard />
        </div>
      </div>
    </section>
  );
}
