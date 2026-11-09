-- Todos get a manual order within their list; events get an end and can span several days.

alter table public.todos add column sort_order integer not null default 0;

update public.todos as todo
set sort_order = ranked.rank
from (
  select id, row_number() over (partition by list_id order by created_at) as rank
  from public.todos
) as ranked
where todo.id = ranked.id;

alter table public.events rename column event_date to start_date;

alter table public.events
  add column end_date date,
  add column end_time time;

update public.events set end_date = start_date;

alter table public.events
  alter column end_date set not null,
  add constraint events_end_after_start check (
    end_date >= start_date
    and (end_time is null or start_time is not null)
    and (end_date > start_date or end_time is null or end_time > start_time)
  );

-- Saves a todo and its slot in the calendar together (p_id null creates, p_plan_date null unplans).
-- A new todo goes last in its list. Runs with the caller's rights, like the version it replaces.
drop function public.save_todo(uuid, uuid, text, text, date, date, time);

create function public.save_todo(
  p_id uuid,
  p_list_id uuid,
  p_title text,
  p_description text,
  p_due_date date,
  p_plan_date date,
  p_plan_time time,
  p_plan_end_date date,
  p_plan_end_time time
)
returns uuid
language plpgsql
set search_path = ''
as $$
declare
  v_id uuid;
begin
  if p_id is null then
    insert into public.todos (list_id, title, description, due_date, sort_order)
    select p_list_id, p_title, p_description, p_due_date, coalesce(max(sort_order), 0) + 1
    from public.todos
    where list_id = p_list_id
    returning id into v_id;
  else
    update public.todos
    set title = p_title, description = p_description, due_date = p_due_date
    where id = p_id
    returning id into v_id;

    if v_id is null then
      raise exception 'todo_not_found';
    end if;
  end if;

  if p_plan_date is null then
    delete from public.events where todo_id = v_id;
  else
    insert into public.events (
      todo_id, title, description, start_date, start_time, end_date, end_time
    )
    values (
      v_id, p_title, p_description, p_plan_date, p_plan_time,
      coalesce(p_plan_end_date, p_plan_date), p_plan_end_time
    )
    on conflict (todo_id) do update
      set title = excluded.title,
          description = excluded.description,
          start_date = excluded.start_date,
          start_time = excluded.start_time,
          end_date = excluded.end_date,
          end_time = excluded.end_time;
  end if;

  return v_id;
end;
$$;

revoke execute on function public.save_todo(uuid, uuid, text, text, date, date, time, date, time)
  from public, anon;
grant execute on function public.save_todo(uuid, uuid, text, text, date, date, time, date, time)
  to authenticated;

-- Numbers the given todos in array order, in one statement. RLS keeps it to the caller's rows.
create function public.reorder_todos(p_ids uuid[])
returns void
language sql
set search_path = ''
as $$
  update public.todos as todo
  set sort_order = ordered.position
  from unnest(p_ids) with ordinality as ordered(id, position)
  where todo.id = ordered.id;
$$;

revoke execute on function public.reorder_todos(uuid[]) from public, anon;
grant execute on function public.reorder_todos(uuid[]) to authenticated;
