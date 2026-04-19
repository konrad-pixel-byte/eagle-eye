import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { Compass, ArrowLeft, Search } from "lucide-react";
import { cn } from "@/lib/utils";

export default function NotFound() {
  return (
    <div className="flex min-h-[100dvh] flex-col items-center justify-center px-6 text-center">
      <div className="mb-6 flex size-14 items-center justify-center rounded-full bg-sky-500/10">
        <Compass className="size-7 text-sky-400" strokeWidth={1.75} />
      </div>

      <p className="font-mono text-xs uppercase tracking-wider text-zinc-600">
        404
      </p>
      <h1 className="mt-1 text-2xl font-bold tracking-tight text-white md:text-3xl">
        Strona nie istnieje
      </h1>

      <p className="mt-2 max-w-[44ch] text-sm text-zinc-500">
        Nie znaleźliśmy tego, czego szukasz. Być może przetarg został usunięty
        albo link jest nieaktualny.
      </p>

      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <Link
          href="/dashboard/przetargi"
          className={cn(
            buttonVariants({ size: "lg" }),
            "bg-zinc-100 text-zinc-950 hover:bg-white active:scale-[0.98]"
          )}
        >
          <Search className="size-4" />
          Przeglądaj przetargi
        </Link>
        <Link
          href="/"
          className={cn(
            buttonVariants({ variant: "outline", size: "lg" }),
            "border-zinc-800 text-zinc-300 hover:bg-zinc-900"
          )}
        >
          <ArrowLeft className="size-4" />
          Strona główna
        </Link>
      </div>
    </div>
  );
}
