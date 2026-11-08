-- Calendar: appointments and events, independent from todos.
-- Date and time are the user's local wall clock. No start time means all day.

create table public.events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  title text not null check (char_length(btrim(title)) between 1 and 200),
  description text check (char_length(description) <= 2000),
  event_date date not null,
  start_time time,
  created_at timestamptz not null default now()
);

create index events_user_date_idx on public.events (user_id, event_date);

alter table public.events enable row level security;

create policy "Users manage their own events" on public.events
  for all to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

grant select, insert, update, delete on public.events to authenticated;
