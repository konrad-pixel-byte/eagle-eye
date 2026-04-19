"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, Home, RotateCw } from "lucide-react";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error("[app-error]", error);
  }, [error]);

  return (
    <div className="flex min-h-[100dvh] flex-col items-center justify-center px-6 text-center">
      <div className="mb-6 flex size-14 items-center justify-center rounded-full bg-red-500/10">
        <AlertTriangle className="size-7 text-red-400" strokeWidth={1.75} />
      </div>

      <h1 className="text-2xl font-bold tracking-tight text-white md:text-3xl">
        Coś poszło nie tak
      </h1>

      <p className="mt-2 max-w-[44ch] text-sm text-zinc-500">
        Przepraszamy, po naszej stronie wystąpił błąd. Spróbuj jeszcze raz —
        jeżeli problem wróci, daj nam znać.
      </p>

      {error.digest && (
        <p className="mt-3 font-mono text-xs text-zinc-600">
          ID błędu: {error.digest}
        </p>
      )}

      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <button
          onClick={reset}
          className="inline-flex items-center gap-2 rounded-md bg-zinc-100 px-5 py-2.5 text-sm font-medium text-zinc-950 transition-all hover:bg-white active:scale-[0.98]"
        >
          <RotateCw className="size-4" />
          Spróbuj ponownie
        </button>
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 rounded-md border border-zinc-800 px-5 py-2.5 text-sm font-medium text-zinc-300 transition-colors hover:bg-zinc-900"
        >
          <Home className="size-4" />
          Wróć do dashboardu
        </Link>
      </div>
    </div>
  );
}
