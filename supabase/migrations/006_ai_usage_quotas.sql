-- ============================================================
-- AI usage quotas: per-user daily counters for AI endpoint calls.
-- Used to rate-limit and prevent credit abuse.
-- ============================================================

create table if not exists public.ai_usage (
  user_id uuid not null references public.profiles(id) on delete cascade,
  usage_date date not null default current_date,
  endpoint text not null check (endpoint in ('score', 'summary', 'bid-coach')),
  call_count integer not null default 0,
  primary key (user_id, usage_date, endpoint)
);

alter table public.ai_usage enable row level security;

create policy "Users can view own AI usage" on public.ai_usage
  for select using (auth.uid() = user_id);

create index if not exists idx_ai_usage_user_date on public.ai_usage(user_id, usage_date desc);

-- Atomic increment with quota check. Returns (allowed, new_count).
create or replace function public.increment_ai_usage(
  p_user_id uuid,
  p_endpoint text,
  p_limit integer
)
returns table(allowed boolean, new_count integer)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_current integer;
begin
  insert into public.ai_usage (user_id, usage_date, endpoint, call_count)
  values (p_user_id, current_date, p_endpoint, 0)
  on conflict (user_id, usage_date, endpoint) do nothing;

  select call_count into v_current
    from public.ai_usage
    where user_id = p_user_id
      and usage_date = current_date
      and endpoint = p_endpoint
    for update;

  if v_current >= p_limit then
    return query select false, v_current;
    return;
  end if;

  update public.ai_usage
    set call_count = call_count + 1
    where user_id = p_user_id
      and usage_date = current_date
      and endpoint = p_endpoint
    returning call_count into v_current;

  return query select true, v_current;
end;
$$;

grant execute on function public.increment_ai_usage to authenticated, service_role;
