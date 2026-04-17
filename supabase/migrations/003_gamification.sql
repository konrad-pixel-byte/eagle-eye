-- ─── Gamification: XP, streaks, badges ────────────────────────────────────────

-- User XP state
create table if not exists user_xp (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  total_xp integer not null default 0,
  level integer not null default 1,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null,
  unique(user_id)
);

-- XP event log (audit trail)
create table if not exists xp_events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  event_type text not null, -- 'tender_view', 'daily_login', 'save_tender', 'streak_bonus', 'level_up'
  xp_earned integer not null,
  metadata jsonb default '{}' not null,
  created_at timestamptz default now() not null
);

-- Login streaks
create table if not exists user_streaks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  current_streak integer not null default 0,
  longest_streak integer not null default 0,
  last_login_date date,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null,
  unique(user_id)
);

-- Earned badges
create table if not exists user_badges (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  badge_id text not null,
  earned_at timestamptz default now() not null,
  unique(user_id, badge_id)
);

-- Tender view counts (for badge triggers)
create table if not exists user_tender_views (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  total_views integer not null default 0,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null,
  unique(user_id)
);

-- ─── Row Level Security ────────────────────────────────────────────────────────

alter table user_xp enable row level security;
alter table xp_events enable row level security;
alter table user_streaks enable row level security;
alter table user_badges enable row level security;
alter table user_tender_views enable row level security;

-- Users can read/write their own rows
create policy "user_xp_own" on user_xp for all using (auth.uid() = user_id);
create policy "xp_events_read_own" on xp_events for select using (auth.uid() = user_id);
create policy "xp_events_insert_own" on xp_events for insert with check (auth.uid() = user_id);
create policy "user_streaks_own" on user_streaks for all using (auth.uid() = user_id);
create policy "user_badges_own" on user_badges for all using (auth.uid() = user_id);
create policy "user_tender_views_own" on user_tender_views for all using (auth.uid() = user_id);

-- Service role bypass (scrapers, server actions with admin client)
create policy "user_xp_service" on user_xp for all to service_role using (true) with check (true);
create policy "xp_events_service" on xp_events for all to service_role using (true) with check (true);
create policy "user_streaks_service" on user_streaks for all to service_role using (true) with check (true);
create policy "user_badges_service" on user_badges for all to service_role using (true) with check (true);
create policy "user_tender_views_service" on user_tender_views for all to service_role using (true) with check (true);

-- ─── Indexes ──────────────────────────────────────────────────────────────────

create index if not exists xp_events_user_id_idx on xp_events(user_id);
create index if not exists xp_events_created_at_idx on xp_events(created_at desc);
create index if not exists user_badges_user_id_idx on user_badges(user_id);
