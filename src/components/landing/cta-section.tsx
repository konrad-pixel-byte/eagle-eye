"use client";

import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";

export function CTASection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section className="border-t border-zinc-800/60 py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-6">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ type: "spring", stiffness: 60, damping: 20 }}
          className="relative overflow-hidden rounded-2xl border border-zinc-800/60 bg-zinc-900/40 px-8 py-16 md:px-16 md:py-20"
        >
          {/* Subtle accent glow — not blob slop, just a thin line */}
          <div className="absolute top-0 left-1/4 right-1/4 h-px bg-gradient-to-r from-transparent via-[#0EA5E9]/30 to-transparent" />
          <div className="pointer-events-none absolute inset-0 rounded-2xl shadow-[inset_0_1px_0_rgba(255,255,255,0.03)]" />

          <div className="relative grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
            <div>
              <h2 className="text-2xl font-bold tracking-tighter text-zinc-200 md:text-4xl">
                Przestaniesz tracic czas
                <br />
                <span className="text-zinc-500">na reczne szukanie.</span>
              </h2>
              <p className="mt-4 max-w-[48ch] text-sm leading-relaxed text-zinc-500">
                Przecietny uzytkownik Pro oszczedza 12 godzin tygodniowo.
                624 godziny rocznie. To 3.5 etatu, ktore mozesz przeznaczyc
                na skladanie ofert zamiast ich szukania.
              </p>
            </div>

            <div className="flex flex-col items-start gap-3 lg:items-end">
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
              <p className="text-xs text-zinc-600">
                Bez karty kredytowej. 30 dni pelnego dostepu.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
