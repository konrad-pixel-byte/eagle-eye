-- Eagle Eye — Initial Schema Migration
-- Tables: profiles, workspaces, tenders, alerts, kfs_nabory, bur_nabory, pup_registry, psf_operators

-- Enable required extensions
create extension if not exists "uuid-ossp";

-- ============================================================
-- 1. PROFILES (extends Supabase auth.users)
-- ============================================================
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  full_name text,
  company_name text,
  phone text,
  avatar_url text,
  subscription_tier text not null default 'free' check (subscription_tier in ('free', 'basic', 'pro', 'enterprise')),
  onboarding_completed boolean not null default false,
  preferred_regions text[] default '{}',
  preferred_cpv_codes text[] default '{}',
  preferred_keywords text[] default '{}',
  budget_min numeric,
  budget_max numeric,
  notification_email boolean not null default true,
  notification_push boolean not null default false,
  notification_sms boolean not null default false,
  kfs_priorities text[] default '{}',
  xp integer not null default 0,
  level integer not null default 1,
  streak_days integer not null default 0,
  last_login_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "Users can view own profile" on public.profiles
  for select using (auth.uid() = id);

create policy "Users can update own profile" on public.profiles
  for update using (auth.uid() = id);

-- Auto-create profile on sign-up
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data ->> 'full_name', '')
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ============================================================
-- 2. WORKSPACES
-- ============================================================
create table public.workspaces (
  id uuid primary key default uuid_generate_v4(),
  owner_id uuid not null references public.profiles(id) on delete cascade,
  name text not null default 'Moja Przestrzeń',
  description text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.workspaces enable row level security;

create policy "Users can view own workspaces" on public.workspaces
  for select using (auth.uid() = owner_id);

create policy "Users can create workspaces" on public.workspaces
  for insert with check (auth.uid() = owner_id);

create policy "Users can update own workspaces" on public.workspaces
  for update using (auth.uid() = owner_id);

-- ============================================================
-- 3. TENDERS (przetargi)
-- ============================================================
create table public.tenders (
  id uuid primary key default uuid_generate_v4(),
  external_id text unique,
  source text not null check (source in ('BZP', 'TED', 'BAZA_KONKURENCYJNOSCI')),
  title text not null,
  description text,
  full_text text,
  cpv_codes text[] not null default '{}',
  budget_min numeric,
  budget_max numeric,
  currency text not null default 'PLN',
  deadline_submission timestamptz,
  deadline_questions timestamptz,
  contracting_authority text,
  contracting_authority_address text,
  voivodeship text,
  powiat text,
  city text,
  status text not null default 'active' check (status in ('active', 'expired', 'awarded', 'cancelled')),
  ai_relevance_score integer check (ai_relevance_score between 0 and 100),
  ai_summary text,
  ai_keywords text[] default '{}',
  ai_win_probability numeric check (ai_win_probability between 0 and 1),
  documents_url text,
  source_url text,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.tenders enable row level security;

-- Tenders are readable by all authenticated users
create policy "Authenticated users can view tenders" on public.tenders
  for select using (auth.role() = 'authenticated');

-- Indexes for common queries
create index idx_tenders_status on public.tenders(status);
create index idx_tenders_source on public.tenders(source);
create index idx_tenders_voivodeship on public.tenders(voivodeship);
create index idx_tenders_deadline on public.tenders(deadline_submission);
create index idx_tenders_published on public.tenders(published_at desc);
create index idx_tenders_cpv on public.tenders using gin(cpv_codes);
create index idx_tenders_budget on public.tenders(budget_min, budget_max);

-- ============================================================
-- 4. SAVED TENDERS (user bookmarks)
-- ============================================================
create table public.saved_tenders (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  tender_id uuid not null references public.tenders(id) on delete cascade,
  workspace_id uuid references public.workspaces(id) on delete set null,
  notes text,
  created_at timestamptz not null default now(),
  unique(user_id, tender_id)
);

alter table public.saved_tenders enable row level security;

create policy "Users can view own saved tenders" on public.saved_tenders
  for select using (auth.uid() = user_id);

create policy "Users can save tenders" on public.saved_tenders
  for insert with check (auth.uid() = user_id);

create policy "Users can delete own saved tenders" on public.saved_tenders
  for delete using (auth.uid() = user_id);

-- ============================================================
-- 5. ALERTS
-- ============================================================
create table public.alerts (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  tender_id uuid references public.tenders(id) on delete cascade,
  channel text not null check (channel in ('email', 'sms', 'push', 'webhook')),
  title text not null,
  body text,
  read boolean not null default false,
  sent_at timestamptz not null default now(),
  opened_at timestamptz,
  clicked_at timestamptz
);

alter table public.alerts enable row level security;

create policy "Users can view own alerts" on public.alerts
  for select using (auth.uid() = user_id);

create policy "Users can update own alerts" on public.alerts
  for update using (auth.uid() = user_id);

create index idx_alerts_user on public.alerts(user_id, read, sent_at desc);

-- ============================================================
-- 6. PUP REGISTRY (Powiatowe Urzędy Pracy) — must be before kfs_nabory
-- ============================================================
create table public.pup_registry (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  voivodeship text not null,
  powiat text not null,
  city text,
  address text,
  phone text,
  email text,
  website text,
  lat numeric,
  lng numeric,
  created_at timestamptz not null default now()
);

alter table public.pup_registry enable row level security;

create policy "Authenticated users can view PUP" on public.pup_registry
  for select using (auth.role() = 'authenticated');

create index idx_pup_voivodeship on public.pup_registry(voivodeship);

-- ============================================================
-- 7. PSF OPERATORS (Podmiotowy System Finansowania) — must be before bur_nabory
-- ============================================================
create table public.psf_operators (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  voivodeship text not null,
  city text,
  address text,
  phone text,
  email text,
  website text,
  coverage_area text,
  created_at timestamptz not null default now()
);

alter table public.psf_operators enable row level security;

create policy "Authenticated users can view PSF" on public.psf_operators
  for select using (auth.role() = 'authenticated');

create index idx_psf_voivodeship on public.psf_operators(voivodeship);

-- ============================================================
-- 8. KFS NABORY (Krajowy Fundusz Szkoleniowy)
-- ============================================================
create table public.kfs_nabory (
  id uuid primary key default uuid_generate_v4(),
  pup_id uuid references public.pup_registry(id),
  pup_name text not null,
  voivodeship text not null,
  powiat text not null,
  city text,
  year integer not null,
  round_number integer,
  status text not null default 'active' check (status in ('announced', 'active', 'closed', 'results')),
  total_budget numeric,
  remaining_budget numeric,
  application_start timestamptz,
  application_end timestamptz,
  priorities text[] default '{}',
  target_groups text[] default '{}',
  max_per_employer numeric,
  source_url text,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.kfs_nabory enable row level security;

create policy "Authenticated users can view KFS" on public.kfs_nabory
  for select using (auth.role() = 'authenticated');

create index idx_kfs_voivodeship on public.kfs_nabory(voivodeship);
create index idx_kfs_status on public.kfs_nabory(status);
create index idx_kfs_dates on public.kfs_nabory(application_start, application_end);

-- ============================================================
-- 9. BUR NABORY (Baza Usług Rozwojowych)
-- ============================================================
create table public.bur_nabory (
  id uuid primary key default uuid_generate_v4(),
  operator_id uuid references public.psf_operators(id),
  operator_name text not null,
  voivodeship text not null,
  program_name text,
  status text not null default 'active' check (status in ('announced', 'active', 'closed', 'suspended')),
  total_budget numeric,
  remaining_budget numeric,
  funding_percentage integer check (funding_percentage between 0 and 100),
  application_start timestamptz,
  application_end timestamptz,
  eligible_categories text[] default '{}',
  eligible_company_sizes text[] default '{}',
  max_per_company numeric,
  source_url text,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.bur_nabory enable row level security;

create policy "Authenticated users can view BUR" on public.bur_nabory
  for select using (auth.role() = 'authenticated');

create index idx_bur_voivodeship on public.bur_nabory(voivodeship);
create index idx_bur_status on public.bur_nabory(status);

-- ============================================================
-- Updated_at trigger function
-- ============================================================
create or replace function public.update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Apply updated_at triggers
create trigger update_profiles_updated_at before update on public.profiles
  for each row execute function public.update_updated_at();

create trigger update_workspaces_updated_at before update on public.workspaces
  for each row execute function public.update_updated_at();

create trigger update_tenders_updated_at before update on public.tenders
  for each row execute function public.update_updated_at();

create trigger update_kfs_nabory_updated_at before update on public.kfs_nabory
  for each row execute function public.update_updated_at();

create trigger update_bur_nabory_updated_at before update on public.bur_nabory
  for each row execute function public.update_updated_at();
