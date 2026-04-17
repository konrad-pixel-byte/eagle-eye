-- Atomic XP increment — avoids read-modify-write race condition
-- Called from awardXp() server action instead of manual upsert

create or replace function increment_user_xp(
  p_user_id uuid,
  p_xp integer
)
returns table(new_xp integer, new_level integer)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_new_xp integer;
  v_new_level integer;
begin
  insert into user_xp (user_id, total_xp, level, updated_at)
  values (p_user_id, p_xp, 1, now())
  on conflict (user_id) do update
    set total_xp = user_xp.total_xp + p_xp,
        updated_at = now()
  returning total_xp into v_new_xp;

  -- Compute level from XP thresholds (mirrors LEVELS array in gamification.ts)
  v_new_level :=
    case
      when v_new_xp >= 2700 then 10
      when v_new_xp >= 2300 then 9
      when v_new_xp >= 1900 then 8
      when v_new_xp >= 1400 then 7
      when v_new_xp >= 1000 then 6
      when v_new_xp >= 700  then 5
      when v_new_xp >= 450  then 4
      when v_new_xp >= 250  then 3
      when v_new_xp >= 100  then 2
      else 1
    end;

  -- Update level if changed
  update user_xp set level = v_new_level where user_id = p_user_id and level <> v_new_level;

  return query select v_new_xp, v_new_level;
end;
$$;

-- Atomic tender view increment
create or replace function increment_tender_views(p_user_id uuid)
returns integer
language plpgsql
security definer
set search_path = public
as $$
declare
  v_new_views integer;
begin
  insert into user_tender_views (user_id, total_views, updated_at)
  values (p_user_id, 1, now())
  on conflict (user_id) do update
    set total_views = user_tender_views.total_views + 1,
        updated_at = now()
  returning total_views into v_new_views;

  return v_new_views;
end;
$$;

-- Grant execute to service_role only
revoke execute on function increment_user_xp(uuid, integer) from public;
grant execute on function increment_user_xp(uuid, integer) to service_role;

revoke execute on function increment_tender_views(uuid) from public;
grant execute on function increment_tender_views(uuid) to service_role;
