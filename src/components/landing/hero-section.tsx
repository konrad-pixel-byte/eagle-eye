import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden pt-24 pb-16 sm:pt-32 sm:pb-24">
      {/* Gradient background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-0 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-[#0EA5E9]/10 blur-3xl" />
        <div className="absolute right-1/4 top-1/3 h-[400px] w-[400px] rounded-full bg-[#F59E0B]/5 blur-3xl" />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          {/* Badge */}
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#0EA5E9]/20 bg-[#0EA5E9]/10 px-4 py-1.5 text-sm font-medium text-[#0EA5E9]">
            <Sparkles className="h-4 w-4" />
            <span>Jedyna platforma AI dla przetargów szkoleniowych</span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
            Wygrywaj więcej przetargów.{" "}
            <span className="bg-gradient-to-r from-[#0EA5E9] to-[#06B6D4] bg-clip-text text-transparent">
              5 minut dziennie
            </span>{" "}
            zamiast 40 godzin miesięcznie.
          </h1>

          {/* Subheadline — Hormozi Value Equation */}
          <p className="mt-6 text-lg leading-8 text-muted-foreground sm:text-xl">
            AI znajduje najlepsze okazje przetargowe — Ty składasz zwycięskie
            oferty. Monitoring BZP, TED i Bazy Konkurencyjności + finansowanie
            KFS i BUR w jednym miejscu.
          </p>

          {/* CTA buttons */}
          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link
              href="/auth/signup"
              className={cn(
                buttonVariants({ size: "lg" }),
                "w-full bg-[#0EA5E9] text-white hover:bg-[#0EA5E9]/90 sm:w-auto"
              )}
            >
              Rozpocznij za darmo
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
            <Link
              href="#cennik"
              className={cn(
                buttonVariants({ variant: "outline", size: "lg" }),
                "w-full sm:w-auto"
              )}
            >
              Zobacz cennik
            </Link>
          </div>

          {/* Trust line */}
          <p className="mt-6 text-sm text-muted-foreground">
            30 dni pełnego dostępu. Nie spodobało się? Zwrot bez pytań.
          </p>
        </div>
      </div>
    </section>
  );
}
