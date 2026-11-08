-- Todos can carry a description and a due date.
alter table public.todos
  add column description text check (char_length(description) <= 2000),
  add column due_date date;
