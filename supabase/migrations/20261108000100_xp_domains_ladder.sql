-- Domains, athlete XP and rank gates, and the researched Thruster ladder.

create table public.domains (
  id text primary key,
  name text not null,
  position int not null default 0
);

insert into public.domains (id, name, position) values
  ('weightlifting', 'Weightlifting', 1),
  ('gymnastics', 'Gymnastics', 2),
  ('cardio', 'Cardio', 3);

alter table public.domains enable row level security;
create policy "Signed-in users read domains" on public.domains
  for select to authenticated using (true);
grant select on public.domains to authenticated;

alter table public.skills add column domain_id text references public.domains (id);
update public.skills set domain_id = 'weightlifting' where id = 'thruster';
alter table public.skills alter column domain_id set not null;

-- Highest athlete level ever reached: the displayed level never goes down.
-- No policy or grant: only the functions below touch it.
create table public.athlete_stats (
  user_id uuid primary key references auth.users (id) on delete cascade,
  peak_level int not null default 1 check (peak_level between 1 and 30)
);
alter table public.athlete_stats enable row level security;

-- Validating level n of a skill earns 100 x n XP, so a full skill is worth 46,500 XP.
-- Each domain weighs the same whatever its number of skills; domains without skills are ignored.
-- Athlete XP is on the scale of one skill: athlete level L needs 50 x L x (L - 1) XP.
-- Rank gates: level 11 needs every domain to average level 11, level 21 to average level 21.
create function public.athlete_status_for(p_user uuid)
returns jsonb
language plpgsql
stable
set search_path = ''
as $$
declare
  v_xp int;
  v_weakest numeric;
  v_domains jsonb;
  v_xp_level int;
  v_cap int;
  v_peak int;
begin
  with per_skill as (
    select s.id, s.domain_id,
      count(c.level)::int as validated,
      coalesce(sum(c.level), 0) as points
    from public.skills s
    left join public.level_completions c on c.skill_id = s.id and c.user_id = p_user
    group by s.id, s.domain_id
  ),
  per_domain as (
    select d.id, d.name, d.position,
      avg(least(p.validated + 1, 30)) as average,
      sum(p.points) / (count(*) * 465.0) as share
    from per_skill p
    join public.domains d on d.id = p.domain_id
    group by d.id, d.name, d.position
  )
  select
    coalesce(round(avg(share) * 46500)::int, 0),
    coalesce(min(average), 1),
    coalesce(
      jsonb_agg(
        jsonb_build_object('id', id, 'name', name, 'average', round(average, 2))
        order by position
      ),
      '[]'::jsonb
    )
  into v_xp, v_weakest, v_domains
  from per_domain;

  v_xp_level := least(30, floor((1 + sqrt(1 + v_xp::double precision * 8 / 100)) / 2)::int);
  v_cap := case when v_weakest < 11 then 10 when v_weakest < 21 then 20 else 30 end;

  select peak_level into v_peak from public.athlete_stats where user_id = p_user;

  return jsonb_build_object(
    'xp', v_xp,
    'xp_level', v_xp_level,
    'level', greatest(least(v_xp_level, v_cap), coalesce(v_peak, 1)),
    'domains', v_domains
  );
end;
$$;

revoke execute on function public.athlete_status_for(uuid) from public, anon, authenticated;

create function public.get_athlete_status()
returns jsonb
language plpgsql
stable
security definer
set search_path = ''
as $$
begin
  if auth.uid() is null then
    raise exception 'not_authenticated';
  end if;
  return public.athlete_status_for(auth.uid());
end;
$$;

revoke execute on function public.get_athlete_status() from public, anon;
grant execute on function public.get_athlete_status() to authenticated;

create or replace function public.validate_level(p_skill_id text, p_level int)
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

  insert into public.athlete_stats (user_id, peak_level)
  values (v_user, (public.athlete_status_for(v_user) ->> 'level')::int)
  on conflict (user_id) do update
    set peak_level = greatest(public.athlete_stats.peak_level, excluded.peak_level);
end;
$$;

-- Target 1RM anchored on male strength standards: level 1 = 30 kg, 10 = 52.5 (Novice),
-- 20 = 75 (Intermediate), 25 = 100 (Advanced), 30 = 130 (Elite).
-- Reps: drawn once between 3 and 12, never the same twice in a row, fixed for everyone.
-- Working weight: target x (37 - reps) / 36 (Brzycki), in 2.5 kg steps.
update public.skill_levels as l
set target_1rm_kg = v.target_1rm_kg, reps = v.reps, weight_kg = v.weight_kg
from (values
  (1, 30.0, 6, 25.0),
  (2, 32.5, 12, 22.5),
  (3, 35.0, 10, 27.5),
  (4, 37.5, 6, 32.5),
  (5, 40.0, 7, 32.5),
  (6, 42.5, 9, 32.5),
  (7, 45.0, 7, 37.5),
  (8, 47.5, 12, 32.5),
  (9, 50.0, 3, 47.5),
  (10, 52.5, 12, 37.5),
  (11, 55.0, 6, 47.5),
  (12, 57.0, 7, 47.5),
  (13, 59.5, 12, 42.5),
  (14, 61.5, 5, 55.0),
  (15, 64.0, 9, 50.0),
  (16, 66.0, 12, 45.0),
  (17, 68.5, 3, 65.0),
  (18, 70.5, 5, 62.5),
  (19, 73.0, 7, 60.0),
  (20, 75.0, 9, 57.5),
  (21, 80.0, 10, 60.0),
  (22, 85.0, 6, 72.5),
  (23, 90.0, 10, 67.5),
  (24, 95.0, 8, 77.5),
  (25, 100.0, 7, 82.5),
  (26, 106.0, 12, 72.5),
  (27, 112.0, 4, 102.5),
  (28, 118.0, 11, 85.0),
  (29, 124.0, 5, 110.0),
  (30, 130.0, 11, 95.0)
) as v (level, target_1rm_kg, reps, weight_kg)
where l.skill_id = 'thruster' and l.level = v.level;
