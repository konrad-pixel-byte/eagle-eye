import { createAdminClient } from "@/lib/supabase/admin";

export type CronJobName =
  | "scraper-bzp"
  | "scraper-ted"
  | "scraper-all"
  | "notifications-daily";

interface HeartbeatArgs {
  job: CronJobName;
  status: "ok" | "fail";
  durationMs?: number;
  details?: Record<string, unknown>;
}

export async function recordCronHeartbeat({
  job,
  status,
  durationMs,
  details,
}: HeartbeatArgs): Promise<void> {
  try {
    const admin = createAdminClient();
    const { error } = await admin.rpc("record_cron_heartbeat", {
      p_job_name: job,
      p_status: status,
      p_duration_ms: durationMs ?? null,
      p_details: details ?? null,
    });
    if (error) {
      console.error(`[cron-heartbeat] ${job}:`, error.message);
    }
  } catch (err) {
    console.error(
      `[cron-heartbeat] ${job}:`,
      err instanceof Error ? err.message : err
    );
  }
}
