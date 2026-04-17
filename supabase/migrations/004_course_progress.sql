-- ─── Akademia ZP: course progress ────────────────────────────────────────────

create table if not exists course_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  module_id integer not null,
  lesson_id integer not null,
  completed_at timestamptz default now() not null,
  unique(user_id, module_id, lesson_id)
);

alter table course_progress enable row level security;

create policy "course_progress_own" on course_progress
  for all using (auth.uid() = user_id);

create policy "course_progress_service" on course_progress
  for all to service_role using (true) with check (true);

create index if not exists course_progress_user_id_idx on course_progress(user_id);
