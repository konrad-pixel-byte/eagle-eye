import Link from "next/link";
import { Eye } from "lucide-react";

export function Footer() {
  return (
    <footer id="kontakt" className="border-t border-border/40 bg-muted/20">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center gap-8 sm:flex-row sm:items-start sm:justify-between">
          {/* Logo */}
          <div className="flex flex-col items-center gap-3 sm:items-start">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#0EA5E9]">
                <Eye className="h-5 w-5 text-white" />
              </div>
              <span className="text-lg font-semibold tracking-tight">
                Eagle Eye
              </span>
            </Link>
            <p className="max-w-xs text-center text-sm text-muted-foreground sm:text-left">
              Inteligentna platforma do monitorowania przetargów szkoleniowych i
              finansowania BUR/KFS w Polsce.
            </p>
          </div>

          {/* Links */}
          <div className="grid grid-cols-2 gap-8 text-center sm:text-left">
            <div>
              <h4 className="text-sm font-semibold">Produkt</h4>
              <ul className="mt-3 space-y-2">
                <li>
                  <a
                    href="#funkcje"
                    className="text-sm text-muted-foreground hover:text-foreground"
                  >
                    Funkcje
                  </a>
                </li>
                <li>
                  <a
                    href="#cennik"
                    className="text-sm text-muted-foreground hover:text-foreground"
                  >
                    Cennik
                  </a>
                </li>
                <li>
                  <Link
                    href="/auth/signup"
                    className="text-sm text-muted-foreground hover:text-foreground"
                  >
                    Rejestracja
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold">Firma</h4>
              <ul className="mt-3 space-y-2">
                <li>
                  <span className="text-sm text-muted-foreground">
                    kontakt@eagleeye.pl
                  </span>
                </li>
                <li>
                  <span className="text-sm text-muted-foreground">
                    Polityka prywatności
                  </span>
                </li>
                <li>
                  <span className="text-sm text-muted-foreground">
                    Regulamin
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-8 border-t border-border/40 pt-6 text-center">
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} Eagle Eye. Wszelkie prawa
            zastrzeżone.
          </p>
        </div>
      </div>
    </footer>
  );
}
