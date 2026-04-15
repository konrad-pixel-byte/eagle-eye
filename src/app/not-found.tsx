import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { Eye } from "lucide-react";
import { cn } from "@/lib/utils";

export default function NotFound() {
  return (
    <div className="flex min-h-[100dvh] flex-col items-center justify-center px-6">
      <Eye className="mb-6 h-10 w-10 text-zinc-700" strokeWidth={1.5} />

      <h1 className="mt-3 text-2xl font-bold tracking-tighter text-white md:text-3xl">
        Strona nie istnieje
      </h1>

      <p className="mt-2 max-w-[40ch] text-center text-sm text-zinc-500">
        Nie znaleźliśmy strony, której szukasz.
      </p>

      <Link
        href="/"
        className={cn(
          buttonVariants({ size: "lg" }),
          "mt-8 bg-zinc-100 text-zinc-950 hover:bg-white active:scale-[0.98] transition-all"
        )}
      >
        Wróć na stronę główną
      </Link>
    </div>
  );
}
