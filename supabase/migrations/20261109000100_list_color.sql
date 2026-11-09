-- Each todo list has a color. Existing lists take the default, Todo's orange.

alter table public.todo_lists
  add column color text not null default '#F58220'
    check (color ~ '^#[0-9A-Fa-f]{6}$');
