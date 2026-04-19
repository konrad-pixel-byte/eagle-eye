-- ============================================================
-- Stripe webhook idempotency: dedupe replayed events.
-- Stripe retries webhooks on non-2xx; without this table,
-- a replayed event double-updates subscription state.
-- ============================================================

create table if not exists public.stripe_events (
  event_id text primary key,
  event_type text not null,
  processed_at timestamptz not null default now()
);

alter table public.stripe_events enable row level security;

-- No policies: only service_role writes via webhook handler.

create index if not exists idx_stripe_events_processed_at
  on public.stripe_events(processed_at desc);
