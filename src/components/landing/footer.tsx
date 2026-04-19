import Link from "next/link";
import { Eye } from "lucide-react";

export function Footer() {
  return (
    <footer id="kontakt" className="border-t border-zinc-800/60">
      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="grid gap-8 sm:grid-cols-[1fr_auto_auto]">
          {/* Brand */}
          <div>
            <Link href="/" className="flex items-center gap-2">
              <Eye className="h-4 w-4 text-[#0EA5E9]" strokeWidth={1.5} />
              <span className="text-sm font-semibold tracking-tight text-zinc-300">
                Eagle Eye
              </span>
            </Link>
            <p className="mt-3 max-w-xs text-xs leading-relaxed text-zinc-600">
              Monitoring przetargów szkoleniowych, finansowania BUR/KFS
              i narzędzia do wygrywania zamówień publicznych.
            </p>
          </div>

          {/* Links */}
          <div>
            <p className="font-mono text-[10px] uppercase tracking-widest text-zinc-700">
              Produkt
            </p>
            <ul className="mt-3 space-y-2">
              <li>
                <a href="#funkcje" className="text-xs text-zinc-500 hover:text-zinc-300">
                  Funkcje
                </a>
              </li>
              <li>
                <a href="#cennik" className="text-xs text-zinc-500 hover:text-zinc-300">
                  Cennik
                </a>
              </li>
              <li>
                <Link href="/auth/signup" className="text-xs text-zinc-500 hover:text-zinc-300">
                  Rejestracja
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <p className="font-mono text-[10px] uppercase tracking-widest text-zinc-700">
              Kontakt
            </p>
            <ul className="mt-3 space-y-2">
              <li>
                <a
                  href="mailto:kontakt@hatedapps.pl"
                  className="text-xs text-zinc-500 hover:text-zinc-300"
                >
                  kontakt@hatedapps.pl
                </a>
              </li>
              <li>
                <Link
                  href="/polityka-prywatnosci"
                  className="text-xs text-zinc-500 hover:text-zinc-300"
                >
                  Polityka prywatności
                </Link>
              </li>
              <li>
                <Link
                  href="/regulamin"
                  className="text-xs text-zinc-500 hover:text-zinc-300"
                >
                  Regulamin
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-zinc-800/40 pt-6">
          <p className="font-mono text-[10px] text-zinc-700">
            &copy; {new Date().getFullYear()} Eagle Eye. Wszelkie prawa zastrzeżone.
          </p>
        </div>
      </div>
    </footer>
  );
}
