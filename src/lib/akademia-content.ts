// ─── Akademia ZP — statyczna treść kursów ────────────────────────────────────

export interface Lesson {
  id: number
  title: string
  duration: string   // "10 min"
  content: LessonBlock[]
}

export interface LessonBlock {
  type: "heading" | "paragraph" | "tip" | "warning" | "list" | "numbered" | "quote" | "divider"
  text?: string
  items?: string[]
}

export interface CourseModule {
  id: number
  title: string
  description: string
  tier: "free" | "basic" | "pro"
  lessons: Lesson[]
  xpReward: number
  badgeOnComplete?: string
}

export const COURSE_MODULES: CourseModule[] = [
  // ─── MODUŁ 1 ───────────────────────────────────────────────────────────────
  {
    id: 1,
    title: "Podstawy zamówień publicznych",
    description:
      "Poznaj fundamenty systemu zamówień publicznych w Polsce. Dowiedz się, czym są przetargi i jak działa Ustawa PZP.",
    tier: "free",
    xpReward: 75,
    badgeOnComplete: "academy_module_1",
    lessons: [
      {
        id: 1,
        title: "Czym są zamówienia publiczne?",
        duration: "8 min",
        content: [
          {
            type: "paragraph",
            text: "Zamówienia publiczne to zakupy towarów, usług i robót budowlanych dokonywane przez podmioty publiczne — urzędy, szkoły, szpitale, spółki komunalne. W Polsce wartość rynku zamówień publicznych przekracza 200 miliardów złotych rocznie.",
          },
          {
            type: "heading",
            text: "Kto jest zamawiającym?",
          },
          {
            type: "list",
            items: [
              "Jednostki sektora finansów publicznych (ministerstwa, urzędy, szkoły, uczelnie)",
              "Samodzielne publiczne zakłady opieki zdrowotnej (szpitale)",
              "Spółki z udziałem Skarbu Państwa lub jednostek samorządu terytorialnego",
              "Zamawiający sektorowi (np. spółki energetyczne, wodociągowe)",
            ],
          },
          {
            type: "heading",
            text: "Dlaczego zamówienia publiczne są regulowane?",
          },
          {
            type: "paragraph",
            text: "Głównym celem regulacji jest zapewnienie uczciwej konkurencji, przejrzystości wydatkowania środków publicznych i efektywności zakupów. Zamawiający nie może dowolnie wybierać dostawcy — musi ogłosić postępowanie i wybrać ofertę zgodnie z ustalonymi kryteriami.",
          },
          {
            type: "tip",
            text: "Każdy podmiot spełniający wymagania może złożyć ofertę w przetargu. Nie ma zamkniętych list dostawców — rynek jest otwarty.",
          },
          {
            type: "heading",
            text: "Progi kwotowe — kiedy stosuje się PZP?",
          },
          {
            type: "paragraph",
            text: "Ustawa Prawo zamówień publicznych (PZP) stosuje się powyżej progów kwotowych. Poniżej progów zamawiający korzysta z Regulaminów wewnętrznych.",
          },
          {
            type: "numbered",
            items: [
              "Dostawy i usługi dla centralnych organów rządowych: 143 000 EUR",
              "Dostawy i usługi dla pozostałych zamawiających: 221 000 EUR",
              "Roboty budowlane: 5 538 000 EUR",
              "Zamówienia bagatelne (3 000–130 000 PLN): uproszczone zasady",
            ],
          },
          {
            type: "warning",
            text: "Progi UE są przeliczane na PLN co 2 lata. Zawsze sprawdzaj aktualne wartości w rozporządzeniu wykonawczym do PZP.",
          },
        ],
      },
      {
        id: 2,
        title: "Ustawa PZP — kluczowe zasady",
        duration: "10 min",
        content: [
          {
            type: "paragraph",
            text: "Nowa Ustawa Prawo Zamówień Publicznych obowiązuje od 1 stycznia 2021 roku. Zastąpiła poprzednią ustawę z 2004 roku i wprowadziła wiele uproszczeń korzystnych dla wykonawców.",
          },
          {
            type: "heading",
            text: "5 naczelnych zasad PZP",
          },
          {
            type: "numbered",
            items: [
              "Zasada konkurencyjności — zamawiający musi zapewnić uczciwe warunki konkurencji",
              "Zasada równego traktowania — wszyscy wykonawcy traktowani na tych samych zasadach",
              "Zasada przejrzystości — wszystkie działania muszą być dokumentowane i jawne",
              "Zasada proporcjonalności — wymagania muszą być adekwatne do przedmiotu zamówienia",
              "Zasada efektywności — zamawiający dąży do najlepszego stosunku jakości do ceny",
            ],
          },
          {
            type: "tip",
            text: "Zasada proporcjonalności to Twój sojusznik. Jeśli zamawiający wymaga np. 10-letniego doświadczenia przy prostej usłudze, możesz złożyć odwołanie do KIO.",
          },
          {
            type: "heading",
            text: "Kluczowe dokumenty w postępowaniu",
          },
          {
            type: "list",
            items: [
              "SWZ (Specyfikacja Warunków Zamówienia) — główny dokument opisujący zamówienie",
              "OPZ (Opis Przedmiotu Zamówienia) — szczegółowy opis tego, co zamawiający kupuje",
              "Wzór umowy — warunki kontraktu, kary umowne, terminy płatności",
              "IDW (Instrukcja dla Wykonawców) — jak złożyć ofertę",
              "JEDZ (Jednolity Europejski Dokument Zamówienia) — formularz kwalifikacji w UE",
            ],
          },
          {
            type: "heading",
            text: "Platforma e-Zamówienia",
          },
          {
            type: "paragraph",
            text: "Od 2023 roku wszystkie postępowania powyżej progu UE prowadzone są przez platformę e-Zamówienia (ezamowienia.gov.pl). Wymaga rejestracji i kwalifikowanego podpisu elektronicznego lub profilu zaufanego.",
          },
          {
            type: "warning",
            text: "Oferty składane po terminie są automatycznie odrzucane przez platformę. Nie liczy się data wysłania — liczy się data wpływu do systemu.",
          },
        ],
      },
      {
        id: 3,
        title: "Tryby udzielania zamówień",
        duration: "12 min",
        content: [
          {
            type: "paragraph",
            text: "PZP przewiduje kilka trybów udzielania zamówień. Podstawowym jest przetarg nieograniczony — otwarty dla wszystkich wykonawców. Pozostałe tryby mają ograniczone zastosowanie.",
          },
          {
            type: "heading",
            text: "Tryby podstawowe",
          },
          {
            type: "list",
            items: [
              "Przetarg nieograniczony — najczęstszy tryb, ofertę może złożyć każdy",
              "Przetarg ograniczony — zamawiający wstępnie kwalifikuje wykonawców, do składania ofert zaprasza tylko wybranych",
              "Tryb podstawowy (poniżej progów UE) — uproszczony przetarg nieograniczony",
            ],
          },
          {
            type: "heading",
            text: "Tryby negocjacyjne",
          },
          {
            type: "list",
            items: [
              "Negocjacje z ogłoszeniem — stosowane gdy nie można z góry określić wymagań",
              "Dialog konkurencyjny — dla złożonych zamówień, zamawiający rozmawia z wykonawcami",
              "Partnerstwo innowacyjne — dla zamówień wymagających opracowania innowacyjnego rozwiązania",
              "Negocjacje bez ogłoszenia — tylko w ściśle określonych sytuacjach (np. pilna potrzeba)",
            ],
          },
          {
            type: "tip",
            text: "W trybie podstawowym wariant 2 (z negocjacjami) masz szansę poprawić ofertę po pierwszej rundzie. To przewaga nad klasycznym przetargiem.",
          },
          {
            type: "heading",
            text: "Zamówienia z wolnej ręki",
          },
          {
            type: "paragraph",
            text: "Zamówienie z wolnej ręki to wyjątek — zamawiający negocjuje tylko z jednym wykonawcą. Przesłanki są bardzo ograniczone: brak ofert w poprzednim postępowaniu, wyjątkowa pilność, monopol techniczny, kontynuacja usług.",
          },
          {
            type: "quote",
            text: "Jako wykonawca nie masz wpływu na wybór trybu. Ale znając tryb, możesz lepiej ocenić swoje szanse i przygotować ofertę — w trybach negocjacyjnych relacja z zamawiającym ma większe znaczenie.",
          },
          {
            type: "heading",
            text: "Co dalej?",
          },
          {
            type: "paragraph",
            text: "Znasz już podstawy systemu zamówień publicznych. W następnym module nauczysz się, jak czytać SWZ, przygotować wymagane dokumenty i skonstruować ofertę, która przejdzie weryfikację formalną.",
          },
        ],
      },
    ],
  },

  // ─── MODUŁ 2 ───────────────────────────────────────────────────────────────
  {
    id: 2,
    title: "Przygotowanie skutecznej oferty",
    description:
      "Naucz się czytać SWZ, przygotowywać dokumenty i tworzyć oferty, które spełniają wszystkie wymagania formalne.",
    tier: "free",
    xpReward: 75,
    lessons: [
      {
        id: 1,
        title: "Jak czytać SWZ — na co zwracać uwagę",
        duration: "12 min",
        content: [
          {
            type: "paragraph",
            text: "SWZ (Specyfikacja Warunków Zamówienia) to najważniejszy dokument w każdym przetargu. Przed przygotowaniem oferty musisz ją przeczytać od początku do końca — i zrozumieć każdy punkt.",
          },
          {
            type: "heading",
            text: "Struktura typowej SWZ",
          },
          {
            type: "numbered",
            items: [
              "Zamawiający — kto ogłasza przetarg, dane kontaktowe",
              "Tryb postępowania i podstawa prawna",
              "Opis przedmiotu zamówienia (OPZ) — co dokładnie kupuje zamawiający",
              "Termin realizacji — kiedy masz wykonać zamówienie",
              "Warunki udziału — jakie wymogi musisz spełnić",
              "Podstawy wykluczenia — kiedy oferta zostanie odrzucona",
              "Wykaz oświadczeń i dokumentów — co musisz dołączyć",
              "Kryteria oceny ofert — jak będziesz oceniany",
              "Opis sposobu obliczenia ceny — co wchodzi w cenę",
              "Informacje o formalnościach — jak złożyć ofertę",
            ],
          },
          {
            type: "tip",
            text: "Zacznij od OPZ i kryteriów oceny. To dwa najważniejsze elementy. OPZ mówi Ci CO masz zrobić, kryteria mówią CI JAK zostaniesz oceniony.",
          },
          {
            type: "heading",
            text: "Warunki udziału — najczęstsze pułapki",
          },
          {
            type: "list",
            items: [
              "Zdolność techniczna: wymagane doświadczenie w realizacji podobnych zamówień — sprawdź, czy Twoje referencje pasują co do wartości, zakresu i daty",
              "Zdolność zawodowa: wymagane kwalifikacje personelu (certyfikaty, uprawnienia) — sprawdź daty ważności",
              "Sytuacja ekonomiczna: minimalne przychody lub ubezpieczenie OC — sprawdź wymagane kwoty",
              "Ubezpieczenie OC: często wymagany polisa na min. X PLN — zdobądź ją przed złożeniem oferty",
            ],
          },
          {
            type: "warning",
            text: "Nie zakładaj, że spełniasz warunki. Sprawdź każdy punkt szczegółowo. Niezgodność w warunkach = wykluczenie z postępowania.",
          },
          {
            type: "heading",
            text: "Kryteria oceny ofert",
          },
          {
            type: "paragraph",
            text: "PZP zakazuje oceniania wyłącznie po cenie. Najczęstsze kryteria to: cena (60-70%), termin realizacji (10-20%), gwarancja/rękojmia (10-20%), doświadczenie personelu (10-15%). Zrozumienie wag kryteriów pozwala obliczyć, jak powinieneś ustawić ofertę.",
          },
          {
            type: "quote",
            text: "Przykład: jeśli cena waży 60%, a termin 40% — lepiej skrócić termin o tydzień niż walczyć o każdą złotówkę w cenie.",
          },
        ],
      },
      {
        id: 2,
        title: "Dokumenty i oświadczenia w ofercie",
        duration: "10 min",
        content: [
          {
            type: "paragraph",
            text: "Oferta to nie tylko formularz cenowy. W przetargach publicznych musisz złożyć komplet dokumentów potwierdzających spełnienie warunków. Brak jednego dokumentu może skutkować odrzuceniem oferty.",
          },
          {
            type: "heading",
            text: "Dokumenty składane razem z ofertą",
          },
          {
            type: "list",
            items: [
              "Formularz ofertowy — cena, termin, parametry techniczne",
              "Oświadczenie JEDZ lub krajowe (poniżej progów UE) — wstępne potwierdzenie spełnienia warunków",
              "Pełnomocnictwo — jeśli składasz ofertę w imieniu innego podmiotu",
              "Zobowiązanie podmiotu udostępniającego zasoby — gdy korzystasz z zasobów innej firmy",
              "Tajemnica przedsiębiorstwa — uzasadnienie zastrzeżenia informacji poufnych",
            ],
          },
          {
            type: "heading",
            text: "Dokumenty składane na wezwanie",
          },
          {
            type: "paragraph",
            text: "Po wstępnej ocenie ofert, zamawiający wzywa najwyżej ocenionego wykonawcę do złożenia dokumentów podmiotowych. Masz zazwyczaj 10 dni na ich dostarczenie.",
          },
          {
            type: "list",
            items: [
              "Referencje (wykaz dostaw/usług/robót) — potwierdzające doświadczenie",
              "Wykaz osób skierowanych do realizacji — z kwalifikacjami i certyfikatami",
              "Odpis z KRS lub CEIDG — aktualny",
              "Zaświadczenie z ZUS — o braku zaległości składkowych",
              "Zaświadczenie z US — o braku zaległości podatkowych",
              "Informacja z KRK — o niekaralności",
            ],
          },
          {
            type: "tip",
            text: "Przygotuj folder z kompletnymi dokumentami firmowymi (KRS, ZUS, US, KRK) i odśwież go co kwartał. W przetargach liczy się szybkość — masz tylko 10 dni na odpowiedź.",
          },
          {
            type: "heading",
            text: "Referencje — jak je przygotować",
          },
          {
            type: "paragraph",
            text: "Referencja powinna zawierać: nazwę zamawiającego, przedmiot zamówienia, wartość, daty realizacji, ocenę wykonania, podpis osoby upoważnionej. Im bardziej pasuje do wymaganego zakresu, tym lepsza.",
          },
          {
            type: "warning",
            text: "Zamawiający może zadzwonić do wystawcy referencji i zapytać o szczegóły. Upewnij się, że osoba kontaktowa potwierdzi treść dokumentu.",
          },
        ],
      },
      {
        id: 3,
        title: "Kalkulacja ceny ofertowej",
        duration: "15 min",
        content: [
          {
            type: "paragraph",
            text: "Cena jest najważniejszym elementem większości przetargów. Zbyt wysoka — przegrywasz. Zbyt niska — wygrywasz, ale tracisz pieniądze lub narażasz się na zarzut rażąco niskiej ceny. Jak znaleźć złoty środek?",
          },
          {
            type: "heading",
            text: "Składniki ceny ofertowej",
          },
          {
            type: "numbered",
            items: [
              "Koszty bezpośrednie — materiały, robocizna, podwykonawstwo",
              "Koszty pośrednie — zarząd, biuro, narzędzia, transport",
              "Podatki i obciążenia — VAT (jeśli uwzględniany), ZUS od personelu",
              "Ryzyko — rezerwa na nieprzewidziane okoliczności (zwykle 3-10%)",
              "Zysk — Twój zarobek z kontraktu",
            ],
          },
          {
            type: "tip",
            text: "Zawsze sprawdzaj, czy cena ma być brutto czy netto. W zamówieniach publicznych prawie zawsze podaje się ceny brutto (z VAT), ale istnieją wyjątki.",
          },
          {
            type: "heading",
            text: "Rażąco niska cena — jak jej uniknąć",
          },
          {
            type: "paragraph",
            text: "Jeśli Twoja cena odbiega o więcej niż 30% od średniej wszystkich ofert lub od wartości zamówienia — zamawiający wezwie Cię do wyjaśnień. To nie jest dyskwalifikacja, ale musisz udokumentować, że cena jest realna.",
          },
          {
            type: "list",
            items: [
              "Przygotuj kosztorys szczegółowy jako wewnętrzny backup",
              "Jeśli masz niskie koszty (własne zasoby, optymalizacja), udokumentuj to",
              "Nie kalkuluj na 0% zysku — każdy kontrakt niesie ryzyko dodatkowych kosztów",
              "Sprawdź, czy zamawiający podał szacunkową wartość zamówienia (jest w ogłoszeniu lub BZP)",
            ],
          },
          {
            type: "heading",
            text: "Strategia cenowa",
          },
          {
            type: "quote",
            text: "Najlepszą strategią cenową jest trafienie w +/-5% szacunkowej wartości zamówienia. Zamawiający zna rynek — jego wycena jest często najlepszą wskazówką co do oczekiwanej ceny.",
          },
          {
            type: "list",
            items: [
              "Sprawdź poprzednie przetargi tego zamawiającego w BZP — jakie ceny wygrywały?",
              "Śledź wyniki postępowań w swojej branży przez Eagle Eye",
              "W kryterium punktowym: oblicz, ile punktów kupi Cię każda obniżka ceny",
              "Nie zawsze najniższa cena wygrywa — liczy się suma punktów ze wszystkich kryteriów",
            ],
          },
          {
            type: "warning",
            text: "Nigdy nie składaj oferty, której nie możesz wykonać za zaoferowaną cenę. Kara za niewykonanie umowy może być wyższa niż potencjalny zysk.",
          },
        ],
      },
    ],
  },

  // ─── MODUŁ 3 (zablokowany) ─────────────────────────────────────────────────
  {
    id: 3,
    title: "Strategia wygrywania",
    description:
      "Zaawansowane techniki zwiększania szans na wygraną. Analiza konkurencji, ceny ofertowe i kryteria oceny.",
    tier: "basic",
    xpReward: 75,
    lessons: [],
  },

  // ─── MODUŁ 4 (zablokowany) ─────────────────────────────────────────────────
  {
    id: 4,
    title: "Zaawansowane techniki",
    description:
      "Konsorcja, podwykonawstwo, odwołania do KIO oraz zarządzanie portfelem zamówień na poziomie eksperckim.",
    tier: "pro",
    xpReward: 100,
    lessons: [],
  },
]

export function getModule(moduleId: number): CourseModule | undefined {
  return COURSE_MODULES.find((m) => m.id === moduleId)
}

export function getLesson(moduleId: number, lessonId: number): Lesson | undefined {
  return getModule(moduleId)?.lessons.find((l) => l.id === lessonId)
}
