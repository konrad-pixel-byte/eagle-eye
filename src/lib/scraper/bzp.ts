import type { Tender } from "@/lib/types";

// ---------------------------------------------------------------------------
// BZP API types
// ---------------------------------------------------------------------------

export interface BzpSearchRequest {
  searchPhrase: string;
  cpvCodes: string[];
  publicationDateFrom: string;
  publicationDateTo: string;
  orderType: string;
  pageNumber: number;
  pageSize: number;
  sortField: string;
  sortOrder: string;
}

export interface BzpNotice {
  noticeId: string;
  title: string;
  publicationDate: string;
  orderObject: string | null;
  totalValue: number | null;
  currency: string | null;
  contractingAuthorityName: string | null;
  contractingAuthorityAddress: string | null;
  cpvCodes: string[] | null;
  submissionDeadline: string | null;
}

interface BzpSearchResponse {
  notices: BzpNotice[];
  totalCount: number;
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const BZP_API_URL =
  "https://ezamowienia.gov.pl/mo-board/api/v1/Board/Search";

const BZP_NOTICE_URL =
  "https://ezamowienia.gov.pl/mo-client-board/bzp/notice-details/id";

// Polish voivodeships — matched case-insensitively against address strings
const VOIVODESHIP_PATTERNS: ReadonlyArray<{ pattern: RegExp; name: string }> = [
  { pattern: /dolno.?l.?sk/i, name: "dolnośląskie" },
  { pattern: /kujawsko.?pomorsk/i, name: "kujawsko-pomorskie" },
  { pattern: /lubelsk/i, name: "lubelskie" },
  { pattern: /lubusk/i, name: "lubuskie" },
  { pattern: /\b.?ódz|\blodz/i, name: "łódzkie" },
  { pattern: /ma.?opolsk/i, name: "małopolskie" },
  { pattern: /mazowieck/i, name: "mazowieckie" },
  { pattern: /opolsk/i, name: "opolskie" },
  { pattern: /podkarpack/i, name: "podkarpackie" },
  { pattern: /podlask/i, name: "podlaskie" },
  { pattern: /pomorsk/i, name: "pomorskie" },
  { pattern: /\bsl.?sk|\bśląsk/i, name: "śląskie" },
  { pattern: /świętokrzysk/i, name: "świętokrzyskie" },
  { pattern: /warmi.?mazursk/i, name: "warmińsko-mazurskie" },
  { pattern: /wielkopolsk/i, name: "wielkopolskie" },
  { pattern: /zachodniopomorsk/i, name: "zachodniopomorskie" },
];

// City→voivodeship fallback for major cities that appear in addresses
const CITY_TO_VOIVODESHIP: Readonly<Record<string, string>> = {
  warszawa: "mazowieckie",
  warsaw: "mazowieckie",
  kraków: "małopolskie",
  krakow: "małopolskie",
  wrocław: "dolnośląskie",
  wroclaw: "dolnośląskie",
  łódź: "łódzkie",
  lodz: "łódzkie",
  poznań: "wielkopolskie",
  poznan: "wielkopolskie",
  gdańsk: "pomorskie",
  gdansk: "pomorskie",
  szczecin: "zachodniopomorskie",
  bydgoszcz: "kujawsko-pomorskie",
  lublin: "lubelskie",
  katowice: "śląskie",
  białystok: "podlaskie",
  bialystok: "podlaskie",
  rzeszów: "podkarpackie",
  rzeszow: "podkarpackie",
  olsztyn: "warmińsko-mazurskie",
  opole: "opolskie",
  zielona: "lubuskie", // Zielona Góra
  kielce: "świętokrzyskie",
  toruń: "kujawsko-pomorskie",
  torun: "kujawsko-pomorskie",
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function formatDate(date: Date): string {
  return date.toISOString().split("T")[0];
}

export function extractVoivodeship(address: string | null): string | null {
  if (!address) return null;

  for (const { pattern, name } of VOIVODESHIP_PATTERNS) {
    if (pattern.test(address)) {
      return name;
    }
  }

  // Fallback: try to match a known city in the address
  const lowerAddress = address.toLowerCase();
  for (const [city, voivodeship] of Object.entries(CITY_TO_VOIVODESHIP)) {
    if (lowerAddress.includes(city)) {
      return voivodeship;
    }
  }

  return null;
}

function parseBzpNotices(raw: unknown): BzpNotice[] {
  if (!raw || typeof raw !== "object") return [];

  const obj = raw as Record<string, unknown>;

  // Try common response shapes
  const candidates = [
    obj["notices"],
    obj["data"],
    obj["items"],
    obj["results"],
    Array.isArray(raw) ? raw : null,
  ];

  for (const candidate of candidates) {
    if (Array.isArray(candidate)) {
      return candidate
        .filter((item): item is Record<string, unknown> => !!item && typeof item === "object")
        .map((item) => ({
          noticeId: String(item["noticeId"] ?? item["id"] ?? item["ogloszenieId"] ?? ""),
          title: String(item["title"] ?? item["tytul"] ?? item["name"] ?? ""),
          publicationDate: String(
            item["publicationDate"] ?? item["dataPublikacji"] ?? item["publishedAt"] ?? ""
          ),
          orderObject: (item["orderObject"] ?? item["przedmiotZamowienia"] ?? null) as string | null,
          totalValue: (item["totalValue"] ?? item["wartoscCalkowita"] ?? null) as number | null,
          currency: (item["currency"] ?? item["waluta"] ?? "PLN") as string | null,
          contractingAuthorityName:
            (item["contractingAuthorityName"] ??
              item["zamawiajacyNazwa"] ??
              item["buyerName"] ??
              null) as string | null,
          contractingAuthorityAddress:
            (item["contractingAuthorityAddress"] ??
              item["zamawiajacyAdres"] ??
              item["buyerAddress"] ??
              null) as string | null,
          cpvCodes: (item["cpvCodes"] ?? item["kodyCPV"] ?? null) as string[] | null,
          submissionDeadline:
            (item["submissionDeadline"] ??
              item["terminSkladaniaOfert"] ??
              item["deadline"] ??
              null) as string | null,
        }));
    }
  }

  return [];
}

// ---------------------------------------------------------------------------
// Core fetch function
// ---------------------------------------------------------------------------

export async function fetchBzpNotices(
  cpvCodes: string[],
  daysBack: number
): Promise<BzpNotice[]> {
  const now = new Date();
  const from = new Date(now.getTime() - daysBack * 24 * 60 * 60 * 1000);

  const body: BzpSearchRequest = {
    searchPhrase: "",
    cpvCodes,
    publicationDateFrom: formatDate(from),
    publicationDateTo: formatDate(now),
    orderType: "SERVICES",
    pageNumber: 0,
    pageSize: 100,
    sortField: "PUBLICATION_DATE",
    sortOrder: "DESC",
  };

  try {
    const response = await fetch(BZP_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(body),
      // Next.js fetch: no caching for cron-triggered scraper
      cache: "no-store",
    });

    if (!response.ok) {
      console.warn(
        `[BZP] API returned ${response.status} ${response.statusText}`
      );
      return [];
    }

    const raw: unknown = await response.json();
    const notices = parseBzpNotices(raw);

    if (notices.length === 0) {
      console.warn("[BZP] Response parsed but zero notices found. Raw keys:",
        raw && typeof raw === "object" ? Object.keys(raw as object).join(", ") : typeof raw
      );
    }

    return notices;
  } catch (error) {
    console.warn("[BZP] Fetch failed:", error instanceof Error ? error.message : String(error));
    return [];
  }
}

// ---------------------------------------------------------------------------
// Mapping
// ---------------------------------------------------------------------------

export function mapBzpToTender(notice: BzpNotice): Partial<Tender> {
  const description = notice.orderObject ?? null;
  const voivodeship = extractVoivodeship(notice.contractingAuthorityAddress);

  return {
    external_id: `BZP-${notice.noticeId}`,
    source: "BZP",
    title: notice.title || "Brak tytułu",
    description,
    cpv_codes: notice.cpvCodes ?? [],
    budget_min: null,
    budget_max: notice.totalValue ?? null,
    currency: notice.currency ?? "PLN",
    contracting_authority: notice.contractingAuthorityName,
    contracting_authority_address: notice.contractingAuthorityAddress,
    voivodeship,
    status: "active",
    published_at: notice.publicationDate || null,
    deadline_submission: notice.submissionDeadline ?? null,
    source_url: notice.noticeId
      ? `${BZP_NOTICE_URL}/${notice.noticeId}`
      : null,
  };
}

// ---------------------------------------------------------------------------
// Deduplicated batch fetch
// ---------------------------------------------------------------------------

export async function fetchAndMapBzpTenders(
  cpvCodes: string[],
  daysBack: number
): Promise<{ tenders: Array<Partial<Tender>>; fetchError: string | null }> {
  const notices = await fetchBzpNotices(cpvCodes, daysBack);

  if (notices.length === 0) {
    return {
      tenders: [],
      fetchError:
        notices.length === 0
          ? "BZP API returned no notices (may be unavailable or changed format)"
          : null,
    };
  }

  // De-duplicate notices by noticeId within the response itself
  const seen = new Set<string>();
  const unique = notices.filter((n) => {
    if (!n.noticeId || seen.has(n.noticeId)) return false;
    seen.add(n.noticeId);
    return true;
  });

  return {
    tenders: unique.map(mapBzpToTender),
    fetchError: null,
  };
}
