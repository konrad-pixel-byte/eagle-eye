"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

interface FAQItem {
  question: string;
  answer: string;
}

const faqs: FAQItem[] = [
  {
    question: "Skąd bierzecie dane o przetargach?",
    answer:
      "Integrujemy się bezpośrednio z oficjalnymi źródłami: Biuletyn Zamówień Publicznych (ezamowienia.gov.pl), TED (Unia Europejska) oraz Baza Konkurencyjności (funduszeeuropejskie.gov.pl). Dane są aktualizowane co kilka godzin, 24/7. Żadnego przepisywania ręcznie, żadnych pośredników.",
  },
  {
    question: "Co jeśli nie znajdę przetargu w pierwszym miesiącu?",
    answer:
      "14 dni darmowego okresu próbnego + 30-dniowa gwarancja zwrotu pieniędzy. Jeśli nie widzisz wartości — piszesz jedno zdanie na support, zwracamy 100% bez pytań. Zero umów, zero zobowiązań.",
  },
  {
    question: "Ile czasu dziennie muszę poświęcić?",
    answer:
      "5-10 minut rano wystarczy. System sam filtruje przetargi pod Twoje CPV i region. Dostajesz listę 3-5 pasujących ofert w skrzynce lub w aplikacji. Przeglądasz, zapisujesz, analizujesz. Zero scrollowania 500 pozycji z BZP.",
  },
  {
    question: "Czym to się różni od biuletynu z urzędu?",
    answer:
      "BZP i TED pokazują wszystko — 2000+ ogłoszeń dziennie, zalewają Cię szumem. Eagle Eye to laserowy filtr: tylko szkoleniowe, tylko w Twoim regionie, tylko w Twoim budżecie. Plus AI scoring (0-100), które podpowiada na którym warto skupić czas.",
  },
  {
    question: "Czy mogę anulować w każdej chwili?",
    answer:
      "Tak. Anulujesz jednym kliknięciem w panelu — bez telefonów, bez maili z „potwierdzeniem rezygnacji”. Subskrypcja kończy się na końcu okresu rozliczeniowego, żadnych opłat karnych.",
  },
  {
    question: "Kto stoi za projektem?",
    answer:
      "Zespół z 8+ lat doświadczenia w zamówieniach publicznych w sektorze szkoleniowym. Zbudowaliśmy Eagle Eye, bo sami traciliśmy 15h/tydzień na ręczne przeszukiwanie BZP. Teraz oszczędzamy ten czas innym.",
  },
  {
    question: "Czy AI naprawdę pomaga czy to marketing?",
    answer:
      "AI robi trzy konkretne rzeczy: (1) scoruje przetarg 0-100 pod Twój profil, (2) streszcza 30-stronicowe SWZ w 5 punktach, (3) sugeruje cenę bazując na historycznych wynikach podobnych przetargów. Plan Pro i wyżej. Na Free dostajesz sam scoring — sprawdź sam.",
  },
  {
    question: "Czy dane firmy są bezpieczne?",
    answer:
      "Serwery w UE (Polska), szyfrowanie TLS 1.3, RODO-compliant. Nie sprzedajemy danych. Nie trackujemy Cię po stronach trzecich. Kod bazowy nigdy nie opuszcza naszej infrastruktury.",
  },
];

function FAQItem({
  item,
  isOpen,
  onToggle,
}: {
  item: FAQItem;
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="border-b border-zinc-800/60">
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center justify-between gap-4 py-5 text-left transition-colors hover:text-white"
      >
        <span className="text-sm font-medium text-zinc-200 md:text-base">
          {item.question}
        </span>
        <span
          className={cn(
            "flex size-6 shrink-0 items-center justify-center rounded-full border border-zinc-800 transition-colors",
            isOpen && "border-zinc-700 bg-zinc-900"
          )}
        >
          {isOpen ? (
            <Minus className="size-3 text-zinc-400" />
          ) : (
            <Plus className="size-3 text-zinc-500" />
          )}
        </span>
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="overflow-hidden"
          >
            <p className="pb-5 text-sm leading-relaxed text-zinc-500">
              {item.answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section
      id="faq"
      className="border-t border-zinc-800/60 py-20 md:py-28"
    >
      <div className="mx-auto max-w-4xl px-6">
        <div className="mb-12 text-center">
          <p className="font-mono text-xs uppercase tracking-widest text-zinc-600">
            FAQ
          </p>
          <h2 className="mt-2 text-2xl font-bold tracking-tighter text-white md:text-3xl">
            Pytania, które zadaje każda firma przed zakupem.
          </h2>
          <p className="mt-3 text-sm text-zinc-500">
            Nie znajdziesz swojego? Napisz na{" "}
            <a
              href="mailto:kontakt@eagle-eye.pl"
              className="text-zinc-300 underline-offset-4 hover:underline"
            >
              kontakt@eagle-eye.pl
            </a>{" "}
            — odpowiadamy w 24h.
          </p>
        </div>

        <div>
          {faqs.map((item, i) => (
            <FAQItem
              key={item.question}
              item={item}
              isOpen={openIndex === i}
              onToggle={() => setOpenIndex(openIndex === i ? null : i)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
