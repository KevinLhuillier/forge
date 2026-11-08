-- Todo: lists (one per project) holding todos. Each user only ever reaches their own.

create table public.todo_lists (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  name text not null check (char_length(btrim(name)) between 1 and 60),
  created_at timestamptz not null default now(),
  -- Target of the todos' foreign key, which ties a todo to a list of the same user.
  unique (id, user_id)
);

create table public.todos (
  id uuid primary key default gen_random_uuid(),
  list_id uuid not null,
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  title text not null check (char_length(btrim(title)) between 1 and 200),
  done boolean not null default false,
  created_at timestamptz not null default now(),
  foreign key (list_id, user_id) references public.todo_lists (id, user_id) on delete cascade
);

create index todos_list_id_idx on public.todos (list_id);

alter table public.todo_lists enable row level security;
alter table public.todos enable row level security;

create policy "Users manage their own lists" on public.todo_lists
  for all to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

create policy "Users manage their own todos" on public.todos
  for all to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

grant select, insert, update, delete on public.todo_lists, public.todos to authenticated;
