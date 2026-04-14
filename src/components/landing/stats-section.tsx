import {
  Banknote,
  Building2,
  Clock,
  FileText,
  PiggyBank,
  Target,
  TrendingUp,
  Users,
} from "lucide-react";

const stats = [
  {
    value: "4 mld PLN",
    label: "Roczny rynek usług szkoleniowych",
    icon: Banknote,
    source: "PARP",
  },
  {
    value: "7 mld PLN",
    label: "Funduszy UE na szkolenia do 2027",
    icon: PiggyBank,
    source: "MFiPR",
  },
  {
    value: "80-90%",
    label: "Szkolenia finansowane z funduszy publicznych",
    icon: TrendingUp,
    source: "MFiPR",
  },
  {
    value: "60 000",
    label: "Firm szkoleniowych w Polsce",
    icon: Building2,
    source: "GUS/REGON",
  },
  {
    value: "15-25",
    label: "Nowych przetargów szkoleniowych dziennie",
    icon: FileText,
    source: "BZP",
  },
  {
    value: "~2.3",
    label: "Średnio ofert na przetarg — Twoja szansa to 43%",
    icon: Target,
    source: "UZP",
  },
  {
    value: "150K PLN",
    label: "Średnia wartość przetargu szkoleniowego",
    icon: Users,
    source: "BZP",
  },
  {
    value: "12h/tyg",
    label: "Oszczędzasz dzięki automatyzacji",
    icon: Clock,
    source: "Kalkulacja",
  },
];

export function StatsSection() {
  return (
    <section className="border-y border-border/40 bg-muted/30 py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Rynek, który czeka na Ciebie
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Twarde dane, nie obietnice. Oto dlaczego przetargi szkoleniowe to
            Twoja szansa.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="group relative rounded-xl border border-border/50 bg-card p-5 transition-all hover:border-[#0EA5E9]/30 hover:shadow-lg hover:shadow-[#0EA5E9]/5"
            >
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-[#0EA5E9]/10 text-[#0EA5E9] transition-colors group-hover:bg-[#0EA5E9]/20">
                <stat.icon className="h-5 w-5" />
              </div>
              <p className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                {stat.value}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">{stat.label}</p>
              <p className="mt-2 text-xs text-muted-foreground/60">
                Źródło: {stat.source}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
