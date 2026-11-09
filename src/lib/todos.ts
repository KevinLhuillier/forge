import { supabase } from './supabase';

export type TodoList = { id: string; name: string };
/** What the user writes on a todo. `due_date` is a local day, as YYYY-MM-DD. */
export type TodoFields = { title: string; description: string | null; due_date: string | null };
/** Where a todo sits in the calendar. `time` is null for all day. */
export type TodoPlan = {
  date: string;
  time: string | null;
  endDate: string;
  endTime: string | null;
};
export type Todo = TodoFields & {
  id: string;
  list_id: string;
  done: boolean;
  sort_order: number;
  plan: TodoPlan | null;
};

const TODO_COLUMNS = 'id, list_id, title, description, due_date, done, sort_order';

export function toDateKey(date: Date): string {
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${date.getFullYear()}-${month}-${day}`;
}

/** 31.03, with the year only when it isn't the current one. */
export function formatDue(key: string): string {
  const [year, month, day] = key.split('-');
  const sameYear = Number(year) === new Date().getFullYear();
  return sameYear ? `${day}.${month}` : `${day}.${month}.${year.slice(2)}`;
}

function unwrap<T>(result: { data: T | null; error: { message: string } | null }): T {
  if (result.error) throw new Error(result.error.message);
  return result.data as T;
}

// RLS limits every call to the signed-in user's rows; user_id is filled in by the database.

export async function fetchTodoData(): Promise<{ lists: TodoList[]; todos: Todo[] }> {
  const [lists, todos, plans] = await Promise.all([
    supabase.from('todo_lists').select('id, name').order('created_at'),
    supabase.from('todos').select(TODO_COLUMNS).order('sort_order'),
    supabase
      .from('events')
      .select('todo_id, start_date, start_time, end_date, end_time')
      .not('todo_id', 'is', null),
  ]);
  type Row = Omit<Todo, 'plan'>;
  type PlanRow = {
    todo_id: string;
    start_date: string;
    start_time: string | null;
    end_date: string;
    end_time: string | null;
  };
  const planRows = unwrap<PlanRow[]>(plans);
  return {
    lists: unwrap(lists),
    todos: unwrap<Row[]>(todos).map((todo) => {
      const plan = planRows.find((row) => row.todo_id === todo.id);
      return {
        ...todo,
        plan: plan
          ? {
              date: plan.start_date,
              time: plan.start_time,
              endDate: plan.end_date,
              endTime: plan.end_time,
            }
          : null,
      };
    }),
  };
}

export async function createList(name: string): Promise<TodoList> {
  return unwrap(await supabase.from('todo_lists').insert({ name }).select('id, name').single());
}

export async function deleteList(id: string): Promise<void> {
  unwrap(await supabase.from('todo_lists').delete().eq('id', id));
}

/** Creates (id null) or updates a todo along with its slot in the calendar. Returns its id. */
export async function saveTodo(
  id: string | null,
  listId: string,
  fields: TodoFields,
  plan: TodoPlan | null,
): Promise<string> {
  return unwrap(
    await supabase.rpc('save_todo', {
      p_id: id,
      p_list_id: listId,
      p_title: fields.title,
      p_description: fields.description,
      p_due_date: fields.due_date,
      p_plan_date: plan?.date ?? null,
      p_plan_time: plan?.time ?? null,
      p_plan_end_date: plan?.endDate ?? null,
      p_plan_end_time: plan?.endTime ?? null,
    }),
  );
}

/** Saves the order of a list's todos, given as ids from first to last. */
export async function reorderTodos(ids: string[]): Promise<void> {
  unwrap(await supabase.rpc('reorder_todos', { p_ids: ids }));
}

export async function setTodoDone(id: string, done: boolean): Promise<void> {
  unwrap(await supabase.from('todos').update({ done }).eq('id', id));
}

export async function deleteTodo(id: string): Promise<void> {
  unwrap(await supabase.from('todos').delete().eq('id', id));
}
