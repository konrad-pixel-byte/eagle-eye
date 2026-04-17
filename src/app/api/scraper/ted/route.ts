import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { fetchAndMapTedTenders } from "@/lib/scraper/ted";
import { notifyMatchingUsers } from "@/lib/scraper/notify";
import type { Tender } from "@/lib/types";

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const DAYS_BACK = 7;

// ---------------------------------------------------------------------------
// Auth helper
// ---------------------------------------------------------------------------

function isAuthorized(request: NextRequest): boolean {
  const cronSecret = process.env.CRON_SECRET;
  if (!cronSecret) return false;

  const authHeader = request.headers.get("Authorization");
  return authHeader === `Bearer ${cronSecret}`;
}

// ---------------------------------------------------------------------------
// Supabase deduplication helpers
// ---------------------------------------------------------------------------

async function fetchExistingExternalIds(
  supabase: ReturnType<typeof createAdminClient>,
  externalIds: string[]
): Promise<Set<string>> {
  if (externalIds.length === 0) return new Set();

  const { data, error } = await supabase
    .from("tenders")
    .select("external_id")
    .in("external_id", externalIds);

  if (error) {
    console.error("[TED scraper] Error checking existing IDs:", error.message);
    return new Set();
  }

  return new Set(
    (data ?? [])
      .map((row: { external_id: string | null }) => row.external_id)
      .filter((id): id is string => id !== null)
  );
}

type TenderInsert = Omit<Tender, "id" | "created_at" | "updated_at"> & {
  ai_relevance_score?: number | null;
  ai_summary?: string | null;
  ai_keywords?: string[] | null;
  ai_win_probability?: number | null;
  powiat?: string | null;
  city?: string | null;
};

async function insertTenders(
  supabase: ReturnType<typeof createAdminClient>,
  tenders: Array<Partial<Tender>>
): Promise<{ inserted: number; insertError: string | null; insertedRows: Array<{ id: string; title: string; cpv_codes: string[]; voivodeship: string | null; source: string }> }> {
  if (tenders.length === 0) return { inserted: 0, insertError: null, insertedRows: [] };

  const rows: TenderInsert[] = tenders.map((t) => ({
    external_id: t.external_id ?? null,
    source: t.source ?? "TED",
    title: t.title ?? "Bez tytułu",
    description: t.description ?? null,
    cpv_codes: t.cpv_codes ?? [],
    budget_min: t.budget_min ?? null,
    budget_max: t.budget_max ?? null,
    currency: t.currency ?? "EUR",
    deadline_submission: t.deadline_submission ?? null,
    deadline_questions: t.deadline_questions ?? null,
    contracting_authority: t.contracting_authority ?? null,
    contracting_authority_address: t.contracting_authority_address ?? null,
    voivodeship: t.voivodeship ?? null,
    powiat: null,
    city: null,
    status: t.status ?? "active",
    ai_relevance_score: null,
    ai_summary: null,
    ai_keywords: null,
    ai_win_probability: null,
    source_url: t.source_url ?? null,
    published_at: t.published_at ?? null,
  }));

  const { data, error } = await supabase
    .from("tenders")
    .insert(rows)
    .select("id, title, cpv_codes, voivodeship, source");

  if (error) {
    return { inserted: 0, insertError: error.message, insertedRows: [] };
  }

  return { inserted: rows.length, insertError: null, insertedRows: data ?? [] };
}

// ---------------------------------------------------------------------------
// Route handler
// ---------------------------------------------------------------------------

export interface TedScraperResult {
  fetched: number;
  new_count: number;
  inserted: number;
  error?: string;
  insertError?: string;
}

export async function POST(
  request: NextRequest
): Promise<NextResponse<TedScraperResult>> {
  if (!isAuthorized(request)) {
    return NextResponse.json(
      { fetched: 0, new_count: 0, inserted: 0, error: "Brak autoryzacji" },
      { status: 401 }
    );
  }

  // 1. Fetch from TED API
  const { tenders: fetched, fetchError } = await fetchAndMapTedTenders(DAYS_BACK);

  if (fetchError && fetched.length === 0) {
    // Graceful degradation: API unavailable — return 200 so cron doesn't retry endlessly
    return NextResponse.json({
      fetched: 0,
      new_count: 0,
      inserted: 0,
      error: "TED API niedostępne",
    });
  }

  // 2. Deduplicate against DB
  const externalIds = fetched
    .map((t) => t.external_id)
    .filter((id): id is string => typeof id === "string");

  let existingIds: Set<string>;
  try {
    const supabase = createAdminClient();
    existingIds = await fetchExistingExternalIds(supabase, externalIds);
  } catch (err) {
    return NextResponse.json(
      {
        fetched: fetched.length,
        new_count: 0,
        inserted: 0,
        error: `Błąd połączenia z Supabase: ${err instanceof Error ? err.message : String(err)}`,
      },
      { status: 500 }
    );
  }

  const newTenders = fetched.filter(
    (t) => t.external_id && !existingIds.has(t.external_id)
  );

  // 3. Insert new tenders
  const supabase = createAdminClient();
  const { inserted, insertError, insertedRows } = await insertTenders(supabase, newTenders);

  // 4. Create in-app alerts for matching users (fire-and-forget)
  if (insertedRows.length > 0) {
    void notifyMatchingUsers(insertedRows)
  }

  const result: TedScraperResult = {
    fetched: fetched.length,
    new_count: newTenders.length,
    inserted,
  };

  if (fetchError) result.error = fetchError;
  if (insertError) result.insertError = insertError;

  return NextResponse.json(result);
}
