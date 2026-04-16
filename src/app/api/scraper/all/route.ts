import { NextRequest, NextResponse } from "next/server";
import type { BzpScraperResult } from "@/app/api/scraper/bzp/route";
import type { TedScraperResult } from "@/app/api/scraper/ted/route";

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
// Result types
// ---------------------------------------------------------------------------

type ScraperCallResult<T> = T | { error: string };

interface AllScrapersResult {
  bzp: ScraperCallResult<BzpScraperResult>;
  ted: ScraperCallResult<TedScraperResult>;
}

// ---------------------------------------------------------------------------
// Route handler
// ---------------------------------------------------------------------------

export async function POST(
  request: NextRequest
): Promise<NextResponse<AllScrapersResult>> {
  if (!isAuthorized(request)) {
    return NextResponse.json(
      {
        bzp: { error: "Brak autoryzacji" },
        ted: { error: "Brak autoryzacji" },
      },
      { status: 401 }
    );
  }

  const cronSecret = process.env.CRON_SECRET;
  const authHeader = `Bearer ${cronSecret}`;
  const baseUrl = new URL(request.url);

  // Call both scrapers in parallel; failures in either must not block the other
  const [bzpResult, tedResult] = await Promise.all([
    fetch(new URL("/api/scraper/bzp", baseUrl), {
      method: "POST",
      headers: { Authorization: authHeader },
    })
      .then((r): Promise<ScraperCallResult<BzpScraperResult>> => r.json())
      .catch(
        (err: unknown): ScraperCallResult<BzpScraperResult> => ({
          error: `Scraper BZP nie powiódł się: ${err instanceof Error ? err.message : String(err)}`,
        })
      ),

    fetch(new URL("/api/scraper/ted", baseUrl), {
      method: "POST",
      headers: { Authorization: authHeader },
    })
      .then((r): Promise<ScraperCallResult<TedScraperResult>> => r.json())
      .catch(
        (err: unknown): ScraperCallResult<TedScraperResult> => ({
          error: `Scraper TED nie powiódł się: ${err instanceof Error ? err.message : String(err)}`,
        })
      ),
  ]);

  return NextResponse.json({ bzp: bzpResult, ted: tedResult });
}
