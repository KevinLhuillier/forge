-- A todo can be planned in the calendar: at most one event, removed along with the todo.

alter table public.todos add constraint todos_id_user_key unique (id, user_id);

alter table public.events
  add column todo_id uuid unique,
  add constraint events_todo_fkey foreign key (todo_id, user_id)
    references public.todos (id, user_id) on delete cascade;

-- Saves a todo and its slot in the calendar together (p_id null creates, p_plan_date null unplans).
-- Runs with the caller's rights: RLS and the foreign keys keep it to their own rows.
create function public.save_todo(
  p_id uuid,
  p_list_id uuid,
  p_title text,
  p_description text,
  p_due_date date,
  p_plan_date date,
  p_plan_time time
)
returns uuid
language plpgsql
set search_path = ''
as $$
declare
  v_id uuid;
begin
  if p_id is null then
    insert into public.todos (list_id, title, description, due_date)
    values (p_list_id, p_title, p_description, p_due_date)
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
    insert into public.events (todo_id, title, description, event_date, start_time)
    values (v_id, p_title, p_description, p_plan_date, p_plan_time)
    on conflict (todo_id) do update
      set title = excluded.title,
          description = excluded.description,
          event_date = excluded.event_date,
          start_time = excluded.start_time;
  end if;

  return v_id;
end;
$$;

revoke execute on function public.save_todo(uuid, uuid, text, text, date, date, time)
  from public, anon;
grant execute on function public.save_todo(uuid, uuid, text, text, date, date, time)
  to authenticated;
