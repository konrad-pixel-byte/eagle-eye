-- ============================================================
-- Cron heartbeats: one row per cron job, updated on every run.
-- Lets the admin panel and /api/health detect silently-broken crons.
-- ============================================================

create table if not exists public.cron_heartbeats (
  job_name text primary key,
  last_run_at timestamptz not null default now(),
  last_status text not null check (last_status in ('ok', 'fail')),
  duration_ms integer,
  details jsonb
);

alter table public.cron_heartbeats enable row level security;

-- No public read: admin pulls via service_role.

create or replace function public.record_cron_heartbeat(
  p_job_name text,
  p_status text,
  p_duration_ms integer default null,
  p_details jsonb default null
)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.cron_heartbeats (job_name, last_run_at, last_status, duration_ms, details)
  values (p_job_name, now(), p_status, p_duration_ms, p_details)
  on conflict (job_name) do update set
    last_run_at = excluded.last_run_at,
    last_status = excluded.last_status,
    duration_ms = excluded.duration_ms,
    details = excluded.details;
end;
$$;

grant execute on function public.record_cron_heartbeat to service_role;
