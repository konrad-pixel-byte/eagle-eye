-- ─── Gamification Phase 2: monthly challenge completions ──────────────────────

-- Tracks which monthly challenges a user has already claimed this month.
-- Challenge definitions live in code (gamification.ts) — no config table needed.
create table if not exists user_monthly_achievements (
  id           uuid        primary key default gen_random_uuid(),
  user_id      uuid        not null references auth.users(id) on delete cascade,
  challenge_id text        not null,
  month_key    text        not null, -- 'YYYY-MM', e.g. '2026-04'
  xp_awarded   integer     not null default 0,
  earned_at    timestamptz not null default now(),
  unique(user_id, challenge_id, month_key)
);

alter table user_monthly_achievements enable row level security;

create policy "monthly_achievements_own" on user_monthly_achievements
  for all using (auth.uid() = user_id);

create policy "monthly_achievements_service" on user_monthly_achievements
  for all to service_role using (true) with check (true);

create index if not exists monthly_achievements_user_id_idx
  on user_monthly_achievements(user_id, month_key);

-- ─── Total AI calls counter (for AI badges across all days) ───────────────────

create table if not exists user_ai_totals (
  user_id     uuid    primary key references auth.users(id) on delete cascade,
  total_calls integer not null default 0,
  updated_at  timestamptz not null default now()
);

alter table user_ai_totals enable row level security;

create policy "ai_totals_own_read" on user_ai_totals
  for select using (auth.uid() = user_id);

create policy "ai_totals_service" on user_ai_totals
  for all to service_role using (true) with check (true);

-- Atomic increment function for AI totals
create or replace function public.increment_ai_total(p_user_id uuid)
returns integer
language plpgsql
security definer
set search_path = public
as $$
declare
  v_new integer;
begin
  insert into public.user_ai_totals (user_id, total_calls, updated_at)
  values (p_user_id, 1, now())
  on conflict (user_id) do update
    set total_calls = user_ai_totals.total_calls + 1,
        updated_at  = now()
  returning total_calls into v_new;
  return v_new;
end;
$$;

grant execute on function public.increment_ai_total to authenticated, service_role;
