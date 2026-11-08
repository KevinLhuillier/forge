-- Lets an athlete go back to an earlier level of a skill, e.g. after a long break.
-- p_level becomes the skill's current level: it and every level above must be validated again.
-- XP is derived from completions, so it drops now and is earned back on re-validation.
-- The peak is recomputed: a chosen downgrade lowers the athlete level, unlike a new skill.
-- Calling it again with the same level does nothing (double submit, retry after a lost response).
create function public.downgrade_skill(p_skill_id text, p_level int)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_user uuid := auth.uid();
begin
  if v_user is null then
    raise exception 'not_authenticated';
  end if;

  delete from public.level_completions
  where user_id = v_user and skill_id = p_skill_id and level >= p_level;

  if not found then
    return;
  end if;

  delete from public.athlete_stats where user_id = v_user;

  insert into public.athlete_stats (user_id, peak_level)
  values (v_user, (public.athlete_status_for(v_user) ->> 'level')::int);
end;
$$;

revoke execute on function public.downgrade_skill(text, int) from public, anon;
grant execute on function public.downgrade_skill(text, int) to authenticated;
