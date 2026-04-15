"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const stats = [
  { value: "4 mld PLN", label: "Roczny rynek szkoleń publicznych", source: "PARP" },
  { value: "7 mld PLN", label: "Fundusze UE na szkolenia do 2027", source: "MFiPR" },
  { value: "60 000", label: "Firm szkoleniowych w Polsce", source: "GUS" },
  { value: "15-25", label: "Nowych przetargów szkoleniowych dziennie", source: "BZP" },
  { value: "150K PLN", label: "Średnia wartość przetargu", source: "BZP" },
  { value: "~2.3", label: "Ofert na przetarg — niska konkurencja", source: "UZP" },
  { value: "80-90%", label: "Finansowane z funduszy publicznych", source: "MFiPR" },
  { value: "12h/tydz", label: "Oszczędzasz dzięki automatyzacji", source: "Kalkulacja" },
];

function StatItem({ stat, index }: { stat: typeof stats[number]; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-40px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ type: "spring", stiffness: 80, damping: 20, delay: index * 0.06 }}
      className="group relative border-l border-zinc-800 pl-4"
    >
      <span className="font-mono text-3xl font-bold tracking-tight text-white md:text-4xl">
        {stat.value}
      </span>
      <p className="mt-1.5 text-sm leading-snug text-zinc-400">{stat.label}</p>
      <p className="mt-1 font-mono text-[10px] uppercase tracking-widest text-zinc-600">
        {stat.source}
      </p>
    </motion.div>
  );
}

export function StatsSection() {
  return (
    <section className="border-t border-zinc-800/60 py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-12 max-w-md">
          <p className="font-mono text-xs uppercase tracking-widest text-zinc-600">
            Twarde dane
          </p>
          <h2 className="mt-2 text-2xl font-bold tracking-tighter text-zinc-200 md:text-3xl">
            Rynek, który nie blefuje.
          </h2>
        </div>

        {/* 2-column asymmetric grid, not 4x2 cards */}
        <div className="grid gap-x-16 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, i) => (
            <StatItem key={stat.label} stat={stat} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
