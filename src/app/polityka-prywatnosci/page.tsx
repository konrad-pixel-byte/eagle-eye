import type { Metadata } from "next"
import Link from "next/link"
import { Navbar } from "@/components/landing/navbar"
import { Footer } from "@/components/landing/footer"

export const metadata: Metadata = {
  title: "Polityka prywatności",
  description:
    "Polityka prywatności Eagle Eye — jakie dane zbieramy, w jakim celu i jak je chronimy.",
  alternates: { canonical: "/polityka-prywatnosci" },
}

const LAST_UPDATED = "19 kwietnia 2026"

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <Navbar />
      <main className="mx-auto max-w-3xl px-6 py-16">
        <nav className="mb-8 text-xs text-zinc-500">
          <Link href="/" className="hover:text-zinc-300">
            Strona główna
          </Link>
          <span className="mx-2">/</span>
          <span className="text-zinc-400">Polityka prywatności</span>
        </nav>

        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          Polityka prywatności
        </h1>
        <p className="mt-2 font-mono text-xs text-zinc-500">
          Ostatnia aktualizacja: {LAST_UPDATED}
        </p>

        <div className="mt-10 space-y-10 text-sm leading-relaxed text-zinc-400 [&_a]:text-[#0EA5E9] [&_a]:underline-offset-4 hover:[&_a]:underline [&_h2]:mt-0 [&_h2]:mb-3 [&_h2]:text-lg [&_h2]:font-semibold [&_h2]:text-zinc-100 [&_ul]:mt-3 [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-6 [&_p]:mt-3 [&_strong]:text-zinc-200">
          <section>
            <h2>1. Administrator danych</h2>
            <p>
              Administratorem danych osobowych przetwarzanych w serwisie Eagle Eye
              (dalej: „Serwis”) jest operator Serwisu. Kontakt w sprawach
              dotyczących ochrony danych osobowych:{" "}
              <a href="mailto:privacy@hatedapps.pl">privacy@hatedapps.pl</a>.
            </p>
          </section>

          <section>
            <h2>2. Zakres zbieranych danych</h2>
            <p>W związku z korzystaniem z Serwisu przetwarzamy:</p>
            <ul>
              <li>
                <strong>Dane konta:</strong> adres e-mail, imię i nazwisko (jeśli
                zostaną podane), hasło w formie skrótu (hash).
              </li>
              <li>
                <strong>Dane techniczne:</strong> adres IP, identyfikator sesji,
                informacje o przeglądarce i systemie operacyjnym, logi żądań.
              </li>
              <li>
                <strong>Dane o aktywności:</strong> zakładki, filtry, ustawienia
                alertów, historia wyszukiwań w Serwisie.
              </li>
              <li>
                <strong>Dane płatności:</strong> metadane transakcji (ID subskrypcji,
                status, kwota) — pełne dane karty przetwarza Stripe i nie trafiają
                one na nasze serwery.
              </li>
            </ul>
          </section>

          <section>
            <h2>3. Cele i podstawy prawne</h2>
            <ul>
              <li>
                Świadczenie usługi na podstawie umowy (art. 6 ust. 1 lit. b RODO).
              </li>
              <li>
                Rozliczenia, wystawianie faktur i obowiązki podatkowe (art. 6 ust. 1
                lit. c RODO).
              </li>
              <li>
                Komunikacja serwisowa i powiadomienia o przetargach (prawnie
                uzasadniony interes — art. 6 ust. 1 lit. f RODO).
              </li>
              <li>
                Ochrona bezpieczeństwa i wykrywanie nadużyć (prawnie uzasadniony
                interes).
              </li>
            </ul>
          </section>

          <section>
            <h2>4. Podmioty trzecie</h2>
            <p>Korzystamy z zewnętrznych dostawców (procesorów):</p>
            <ul>
              <li>
                <strong>Supabase</strong> — baza danych i uwierzytelnianie.
              </li>
              <li>
                <strong>Stripe</strong> — obsługa płatności subskrypcyjnych.
              </li>
              <li>
                <strong>Resend</strong> — wysyłka wiadomości e-mail.
              </li>
              <li>
                <strong>Anthropic</strong> — przetwarzanie zapytań AI (scoring,
                streszczenia). Treści ogłoszeń pochodzą ze źródeł publicznych (BZP,
                TED, BUR). Nie wysyłamy do AI danych osobowych użytkowników.
              </li>
            </ul>
          </section>

          <section>
            <h2>5. Okres przechowywania</h2>
            <p>
              Dane konta przechowujemy przez okres obowiązywania umowy i do 36
              miesięcy po jej zakończeniu (roszczenia). Dane rozliczeniowe — 5 lat
              od końca roku podatkowego. Logi techniczne — do 90 dni.
            </p>
          </section>

          <section>
            <h2>6. Twoje prawa</h2>
            <p>
              Przysługuje Ci prawo dostępu do danych, ich sprostowania, usunięcia,
              ograniczenia przetwarzania, przenoszenia, a także wniesienia sprzeciwu
              i skargi do Prezesa UODO. Żądania realizujemy bez zbędnej zwłoki po
              kontakcie na adres{" "}
              <a href="mailto:privacy@hatedapps.pl">privacy@hatedapps.pl</a>.
            </p>
          </section>

          <section>
            <h2>7. Cookies</h2>
            <p>
              Serwis używa wyłącznie plików cookies niezbędnych do działania
              (sesja, preferencje motywu). Nie korzystamy z reklamowych ani
              śledzących skryptów stron trzecich.
            </p>
          </section>

          <section>
            <h2>8. Zmiany polityki</h2>
            <p>
              Politykę możemy aktualizować. O istotnych zmianach poinformujemy
              e-mailem lub komunikatem w panelu. Aktualna wersja jest zawsze
              dostępna pod tym adresem.
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  )
}
