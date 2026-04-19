import type { Metadata } from "next"
import Link from "next/link"
import { Navbar } from "@/components/landing/navbar"
import { Footer } from "@/components/landing/footer"

export const metadata: Metadata = {
  title: "Regulamin",
  description:
    "Regulamin świadczenia usług Eagle Eye — zasady korzystania z serwisu, subskrypcje, odstąpienie od umowy.",
  alternates: { canonical: "/regulamin" },
}

const LAST_UPDATED = "19 kwietnia 2026"

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <Navbar />
      <main className="mx-auto max-w-3xl px-6 py-16">
        <nav className="mb-8 text-xs text-zinc-500">
          <Link href="/" className="hover:text-zinc-300">
            Strona główna
          </Link>
          <span className="mx-2">/</span>
          <span className="text-zinc-400">Regulamin</span>
        </nav>

        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          Regulamin
        </h1>
        <p className="mt-2 font-mono text-xs text-zinc-500">
          Ostatnia aktualizacja: {LAST_UPDATED}
        </p>

        <div className="mt-10 space-y-10 text-sm leading-relaxed text-zinc-400 [&_a]:text-[#0EA5E9] [&_a]:underline-offset-4 hover:[&_a]:underline [&_h2]:mt-0 [&_h2]:mb-3 [&_h2]:text-lg [&_h2]:font-semibold [&_h2]:text-zinc-100 [&_ul]:mt-3 [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-6 [&_p]:mt-3 [&_strong]:text-zinc-200">
          <section>
            <h2>§1. Definicje</h2>
            <ul>
              <li>
                <strong>Serwis</strong> — aplikacja Eagle Eye dostępna pod adresem{" "}
                <a href="https://eagle-eye.hatedapps.pl">
                  eagle-eye.hatedapps.pl
                </a>
                .
              </li>
              <li>
                <strong>Usługodawca</strong> — operator Serwisu.
              </li>
              <li>
                <strong>Użytkownik</strong> — osoba fizyczna, prawna lub jednostka
                organizacyjna korzystająca z Serwisu na podstawie rejestracji konta.
              </li>
              <li>
                <strong>Subskrypcja</strong> — odpłatny plan (Basic, Pro,
                Enterprise) rozliczany w cyklu miesięcznym lub rocznym.
              </li>
            </ul>
          </section>

          <section>
            <h2>§2. Zakres usługi</h2>
            <p>
              Serwis udostępnia monitoring postępowań o udzielenie zamówienia
              publicznego (BZP, TED) oraz środków rozwojowych (BUR, KFS) w obszarze
              usług szkoleniowych. Obejmuje wyszukiwarkę, alerty e-mail, zakładki,
              scoring AI, streszczenia i kalkulator oferty.
            </p>
            <p>
              Dane ogłoszeń pochodzą ze źródeł publicznych i udostępniane są „tak
              jak są”. Nie gwarantujemy kompletności ani wyłączności źródła —
              rekomendujemy weryfikację oryginału przed złożeniem oferty.
            </p>
          </section>

          <section>
            <h2>§3. Konto i rejestracja</h2>
            <ul>
              <li>
                Rejestracja wymaga podania adresu e-mail i ustawienia hasła.
              </li>
              <li>
                Użytkownik odpowiada za poufność danych logowania oraz za działania
                podjęte z jego konta.
              </li>
              <li>
                Konto jest nieprzenoszalne. Zakazane jest współdzielenie konta
                między wieloma osobami w planach indywidualnych.
              </li>
            </ul>
          </section>

          <section>
            <h2>§4. Plany, płatności, odnowienia</h2>
            <ul>
              <li>
                Aktualny cennik znajduje się na stronie głównej Serwisu w sekcji{" "}
                <a href="/#cennik">Cennik</a>.
              </li>
              <li>
                Płatności obsługuje Stripe. Subskrypcje odnawiają się automatycznie
                na kolejny okres rozliczeniowy, jeśli nie zostaną anulowane przed
                końcem bieżącego okresu.
              </li>
              <li>
                Anulowanie subskrypcji następuje przez panel użytkownika lub na
                żądanie wysłane na adres{" "}
                <a href="mailto:kontakt@hatedapps.pl">kontakt@hatedapps.pl</a>.
              </li>
              <li>
                Faktury są wystawiane elektronicznie po każdej udanej płatności.
              </li>
            </ul>
          </section>

          <section>
            <h2>§5. Prawo odstąpienia (konsumenci)</h2>
            <p>
              Konsumentowi przysługuje prawo odstąpienia od umowy w terminie 14 dni
              od jej zawarcia, bez podania przyczyny, zgodnie z ustawą o prawach
              konsumenta. Rozpoczęcie świadczenia usług cyfrowych przed upływem
              tego terminu odbywa się wyłącznie za wyraźną zgodą Użytkownika, który
              przyjmuje do wiadomości utratę prawa odstąpienia po pełnym
              wykonaniu usługi.
            </p>
          </section>

          <section>
            <h2>§6. Limity i fair use</h2>
            <p>
              Funkcje AI (scoring, streszczenia, coach) objęte są dziennymi limitami
              zależnymi od planu. Nadużycia (automatyzacja wykraczająca poza zwykłe
              korzystanie, scraping Serwisu, wielokrotne rejestracje w celu
              obchodzenia limitów) mogą skutkować ograniczeniem lub zawieszeniem
              konta.
            </p>
          </section>

          <section>
            <h2>§7. Reklamacje</h2>
            <p>
              Reklamacje należy zgłaszać na adres{" "}
              <a href="mailto:kontakt@hatedapps.pl">kontakt@hatedapps.pl</a>.
              Odpowiadamy w terminie 14 dni. Prosimy o opis problemu, datę
              wystąpienia i oczekiwany sposób rozpatrzenia.
            </p>
          </section>

          <section>
            <h2>§8. Odpowiedzialność</h2>
            <p>
              Serwis ma charakter informacyjno-analityczny. Usługodawca nie
              odpowiada za decyzje biznesowe Użytkownika podjęte na podstawie
              danych z Serwisu, w szczególności za decyzję o złożeniu lub nie
              złożeniu oferty w postępowaniu.
            </p>
          </section>

          <section>
            <h2>§9. Dane osobowe</h2>
            <p>
              Zasady przetwarzania danych osobowych określa{" "}
              <Link href="/polityka-prywatnosci">Polityka prywatności</Link>.
            </p>
          </section>

          <section>
            <h2>§10. Zmiany regulaminu</h2>
            <p>
              Zastrzegamy prawo do aktualizacji regulaminu. O istotnych zmianach
              poinformujemy e-mailem lub w panelu z co najmniej 14-dniowym
              wyprzedzeniem. Dalsze korzystanie z Serwisu po wejściu zmian w życie
              oznacza ich akceptację.
            </p>
          </section>

          <section>
            <h2>§11. Prawo właściwe</h2>
            <p>
              W sprawach nieuregulowanych stosuje się przepisy prawa polskiego.
              Spory rozstrzyga sąd właściwy dla siedziby Usługodawcy, z
              zastrzeżeniem bezwzględnie obowiązujących przepisów o właściwości
              sądu w sprawach konsumenckich.
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  )
}
