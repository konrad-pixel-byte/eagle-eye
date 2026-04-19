import { CheckCircle2, XCircle, AlertTriangle, Clock } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";
export const revalidate = 30;

export const metadata = {
  title: "Status systemu",
  description:
    "Status operacyjny Eagle Eye — baza danych, scraperzy BZP/TED, powiadomienia.",
  robots: { index: true, follow: false },
};

type CronCheck = {
  status: "ok" | "stale" | "fail" | "never_run";
  last_run_at: string | null;
  age_h?: number;
};

type HealthResponse = {
  status: "ok" | "degraded";
  checks: {
    db: string;
    scrapers: string;
    crons: Record<string, CronCheck>;
  };
  last_tender_at: string | null;
  response_ms: number;
  timestamp: string;
};

async function fetchHealth(): Promise<HealthResponse | null> {
  const base =
    process.env.NEXT_PUBLIC_APP_URL ?? "https://eagle-eye.hatedapps.pl";
  try {
    const res = await fetch(`${base}/api/health`, { cache: "no-store" });
    return (await res.json()) as HealthResponse;
  } catch {
    return null;
  }
}

const JOB_LABELS: Record<string, string> = {
  "scraper-bzp": "Scraper BZP",
  "scraper-ted": "Scraper TED",
  "notifications-daily": "Digest dzienny",
};

function StatusPill({
  ok,
  label,
}: {
  ok: boolean;
  label: string;
}) {
  return (
    <span
      className={
        ok
          ? "inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 text-xs font-medium text-emerald-400"
          : "inline-flex items-center gap-1.5 rounded-full border border-red-500/30 bg-red-500/10 px-2.5 py-0.5 text-xs font-medium text-red-400"
      }
    >
      {ok ? <CheckCircle2 className="size-3" /> : <XCircle className="size-3" />}
      {label}
    </span>
  );
}

export default async function StatusPage() {
  const health = await fetchHealth();

  if (!health) {
    return (
      <div className="mx-auto flex min-h-[70dvh] max-w-2xl flex-col items-center justify-center px-6 text-center">
        <AlertTriangle className="mb-4 size-10 text-amber-400" />
        <h1 className="text-2xl font-bold">Nie udało się odczytać statusu</h1>
        <p className="mt-2 text-sm text-zinc-500">
          Endpoint /api/health jest nieosiągalny. Spróbuj ponownie za chwilę.
        </p>
      </div>
    );
  }

  const overallOk = health.status === "ok";
  const dbOk = health.checks.db === "ok";
  const scrapersOk = health.checks.scrapers === "ok";

  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <Link
        href="/"
        className="text-xs text-zinc-500 hover:text-zinc-300"
      >
        ← Eagle Eye
      </Link>

      <div className="mt-4 flex items-center gap-3">
        <div
          className={
            overallOk
              ? "flex size-10 items-center justify-center rounded-full bg-emerald-500/10"
              : "flex size-10 items-center justify-center rounded-full bg-red-500/10"
          }
        >
          {overallOk ? (
            <CheckCircle2 className="size-5 text-emerald-400" />
          ) : (
            <XCircle className="size-5 text-red-400" />
          )}
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            {overallOk ? "Wszystkie systemy działają" : "System zdegradowany"}
          </h1>
          <p className="text-xs text-zinc-500">
            Sprawdzono {new Date(health.timestamp).toLocaleString("pl-PL")} •
            odpowiedź w {health.response_ms}ms
          </p>
        </div>
      </div>

      <div className="mt-8 space-y-3">
        <Row label="Baza danych" ok={dbOk} />
        <Row
          label="Scraperzy (świeżość danych)"
          ok={scrapersOk}
          hint={
            health.last_tender_at
              ? `Ostatni przetarg: ${new Date(health.last_tender_at).toLocaleString("pl-PL")}`
              : undefined
          }
        />

        <div className="border-t border-zinc-800 pt-4">
          <h2 className="mb-3 text-sm font-semibold text-zinc-300">
            Zadania cykliczne
          </h2>
          <div className="space-y-2">
            {Object.entries(health.checks.crons).map(([job, check]) => (
              <CronRow
                key={job}
                label={JOB_LABELS[job] ?? job}
                check={check}
              />
            ))}
          </div>
        </div>
      </div>

      <p className="mt-10 text-center text-xs text-zinc-600">
        Strona odświeża się automatycznie co 30 sekund.
      </p>
    </div>
  );
}

function Row({
  label,
  ok,
  hint,
}: {
  label: string;
  ok: boolean;
  hint?: string;
}) {
  return (
    <div className="flex items-center justify-between rounded-lg border border-zinc-800 bg-zinc-900/40 px-4 py-3">
      <div>
        <p className="text-sm font-medium text-zinc-200">{label}</p>
        {hint && <p className="mt-0.5 text-xs text-zinc-500">{hint}</p>}
      </div>
      <StatusPill ok={ok} label={ok ? "Operacyjny" : "Problem"} />
    </div>
  );
}

function CronRow({ label, check }: { label: string; check: CronCheck }) {
  const ok = check.status === "ok";
  const statusLabel: Record<CronCheck["status"], string> = {
    ok: "OK",
    stale: "Opóźniony",
    fail: "Błąd",
    never_run: "Brak danych",
  };

  return (
    <div className="flex items-center justify-between rounded-lg border border-zinc-800 bg-zinc-900/40 px-4 py-3">
      <div className="flex items-center gap-2">
        <Clock className="size-4 text-zinc-500" />
        <div>
          <p className="text-sm font-medium text-zinc-200">{label}</p>
          {check.last_run_at && (
            <p className="mt-0.5 text-xs text-zinc-500">
              Ostatnio: {new Date(check.last_run_at).toLocaleString("pl-PL")}
              {check.age_h !== undefined && ` (${check.age_h}h temu)`}
            </p>
          )}
        </div>
      </div>
      <StatusPill ok={ok} label={statusLabel[check.status]} />
    </div>
  );
}
