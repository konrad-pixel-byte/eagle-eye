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

const features = [
  {
    icon: Search,
    title: "Monitoring 24/7",
    description:
      "Automatyczny monitoring BZP, TED i Bazy Konkurencyjności. Nowe przetargi szkoleniowe trafiają do Ciebie w ciągu minut.",
  },
  {
    icon: Brain,
    title: "AI Bid Coach",
    description:
      "Sztuczna inteligencja analizuje SWZ i podpowiada jak przygotować zwycięską ofertę. Benchmarki cenowe, scoring szans.",
  },
  {
    icon: Bell,
    title: "Inteligentne alerty",
    description:
      "Spersonalizowane powiadomienia o przetargach dopasowanych do Twojego profilu — email, push, SMS.",
  },
  {
    icon: Calculator,
    title: "Kalkulator ofert",
    description:
      "Dedykowany kalkulator dla branży szkoleniowej: osobodzień, stawka trenera, materiały, catering, marża.",
  },
  {
    icon: Map,
    title: "Monitoring KFS i BUR",
    description:
      "Jedyne narzędzie łączące przetargi + nabory KFS z 340 PUP-ów + nabory BUR od 40 operatorów PSF.",
  },
  {
    icon: GraduationCap,
    title: "Akademia ZP",
    description:
      "Bezpłatny kurs zamówień publicznych z certyfikatem. Od podstaw PZP po zaawansowane strategie wygrywania.",
  },
  {
    icon: Shield,
    title: "Analiza konkurencji",
    description:
      "Kto wygrywa przetargi w Twoim regionie? Za ile? Ile ofert było? Śledź konkurentów i ucz się od najlepszych.",
  },
  {
    icon: Zap,
    title: "Silicon Valley UX",
    description:
      "Nowoczesny design inspirowany Linear i Vercel. Dark mode, Command Palette (⌘K), skróty klawiszowe.",
  },
];

export function FeaturesSection() {
  return (
    <section id="funkcje" className="py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#F59E0B]/20 bg-[#F59E0B]/10 px-4 py-1.5 text-sm font-medium text-[#F59E0B]">
            Funkcje
          </div>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Wszystko, czego potrzebujesz do wygrywania
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Nie tylko monitoring — pełny arsenał narzędzi dla firm szkoleniowych
            walczących o przetargi publiczne.
          </p>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="group relative rounded-xl border border-border/50 bg-card p-6 transition-all hover:border-[#0EA5E9]/30 hover:shadow-lg hover:shadow-[#0EA5E9]/5"
            >
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-lg bg-[#0EA5E9]/10 text-[#0EA5E9] transition-colors group-hover:bg-[#0EA5E9]/20">
                <feature.icon className="h-5 w-5" />
              </div>
              <h3 className="text-base font-semibold">{feature.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
