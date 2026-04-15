"use client";

import { Eye } from "lucide-react";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: ErrorProps) {
  return (
    <div className="flex min-h-[100dvh] flex-col items-center justify-center px-6">
      <Eye className="mb-6 h-10 w-10 text-zinc-700" strokeWidth={1.5} />

      <h1 className="mt-3 text-2xl font-bold tracking-tighter text-white md:text-3xl">
        Coś poszło nie tak
      </h1>

      {error.message && (
        <p className="mt-2 max-w-[40ch] text-center text-sm text-zinc-500">
          {error.message}
        </p>
      )}

      <button
        onClick={reset}
        className="mt-8 inline-flex items-center justify-center rounded-md bg-zinc-100 px-6 py-3 text-sm font-medium text-zinc-950 transition-all hover:bg-white active:scale-[0.98]"
      >
        Spróbuj ponownie
      </button>
    </div>
  );
}
