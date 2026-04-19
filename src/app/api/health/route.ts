import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Public uptime probe. Returns 200 when DB is reachable and scrapers are
// producing data within the last 48h; returns 503 otherwise so external
// monitors (UptimeRobot, BetterStack) can page on degradation.
export async function GET() {
  const started = Date.now();
  const admin = createAdminClient();

  let dbOk = false;
  let lastTenderAt: string | null = null;
  let staleTenders = false;

  try {
    const { data, error } = await admin
      .from("tenders")
      .select("created_at")
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle<{ created_at: string }>();

    if (!error) {
      dbOk = true;
      lastTenderAt = data?.created_at ?? null;
      if (lastTenderAt) {
        const ageMs = Date.now() - new Date(lastTenderAt).getTime();
        staleTenders = ageMs > 48 * 60 * 60 * 1000;
      }
    }
  } catch {
    dbOk = false;
  }

  const healthy = dbOk && !staleTenders;
  const body = {
    status: healthy ? "ok" : "degraded",
    checks: {
      db: dbOk ? "ok" : "fail",
      scrapers: staleTenders ? "stale" : dbOk ? "ok" : "unknown",
    },
    last_tender_at: lastTenderAt,
    response_ms: Date.now() - started,
    timestamp: new Date().toISOString(),
  };

  return NextResponse.json(body, {
    status: healthy ? 200 : 503,
    headers: { "Cache-Control": "no-store, max-age=0" },
  });
}
