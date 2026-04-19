import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Max age per cron job before the job is considered stale. Scrapers and digest
// run daily, so anything beyond 25h (1h slack) means something broke.
const CRON_STALE_MS: Record<string, number> = {
  "scraper-bzp": 25 * 60 * 60 * 1000,
  "scraper-ted": 25 * 60 * 60 * 1000,
  "notifications-daily": 25 * 60 * 60 * 1000,
};

type Heartbeat = {
  job_name: string;
  last_run_at: string;
  last_status: "ok" | "fail";
};

type CronCheckEntry = {
  status: "ok" | "stale" | "fail" | "never_run";
  last_run_at: string | null;
  age_h?: number;
};

// Public uptime probe. Returns 200 when DB is reachable, tender feed fresh
// within 48h, and all tracked crons have reported ok within their windows.
// Returns 503 otherwise so external monitors (UptimeRobot, BetterStack)
// can page on degradation.
export async function GET() {
  const started = Date.now();
  const admin = createAdminClient();

  let dbOk = false;
  let lastTenderAt: string | null = null;
  let staleTenders = false;
  const cronChecks: Record<string, CronCheckEntry> = {};
  let cronAllOk = true;

  try {
    const [tenderResult, heartbeatResult] = await Promise.all([
      admin
        .from("tenders")
        .select("created_at")
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle<{ created_at: string }>(),
      admin
        .from("cron_heartbeats")
        .select("job_name, last_run_at, last_status"),
    ]);

    if (!tenderResult.error) {
      dbOk = true;
      lastTenderAt = tenderResult.data?.created_at ?? null;
      if (lastTenderAt) {
        const ageMs = Date.now() - new Date(lastTenderAt).getTime();
        staleTenders = ageMs > 48 * 60 * 60 * 1000;
      }
    }

    const heartbeatByJob = new Map<string, Heartbeat>(
      ((heartbeatResult.data ?? []) as Heartbeat[]).map((h) => [h.job_name, h])
    );

    for (const [job, maxAgeMs] of Object.entries(CRON_STALE_MS)) {
      const hb = heartbeatByJob.get(job);
      if (!hb) {
        cronChecks[job] = { status: "never_run", last_run_at: null };
        cronAllOk = false;
        continue;
      }
      const ageMs = Date.now() - new Date(hb.last_run_at).getTime();
      const ageH = Math.round((ageMs / (1000 * 60 * 60)) * 10) / 10;
      if (hb.last_status === "fail") {
        cronChecks[job] = { status: "fail", last_run_at: hb.last_run_at, age_h: ageH };
        cronAllOk = false;
      } else if (ageMs > maxAgeMs) {
        cronChecks[job] = { status: "stale", last_run_at: hb.last_run_at, age_h: ageH };
        cronAllOk = false;
      } else {
        cronChecks[job] = { status: "ok", last_run_at: hb.last_run_at, age_h: ageH };
      }
    }
  } catch {
    dbOk = false;
    cronAllOk = false;
  }

  const healthy = dbOk && !staleTenders && cronAllOk;
  const body = {
    status: healthy ? "ok" : "degraded",
    checks: {
      db: dbOk ? "ok" : "fail",
      scrapers: staleTenders ? "stale" : dbOk ? "ok" : "unknown",
      crons: cronChecks,
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
