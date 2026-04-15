"use client";

import Link from "next/link";
import { Eye } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function DashboardError({ error, reset }: ErrorProps) {
  return (
    <div className="flex min-h-[100dvh] flex-col items-center justify-center px-6">
      <Eye className="mb-6 h-10 w-10 text-zinc-700" strokeWidth={1.5} />

      <h1 className="mt-3 text-2xl font-bold tracking-tighter text-white md:text-3xl">
        Wystąpił błąd
      </h1>

      {error.message && (
        <p className="mt-2 max-w-[48ch] text-center font-mono text-xs text-zinc-500">
          {error.message}
        </p>
      )}

      <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row">
        <button
          onClick={reset}
          className="inline-flex items-center justify-center rounded-md bg-zinc-100 px-6 py-3 text-sm font-medium text-zinc-950 transition-all hover:bg-white active:scale-[0.98]"
        >
          Spróbuj ponownie
        </button>

        <Link
          href="/"
          className={cn(
            buttonVariants({ variant: "ghost" }),
            "text-zinc-400 hover:text-zinc-100"
          )}
        >
          Wróć do strony głównej
        </Link>
      </div>
    </div>
  );
}
