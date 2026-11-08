-- Skill progression: each skill has 30 levels, each validated by one set.

create table public.skills (
  id text primary key,
  name text not null,
  position int not null default 0
);

create table public.skill_levels (
  skill_id text not null references public.skills (id) on delete cascade,
  level int not null check (level between 1 and 30),
  target_1rm_kg numeric(5, 2) not null check (target_1rm_kg > 0),
  reps int not null check (reps > 0),
  weight_kg numeric(5, 2) not null check (weight_kg > 0),
  primary key (skill_id, level)
);

-- One row per validated level. A user's level on a skill is derived from it (last validated + 1).
create table public.level_completions (
  user_id uuid not null references auth.users (id) on delete cascade,
  skill_id text not null,
  level int not null,
  completed_at timestamptz not null default now(),
  primary key (user_id, skill_id, level),
  foreign key (skill_id, level) references public.skill_levels (skill_id, level) on delete cascade
);

alter table public.skills enable row level security;
alter table public.skill_levels enable row level security;
alter table public.level_completions enable row level security;

create policy "Signed-in users read skills" on public.skills
  for select to authenticated using (true);
create policy "Signed-in users read skill levels" on public.skill_levels
  for select to authenticated using (true);
create policy "Users read their own completions" on public.level_completions
  for select to authenticated using ((select auth.uid()) = user_id);

grant select on public.skills, public.skill_levels, public.level_completions to authenticated;

-- The only way to write a completion: levels must be validated in order.
-- Validating an already validated level does nothing (double submit, retry after a lost response).
create function public.validate_level(p_skill_id text, p_level int)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_user uuid := auth.uid();
  v_done int;
begin
  if v_user is null then
    raise exception 'not_authenticated';
  end if;

  select coalesce(max(level), 0) into v_done
  from public.level_completions
  where user_id = v_user and skill_id = p_skill_id;

  if p_level <= v_done then
    return;
  end if;
  if p_level <> v_done + 1 then
    raise exception 'level_locked';
  end if;

  insert into public.level_completions (user_id, skill_id, level)
  values (v_user, p_skill_id, p_level)
  on conflict do nothing;
end;
$$;

revoke execute on function public.validate_level(text, int) from public, anon;
grant execute on function public.validate_level(text, int) to authenticated;

insert into public.skills (id, name, position) values ('thruster', 'Thruster', 1);

-- Working weight = target 1RM x the share of 1RM doable for that many reps
-- (10 reps 78%, 5 reps 89%, 3 reps 94%, 1 rep 100%), in 2.5 kg steps.
insert into public.skill_levels (skill_id, level, target_1rm_kg, reps, weight_kg)
select 'thruster', v.level, v.target_1rm_kg, v.reps, v.weight_kg
from (values
  -- Scaled
  (1, 25.0, 10, 20.0),
  (2, 32.5, 10, 25.0),
  (3, 35.0, 10, 27.5),
  (4, 37.5, 10, 30.0),
  (5, 42.5, 10, 32.5),
  (6, 45.0, 10, 35.0),
  (7, 47.5, 10, 37.5),
  (8, 50.0, 10, 40.0),
  (9, 55.0, 10, 42.5),
  (10, 57.5, 10, 45.0),
  -- Intermediate
  (11, 60.0, 10, 47.5),
  (12, 65.0, 10, 50.0),
  (13, 67.5, 10, 52.5),
  (14, 70.0, 10, 55.0),
  (15, 72.5, 10, 57.5),
  (16, 77.5, 10, 60.0),
  (17, 80.0, 10, 62.5),
  (18, 82.5, 10, 65.0),
  (19, 87.5, 10, 67.5),
  (20, 90.0, 10, 70.0),
  -- Rx
  (21, 95.0, 5, 85.0),
  (22, 97.5, 5, 87.5),
  (23, 102.5, 5, 90.0),
  (24, 105.0, 5, 92.5),
  (25, 110.0, 5, 97.5),
  (26, 115.0, 3, 107.5),
  (27, 117.5, 3, 110.0),
  (28, 122.5, 3, 115.0),
  (29, 125.0, 3, 117.5),
  (30, 130.0, 1, 130.0)
) as v (level, target_1rm_kg, reps, weight_kg);
