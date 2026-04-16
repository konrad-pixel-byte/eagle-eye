import type { Tender } from "@/lib/types";

// ---------------------------------------------------------------------------
// TED CPV codes for training-related tenders
// ---------------------------------------------------------------------------

const TRAINING_CPV_CODES = [
  "80511000", // Staff training services
  "80530000", // Vocational training services
  "80532000", // Management training services
  "80550000", // Safety training services
  "80570000", // Personal development training services
  "80562000", // First-aid training services
  "80533100", // Computer training services
  "80420000", // E-learning services
  "80571000", // Language training services
  "79634000", // Career counselling services (coaching)
];

// ---------------------------------------------------------------------------
// TED API types
// ---------------------------------------------------------------------------

export interface TedNotice {
  id?: string;
  title?: string;
  description?: string;
  cpvCodes?: string[];
  country?: string;
  deadline?: string;
  publicationDate?: string;
  contractingAuthority?: string;
  estimatedValue?: number;
  currency?: string;
  region?: string;
  documentUrl?: string;
}

// Shape of a single notice returned by the TED v3 Search API
interface TedApiNoticeRaw {
  noticeNumber?: unknown;
  "notice-number"?: unknown;
  id?: unknown;
  "publication-number"?: unknown;
  title?: unknown;
  name?: unknown;
  description?: unknown;
  summary?: unknown;
  cpvCode?: unknown;
  cpvCodes?: unknown;
  "cpv-code"?: unknown;
  "cpv-codes"?: unknown;
  submissionDeadline?: unknown;
  "submission-deadline"?: unknown;
  deadline?: unknown;
  "deadline-date"?: unknown;
  publicationDate?: unknown;
  "publication-date"?: unknown;
  "dispatch-date"?: unknown;
  buyer?: unknown;
  "contracting-authority"?: unknown;
  authority?: unknown;
  estimatedValue?: unknown;
  "estimated-value"?: unknown;
  value?: unknown;
  currency?: unknown;
  "place-of-performance"?: unknown;
  location?: unknown;
  region?: unknown;
  url?: unknown;
  "document-url"?: unknown;
  link?: unknown;
  [key: string]: unknown;
}

// ---------------------------------------------------------------------------
// Parsing helpers
// ---------------------------------------------------------------------------

function safeString(value: unknown): string | undefined {
  if (typeof value === "string" && value.trim() !== "") return value.trim();
  if (typeof value === "number") return String(value);
  return undefined;
}

function safeNumber(value: unknown): number | undefined {
  if (typeof value === "number" && isFinite(value)) return value;
  if (typeof value === "string") {
    const parsed = parseFloat(value.replace(/[^0-9.-]/g, ""));
    if (isFinite(parsed)) return parsed;
  }
  return undefined;
}

function extractCpvCodes(raw: TedApiNoticeRaw): string[] {
  const candidates = [
    raw["cpvCodes"],
    raw["cpvCode"],
    raw["cpv-codes"],
    raw["cpv-code"],
  ];

  for (const c of candidates) {
    if (Array.isArray(c)) {
      return c
        .map((v: unknown) => (typeof v === "string" ? v.replace(/-\d$/, "").trim() : ""))
        .filter((v) => v.length > 0);
    }
    if (typeof c === "string" && c.trim() !== "") {
      return [c.replace(/-\d$/, "").trim()];
    }
  }

  return [];
}

function extractContractingAuthority(raw: TedApiNoticeRaw): string | undefined {
  const buyer = raw["buyer"];
  if (buyer && typeof buyer === "object" && !Array.isArray(buyer)) {
    const b = buyer as Record<string, unknown>;
    const name = safeString(b["officialName"] ?? b["name"] ?? b["legalName"]);
    if (name) return name;
  }

  const authority = raw["contracting-authority"] ?? raw["authority"];
  if (authority && typeof authority === "object" && !Array.isArray(authority)) {
    const a = authority as Record<string, unknown>;
    const name = safeString(a["name"] ?? a["officialName"]);
    if (name) return name;
  }

  return safeString(raw["buyer"] ?? raw["contracting-authority"] ?? raw["authority"]);
}

function extractRegion(raw: TedApiNoticeRaw): string | undefined {
  const placeOfPerf = raw["place-of-performance"] ?? raw["location"] ?? raw["region"];
  if (placeOfPerf && typeof placeOfPerf === "object" && !Array.isArray(placeOfPerf)) {
    const p = placeOfPerf as Record<string, unknown>;
    return safeString(p["nutscode"] ?? p["nuts"] ?? p["region"] ?? p["name"]);
  }
  return safeString(placeOfPerf);
}

function extractEstimatedValue(raw: TedApiNoticeRaw): { value?: number; currency?: string } {
  const candidates = [raw["estimatedValue"], raw["estimated-value"], raw["value"]];

  for (const c of candidates) {
    if (c && typeof c === "object" && !Array.isArray(c)) {
      const v = c as Record<string, unknown>;
      const amount = safeNumber(v["amount"] ?? v["value"] ?? v["totalAmount"]);
      const currency = safeString(v["currency"] ?? v["currencyCode"]);
      if (amount !== undefined) return { value: amount, currency };
    }
    if (typeof c === "number") return { value: c, currency: safeString(raw["currency"]) };
  }

  return {};
}

function extractDocumentUrl(raw: TedApiNoticeRaw, id: string | undefined): string | undefined {
  const urlCandidates = [raw["url"], raw["document-url"], raw["link"]];
  for (const c of urlCandidates) {
    const s = safeString(c);
    if (s) return s;
  }
  if (id) return `https://ted.europa.eu/en/notice/-/${id}`;
  return undefined;
}

function parseRawNotice(raw: TedApiNoticeRaw): TedNotice {
  const id = safeString(
    raw["noticeNumber"] ??
    raw["notice-number"] ??
    raw["id"] ??
    raw["publication-number"]
  );

  const title = safeString(raw["title"] ?? raw["name"]);
  const description = safeString(raw["description"] ?? raw["summary"]);
  const cpvCodes = extractCpvCodes(raw);
  const deadline = safeString(
    raw["submissionDeadline"] ??
    raw["submission-deadline"] ??
    raw["deadline"] ??
    raw["deadline-date"]
  );
  const publicationDate = safeString(
    raw["publicationDate"] ??
    raw["publication-date"] ??
    raw["dispatch-date"]
  );
  const contractingAuthority = extractContractingAuthority(raw);
  const { value: estimatedValue, currency } = extractEstimatedValue(raw);
  const region = extractRegion(raw);
  const documentUrl = extractDocumentUrl(raw, id);

  return {
    id,
    title,
    description,
    cpvCodes,
    country: "PL",
    deadline,
    publicationDate,
    contractingAuthority,
    estimatedValue,
    currency,
    region,
    documentUrl,
  };
}

function parseTedResponse(raw: unknown): TedNotice[] {
  if (!raw || typeof raw !== "object") return [];

  const obj = raw as Record<string, unknown>;

  // TED v3 Search API returns { notices: [...] } or { results: [...] }
  const candidates = [
    obj["notices"],
    obj["results"],
    obj["data"],
    obj["items"],
    Array.isArray(raw) ? raw : null,
  ];

  for (const candidate of candidates) {
    if (Array.isArray(candidate)) {
      return candidate
        .filter((item): item is TedApiNoticeRaw => !!item && typeof item === "object")
        .map(parseRawNotice);
    }
  }

  return [];
}

// ---------------------------------------------------------------------------
// TED API query builder
// ---------------------------------------------------------------------------

function buildTedQuery(cpvCodes: string[]): string {
  // TED Search API query syntax: TD=[contract type] AND PC=[CPV code] AND CY=[country]
  // Multiple CPV codes joined with OR
  const cpvPart = cpvCodes
    .map((code) => `PC=${code.slice(0, 8)}`)
    .join(" OR ");
  return `TD=[Contract notice] AND (${cpvPart}) AND CY=[PL]`;
}

// ---------------------------------------------------------------------------
// Core fetch
// ---------------------------------------------------------------------------

const TED_API_URL = "https://api.ted.europa.eu/v3/notices/search";
const TED_FETCH_TIMEOUT_MS = 15_000;

export async function fetchTedNotices(daysBack: number = 7): Promise<TedNotice[]> {
  const query = buildTedQuery(TRAINING_CPV_CODES);

  const now = new Date();
  const from = new Date(now.getTime() - daysBack * 24 * 60 * 60 * 1000);
  const fromStr = from.toISOString().split("T")[0];

  const requestBody = {
    query,
    fields: [
      "notice-number",
      "publication-number",
      "title",
      "description",
      "cpv-code",
      "submission-deadline",
      "publication-date",
      "dispatch-date",
      "buyer",
      "estimated-value",
      "place-of-performance",
      "url",
    ],
    filters: {
      "publication-date": { gte: fromStr },
    },
    page: 1,
    pageSize: 100,
    sortBy: "publication-date",
    sortOrder: "desc",
  };

  let response: Response;
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), TED_FETCH_TIMEOUT_MS);

    response = await fetch(TED_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(requestBody),
      cache: "no-store",
      signal: controller.signal,
    });

    clearTimeout(timeoutId);
  } catch (error) {
    console.warn(
      "[TED] Fetch failed:",
      error instanceof Error ? error.message : String(error)
    );
    return [];
  }

  if (!response.ok) {
    console.warn(`[TED] API returned ${response.status} ${response.statusText}`);
    // Try to log body for debugging without crashing
    try {
      const body = await response.text();
      console.warn("[TED] Error body (truncated):", body.slice(0, 300));
    } catch {
      // ignore secondary read errors
    }
    return [];
  }

  let raw: unknown;
  try {
    raw = await response.json();
  } catch (error) {
    console.warn("[TED] Failed to parse JSON response:", error instanceof Error ? error.message : String(error));
    return [];
  }

  const notices = parseTedResponse(raw);

  if (notices.length === 0) {
    console.warn(
      "[TED] Response parsed but zero notices found. Raw keys:",
      raw && typeof raw === "object"
        ? Object.keys(raw as object).join(", ")
        : typeof raw
    );
  }

  return notices;
}

// ---------------------------------------------------------------------------
// Mapping to Tender
// ---------------------------------------------------------------------------

export function mapTedToTender(notice: TedNotice): Partial<Tender> {
  return {
    external_id: notice.id ? `TED-${notice.id}` : null,
    source: "TED" as const,
    title: notice.title ?? "Bez tytułu",
    description: notice.description ?? null,
    cpv_codes: notice.cpvCodes ?? [],
    budget_min: null,
    budget_max: notice.estimatedValue ?? null,
    currency: notice.currency ?? "EUR",
    deadline_submission: notice.deadline ?? null,
    deadline_questions: null,
    contracting_authority: notice.contractingAuthority ?? null,
    contracting_authority_address: null,
    voivodeship: notice.region ?? null,
    status: "active" as const,
    source_url:
      notice.documentUrl ??
      (notice.id ? `https://ted.europa.eu/en/notice/-/${notice.id}` : null),
    published_at: notice.publicationDate ?? new Date().toISOString(),
  };
}

// ---------------------------------------------------------------------------
// Deduplicated batch fetch
// ---------------------------------------------------------------------------

export async function fetchAndMapTedTenders(
  daysBack: number = 7
): Promise<{ tenders: Array<Partial<Tender>>; fetchError: string | null }> {
  const notices = await fetchTedNotices(daysBack);

  if (notices.length === 0) {
    return {
      tenders: [],
      fetchError:
        "TED API returned no results or is unavailable",
    };
  }

  // De-duplicate by id within the response itself
  const seen = new Set<string>();
  const unique = notices.filter((n) => {
    if (!n.id) return true; // keep notices without id but don't track them
    if (seen.has(n.id)) return false;
    seen.add(n.id);
    return true;
  });

  return {
    tenders: unique.map(mapTedToTender),
    fetchError: null,
  };
}
