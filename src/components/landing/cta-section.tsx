import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

export function CTASection() {
  return (
    <section className="py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#0EA5E9] to-[#0284C7] p-8 sm:p-12 lg:p-16">
          {/* Decorative elements */}
          <div className="absolute right-0 top-0 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute bottom-0 left-0 h-48 w-48 rounded-full bg-[#F59E0B]/20 blur-3xl" />

          <div className="relative mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Przestań tracić czas na ręczne szukanie.
            </h2>
            <p className="mt-4 text-lg text-white/80">
              Średnio użytkownik Pro oszczędza 12 godzin tygodniowo i zwiększa
              przychody z przetargów o 35% w ciągu 3 miesięcy.
            </p>

            <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <Link
                href="/auth/signup"
                className={cn(
                  buttonVariants({ size: "lg" }),
                  "bg-white text-[#0EA5E9] hover:bg-white/90"
                )}
              >
                Rozpocznij za darmo
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </div>

            <p className="mt-4 text-sm text-white/60">
              Bez karty kredytowej. 30 dni pełnego dostępu.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
