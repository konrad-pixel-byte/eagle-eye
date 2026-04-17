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

  // ─── MODUŁ 3 ───────────────────────────────────────────────────────────────
  {
    id: 3,
    title: "Strategia wygrywania",
    description:
      "Zaawansowane techniki zwiększania szans na wygraną. Analiza konkurencji, ceny ofertowe i kryteria oceny.",
    tier: "basic",
    xpReward: 75,
    lessons: [
      {
        id: 1,
        title: "Analiza konkurencji przed złożeniem oferty",
        duration: "12 min",
        content: [
          {
            type: "paragraph",
            text: "Firmy, które wygrywają przetargi systematycznie, nie robią tego przypadkowo. Zanim złożą ofertę, wiedzą kto jest ich rywalem, ile zamawiający płacił dotychczas i jaki jest realny budżet zamówienia.",
          },
          {
            type: "heading",
            text: "Gdzie znaleźć informacje o konkurencji?",
          },
          {
            type: "list",
            items: [
              "Portal BZP (ezamowienia.gov.pl) — wyniki poprzednich postępowań tego samego zamawiającego",
              "TED (ted.europa.eu) — europejskie ogłoszenia dla zamówień powyżej progów UE",
              "CEIDG i KRS — sprawdź kondycję finansową konkurentów",
              "Referencje w SWZ — zamawiający często wymaga projektów podobnych do tych, które realizował dotychczasowy wykonawca",
            ],
          },
          {
            type: "tip",
            text: "W Eagle Eye możesz śledzić historię postępowań każdego zamawiającego. Sprawdź, kto wygrał poprzednie 3 przetargi — to prawdopodobnie Twój główny konkurent.",
          },
          {
            type: "heading",
            text: "Analiza wyników historycznych",
          },
          {
            type: "paragraph",
            text: "Kiedy znajdziesz poprzednie wyniki, zwróć uwagę na: różnicę między ceną wygrywającą a drugą ofertą, liczbę firm, które składały oferty (mała liczba = słaba konkurencja), oraz czy zamawiający stosuje kryterium ceny w 100% czy uwzględnia jakość.",
          },
          {
            type: "numbered",
            items: [
              "Pobierz protokół z poprzedniego postępowania (zamawiający ma obowiązek go udostępnić)",
              "Zapisz ceny 3 ostatnich ofert wygrywających",
              "Oblicz odchylenie standardowe — to zakres cen, w którym warto się zmieścić",
              "Sprawdź, czy obecne zamówienie jest tożsame czy poszerzone",
            ],
          },
          {
            type: "heading",
            text: "Zrozumienie budżetu zamawiającego",
          },
          {
            type: "paragraph",
            text: "Zamawiający musi zabezpieczyć środki przed ogłoszeniem postępowania. Kwota ta jest często podana w SWZ jako 'kwota przeznaczona na realizację'. To cenne dane — oferta powyżej tej kwoty może zostać odrzucona.",
          },
          {
            type: "warning",
            text: "Zaniżanie ceny poniżej kosztów jest nielegalne (rażąco niska cena). Zamawiający może wezwać do wyjaśnień, a zbyt niska oferta zostanie odrzucona.",
          },
        ],
      },
      {
        id: 2,
        title: "Kryteria oceny ofert — jak grać na punkty",
        duration: "10 min",
        content: [
          {
            type: "paragraph",
            text: "Cena to nie wszystko. W Polsce nadal dominuje kryterium ceny z wagą 60%, ale zamawiający coraz częściej dodają kryteria pozacenowe: doświadczenie, czas realizacji, gwarancja, metodologia. Umiejętność grania na te punkty to klucz do wygranej.",
          },
          {
            type: "heading",
            text: "Typowe kryteria pozacenowe",
          },
          {
            type: "list",
            items: [
              "Termin realizacji / czas dostawy (waga 10–20%)",
              "Okres gwarancji lub rękojmi (waga 10–20%)",
              "Doświadczenie personelu kluczowego (waga 10–20%)",
              "Metodologia / koncepcja realizacji (waga 20–40% — szczególnie przy usługach)",
              "Aspekty społeczne: zatrudnienie na umowę o pracę, zatrudnienie niepełnosprawnych",
              "Aspekty środowiskowe: emisja CO2, certyfikaty ISO 14001",
            ],
          },
          {
            type: "tip",
            text: "Gdy w SWZ jest kryterium 'metodologia' z wagą 20%+, poświęć mu co najmniej tyle samo czasu co wycenie. Słaba metodologia może kosztować Cię kilkanaście punktów i przegraną.",
          },
          {
            type: "heading",
            text: "Optymalizacja wielokryterialna",
          },
          {
            type: "paragraph",
            text: "Wyobraź sobie postępowanie: cena 60%, gwarancja 20%, termin 20%. Twoja cena jest o 5% wyższa niż najtańszego konkurenta — tracisz ~3 pkt na cenie. Ale jeśli zaoferujesz gwarancję 60 miesięcy vs 36 miesięcy rywala, możesz odrobić 5-6 pkt. Wygrywasz nie ceną, lecz kombinacją.",
          },
          {
            type: "numbered",
            items: [
              "Przeczytaj wzory oceny w SWZ — zamawiający podaje dokładne równania",
              "Policz punkty dla różnych scenariuszy cenowych (arkusz kalkulacyjny)",
              "Zidentyfikuj kryteria, w których możesz zaproponować lepsze parametry bez dużych kosztów",
              "Złóż ofertę maksymalizującą punkty, nie minimalizującą cenę",
            ],
          },
          {
            type: "quote",
            text: "Najlepsza oferta to nie najtańsza oferta. To oferta z najwyższą sumą punktów. Firmy, które to rozumieją, mają win-rate 3× wyższy od tych, które walczą tylko ceną.",
          },
          {
            type: "heading",
            text: "Kiedy warto nie składać oferty",
          },
          {
            type: "paragraph",
            text: "Analiza przedofertowa powinna też prowadzić do decyzji 'nie składamy'. Jeśli kryteria są skrojone pod konkretnego wykonawcę, warunki techniczne są niemożliwe do spełnienia w Twojej branży, albo budżet nie pokrywa realistycznych kosztów — oszczędź czas i zasoby.",
          },
        ],
      },
      {
        id: 3,
        title: "Pisanie oferty, która wyróżnia się z tłumu",
        duration: "14 min",
        content: [
          {
            type: "paragraph",
            text: "Komisja oceniająca przegląda dziesiątki ofert. Twoja musi być jasna, przekonująca i bezbłędna formalnie. Jedna pomyłka formalna może kosztować odrzucenie — niezależnie od tego, jak dobra jest Twoja cena.",
          },
          {
            type: "heading",
            text: "Struktura zwycięskiej oferty",
          },
          {
            type: "numbered",
            items: [
              "Formularz oferty — wypełniony dokładnie według wzoru z SWZ, z podpisami osób umocowanych",
              "Oświadczenie JEDZ/własne — aktualne, bez braków i nieścisłości",
              "Dokumenty podmiotowe — referencje, certyfikaty, polisy OC w wymaganym zakresie",
              "Dokumenty przedmiotowe — próbki, karty katalogowe, opisy techniczne jeśli SWZ tego wymaga",
              "Pełnomocnictwa — gdy ofertę składa pełnomocnik lub konsorcjum",
              "Tajemnica przedsiębiorstwa — jeśli chcesz utajnić część, muszą być uzasadnione podstawy",
            ],
          },
          {
            type: "warning",
            text: "Brakujący podpis, nieaktualne zaświadczenie ZUS/US, brak pełnomocnictwa — to najczęstsze przyczyny odrzucenia formalnie poprawnych ofert. Rób checklistę przed każdym złożeniem.",
          },
          {
            type: "heading",
            text: "Język i styl oferty technicznej",
          },
          {
            type: "paragraph",
            text: "W części merytorycznej (metodologia, koncepcja) pisz konkretnie i liczbowo. Zamiast 'doświadczony zespół' napisz '12 certyfikowanych specjalistów z 5-letnim doświadczeniem w projektach powyżej 2 mln PLN'. Zamiast 'szybka realizacja' napisz 'dostarczamy w 21 dni, a nie wymaganych 30'.",
          },
          {
            type: "list",
            items: [
              "Używaj liczb i konkretów zamiast przymiotników",
              "Odwołuj się do treści SWZ — pokaż, że rozumiesz co zamawiający chce osiągnąć",
              "Strukturyzuj tekst nagłówkami — komisja musi szybko znaleźć kluczowe informacje",
              "Unikaj szablonowych zwrotów stosowanych przez wszystkich ('firma z wieloletnim doświadczeniem')",
            ],
          },
          {
            type: "heading",
            text: "Weryfikacja przed złożeniem",
          },
          {
            type: "tip",
            text: "Zasada 4 oczu — każdą ofertę powinny przejrzeć co najmniej 2 osoby. Jedna sprawdza merytorykę, druga wyłącznie kompletność i formalności.",
          },
          {
            type: "numbered",
            items: [
              "Sprawdź daty ważności dokumentów (polisy, zaświadczenia)",
              "Zweryfikuj zgodność parametrów technicznych z wymaganiami SWZ",
              "Przetestuj upload pliku przez platformę ePUAP/e-Zamówienia przed terminem",
              "Wyślij przynajmniej 2 godziny przed terminem — awarie systemów zdarzają się",
            ],
          },
          {
            type: "divider",
          },
          {
            type: "quote",
            text: "Przetarg wygrany na etapie przygotowania, nie składania. Firma, która spędza tydzień na przygotowaniu, bije firmę, która spędza jeden dzień — zawsze.",
          },
        ],
      },
    ],
  },

  // ─── MODUŁ 4 ───────────────────────────────────────────────────────────────
  {
    id: 4,
    title: "Zaawansowane techniki",
    description:
      "Konsorcja, podwykonawstwo, odwołania do KIO oraz zarządzanie portfelem zamówień na poziomie eksperckim.",
    tier: "pro",
    xpReward: 100,
    lessons: [
      {
        id: 1,
        title: "Konsorcja i podwykonawstwo",
        duration: "12 min",
        content: [
          {
            type: "paragraph",
            text: "Nie musisz wygrywać przetargów samodzielnie. Konsorcjum pozwala firmom połączyć potencjał kadrowy, finansowy i doświadczenie, by spełnić warunki udziału niemożliwe do spełnienia w pojedynkę.",
          },
          {
            type: "heading",
            text: "Konsorcjum — podstawy prawne",
          },
          {
            type: "paragraph",
            text: "Konsorcjum to nie spółka — nie musisz zakładać nowego podmiotu. To umowa cywilnoprawna, w której firmy wspólnie ubiegają się o zamówienie. Każdy konsorcjant odpowiada solidarnie za wykonanie umowy, jeśli SWZ tak stanowi.",
          },
          {
            type: "list",
            items: [
              "Lider konsorcjum podpisuje umowę z zamawiającym i wystawia faktury",
              "Każdy konsorcjant składa własne JEDZ i dokumenty podmiotowe",
              "Warunki udziału (doświadczenie, personel) można sumować między konsorcjantami",
              "Zamawiający może żądać umowy konsorcjum przed podpisaniem umowy głównej",
            ],
          },
          {
            type: "tip",
            text: "Szukasz partnera do konsorcjum? Sprawdź, kto wygrał podobne przetargi w regionach, gdzie nie działasz. Spółka z komplementarnym portfolio to idealny kandydat.",
          },
          {
            type: "heading",
            text: "Podwykonawstwo — kiedy i jak?",
          },
          {
            type: "paragraph",
            text: "Podwykonawstwo to zlecenie części zamówienia innemu podmiotowi. Możesz też 'powoływać się na zasoby' podwykonawcy — jego doświadczenie liczy się do spełnienia warunków udziału, ale podwykonawca musi wtedy faktycznie realizować tę część.",
          },
          {
            type: "warning",
            text: "Zamawiający może zastrzec obowiązek osobistego wykonania kluczowych części zamówienia. Czytaj SWZ pod kątem zakazu lub ograniczeń podwykonawstwa.",
          },
          {
            type: "heading",
            text: "Pułapki umów konsorcjum",
          },
          {
            type: "numbered",
            items: [
              "Ustal podział prac w umowie konsorcjum zanim złożysz ofertę — konflikty na etapie realizacji są kosztowne",
              "Określ jaki procent wynagrodzenia otrzymuje każdy partner",
              "Ustal kto odpowiada za kontakt z zamawiającym i zmiany umowy",
              "Wpisz klauzulę co się dzieje, gdy jeden konsorcjant nie wykonuje swojej części",
            ],
          },
        ],
      },
      {
        id: 2,
        title: "Odwołania do KIO — Twoje prawa",
        duration: "15 min",
        content: [
          {
            type: "paragraph",
            text: "Krajowa Izba Odwoławcza (KIO) to specjalistyczny organ rozstrzygający spory w zamówieniach publicznych. Odwołanie to Twoje prawo — i potężne narzędzie, gdy zamawiający działa niezgodnie z PZP.",
          },
          {
            type: "heading",
            text: "Kiedy warto złożyć odwołanie?",
          },
          {
            type: "list",
            items: [
              "Zamawiający odrzucił Twoją ofertę bez podstawy prawnej",
              "Warunki SWZ są nieproporcjonalne lub dyskryminujące",
              "Zamawiający wybrał ofertę z rażąco niską ceną bez wyjaśnień",
              "Opis przedmiotu zamówienia wskazuje na konkretny produkt (naruszenie zasady równości)",
              "Termin składania ofert jest zbyt krótki",
            ],
          },
          {
            type: "tip",
            text: "Możesz odwołać się nie tylko po wyborze oferty, ale też na etapie SWZ — jeśli warunki udziału są niemożliwe do spełnienia lub OPZ wyklucza Twoją firmę. Termin: 10 dni od publikacji ogłoszenia.",
          },
          {
            type: "heading",
            text: "Procedura odwołania — krok po kroku",
          },
          {
            type: "numbered",
            items: [
              "Zidentyfikuj naruszenie przepisu PZP (musisz wskazać konkretny artykuł)",
              "Sprawdź termin: 10 dni od daty czynności zamawiającego (dla zamówień powyżej progów UE)",
              "Uiść wpis: od 7 500 PLN (usługi/dostawy) do 20 000 PLN (roboty budowlane powyżej 10 mln PLN)",
              "Złóż odwołanie do KIO i jednocześnie do zamawiającego przez ePUAP",
              "Zamawiający może uwzględnić odwołanie w 3 dni — wiele spraw kończy się tutaj",
              "Rozprawa przed KIO: zazwyczaj 2–3 tygodnie od złożenia odwołania",
            ],
          },
          {
            type: "heading",
            text: "Koszty i ryzyko",
          },
          {
            type: "paragraph",
            text: "Jeśli wygrasz, zamawiający zwraca wpis + koszty pełnomocnika (do 3 600 PLN). Jeśli przegrasz, tracisz wpis. Dlatego odwołania mają sens przy zamówieniach, gdzie wartość kontraktu uzasadnia koszt — i gdy masz mocne podstawy prawne.",
          },
          {
            type: "warning",
            text: "KIO rozstrzyga w ciągu 15 dni. W tym czasie wykonanie umowy jest zawieszone. Zamawiający, wiedząc to, często ugodowo poprawia SWZ — odwołanie bywa skuteczne bez rozprawy.",
          },
          {
            type: "quote",
            text: "Profesjonalny wykonawca nie boi się KIO. To narzędzie wyrównywania szans — zamawiający wiedzą, że działanie poza prawem ma konsekwencje.",
          },
        ],
      },
      {
        id: 3,
        title: "Zarządzanie portfelem zamówień",
        duration: "13 min",
        content: [
          {
            type: "paragraph",
            text: "Firma, która systematycznie wygrywa przetargi, traktuje to jak business development — z pipeline'em, priorytetyzacją i mierzalnymi wskaźnikami. Przetargi to nie loteria, to powtarzalny proces.",
          },
          {
            type: "heading",
            text: "Budowanie pipeline'u przetargowego",
          },
          {
            type: "paragraph",
            text: "Pipeline przetargowy to lista aktualnych i planowanych postępowań, w których chcesz wziąć udział. Dobry pipeline ma horyzonty: 2 tygodnie (finalizacja ofert), 1 miesiąc (przygotowanie), 3 miesiące (monitoring) i 6 miesięcy (planowanie strategiczne).",
          },
          {
            type: "numbered",
            items: [
              "Ustaw alerty w Eagle Eye dla kluczowych kodów CPV i zamawiających",
              "Oceń każde nowe zamówienie w skali 1-5 (fit strategiczny, szansa wygranej, rentowność)",
              "Oferty z oceną poniżej 3 odfiltruj — nie składaj 'dla liczby'",
              "Monitoruj terminy składania ofert i planuj moce przerobowe z 2-tygodniowym wyprzedzeniem",
            ],
          },
          {
            type: "heading",
            text: "Wskaźniki win-rate i analiza przegraną",
          },
          {
            type: "list",
            items: [
              "Win-rate (%) = liczba wygranych / liczba złożonych ofert × 100",
              "Average bid value = średnia wartość złożonych ofert",
              "Cost per bid = koszt przygotowania jednej oferty (czas × stawka)",
              "ROI przetargowy = wartość wygranych kontraktów / łączny koszt ofertowania",
            ],
          },
          {
            type: "tip",
            text: "Po każdej przegranej odebrany przez zamawiającego protokół (MUST) i zadzwoń do komisji z prośbą o feedback. Połowa z nich odpowie — to bezcenne dane do poprawy następnej oferty.",
          },
          {
            type: "heading",
            text: "Specjalizacja vs. dywersyfikacja",
          },
          {
            type: "paragraph",
            text: "Firmy wygrywające 40-60% ofert zazwyczaj specjalizują się w 2-3 kodach CPV i 1-2 typach zamawiających. Dywersyfikacja jest dobra jako zabezpieczenie, ale wygrywanie wymaga głębokiej znajomości rynku. Wolisz być ekspertem w wąskiej niszy czy graczem ogólnym z 10% win-rate?",
          },
          {
            type: "divider",
          },
          {
            type: "heading",
            text: "System zarządzania wiedzą przetargową",
          },
          {
            type: "list",
            items: [
              "Biblioteka referencji: kataloguj każdy zrealizowany projekt z wartością, zakresem, referencją od zamawiającego",
              "Baza dokumentów: aktualne certyfikaty, polisy, sprawozdania finansowe — zawsze gotowe do wysyłki",
              "Templaty: szablony formularzy ofert, metodologii i planów realizacji dla Twoich kluczowych CPV",
              "Baza wiedzy o zamawiających: preferencje, historia wyborów, osoby kontaktowe",
            ],
          },
          {
            type: "quote",
            text: "Profesjonalne ofertowanie to nie talent. To system. Buduj go przez 12 miesięcy, a w 13. zaczniesz wygrywać 2× częściej.",
          },
        ],
      },
    ],
  },
]

export function getModule(moduleId: number): CourseModule | undefined {
  return COURSE_MODULES.find((m) => m.id === moduleId)
}

export function getLesson(moduleId: number, lessonId: number): Lesson | undefined {
  return getModule(moduleId)?.lessons.find((l) => l.id === lessonId)
}
