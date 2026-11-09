import { supabase } from './supabase';
import { toDateKey } from './todos';

/**
 * Dates are local days (YYYY-MM-DD); `end_date` equals `start_date` for a single day.
 * A null `start_time` means all day.
 */
export type EventFields = {
  title: string;
  description: string | null;
  start_date: string;
  start_time: string | null;
  end_date: string;
  end_time: string | null;
};
type EventRow = EventFields & { id: string; todo_id: string | null };
/** `todo_id` and `list` are set when the event is the slot planned for a todo. */
export type CalendarEvent = EventRow & { list: { name: string; color: string } | null };

const COLUMNS =
  'id, todo_id, title, description, start_date, start_time, end_date, end_time, todos(todo_lists(name, color))';

type FetchedEvent = EventRow & { todos: { todo_lists: CalendarEvent['list'] } | null };

function toEvent({ todos, ...event }: FetchedEvent): CalendarEvent {
  return { ...event, list: todos?.todo_lists ?? null };
}

// The client has no generated schema, so it can't type the nested select.
type Fetched<T> = { data: T | null; error: { message: string } | null };

function unwrap<T>(result: Fetched<T>): T {
  if (result.error) throw new Error(result.error.message);
  return result.data as T;
}

// RLS limits every call to the signed-in user's events.

export async function fetchEvents(): Promise<CalendarEvent[]> {
  const result = await supabase.from('events').select(COLUMNS).order('start_date');
  return unwrap(result as unknown as Fetched<FetchedEvent[]>).map(toEvent);
}

export async function createEvent(fields: EventFields): Promise<CalendarEvent> {
  const result = await supabase.from('events').insert(fields).select(COLUMNS).single();
  return toEvent(unwrap(result as unknown as Fetched<FetchedEvent>));
}

export async function updateEvent(id: string, fields: EventFields): Promise<CalendarEvent> {
  const result = await supabase.from('events').update(fields).eq('id', id).select(COLUMNS).single();
  return toEvent(unwrap(result as unknown as Fetched<FetchedEvent>));
}

export async function deleteEvent(id: string): Promise<void> {
  unwrap(await supabase.from('events').delete().eq('id', id));
}

export function occursOn(event: EventFields, day: string): boolean {
  return event.start_date <= day && day <= event.end_date;
}

/** Every day the event covers, first to last. */
export function eventDays(event: EventFields): string[] {
  const [year, month, day] = event.start_date.split('-').map(Number);
  const days: string[] = [];
  for (let offset = 0; ; offset += 1) {
    const key = toDateKey(new Date(year, month - 1, day + offset));
    if (key > event.end_date) return days;
    days.push(key);
  }
}

/** On `day`: all-day events and those continuing from before first, then by time and title. */
export function compareEventsOn(day: string) {
  const startOn = (event: CalendarEvent) =>
    event.start_date === day ? (event.start_time ?? '') : '';
  return (a: CalendarEvent, b: CalendarEvent): number =>
    startOn(a).localeCompare(startOn(b)) || a.title.localeCompare(b.title);
}

/** 14:30 from what the database returns (14:30:00). */
export const formatTime = (time: string) => time.slice(0, 5);

/** The hours of the event as they apply to `day`. */
export function timeLabelOn(event: EventFields, day: string): string {
  const start = event.start_time ? formatTime(event.start_time) : null;
  const end = event.end_time ? formatTime(event.end_time) : null;
  const first = day === event.start_date;
  const last = day === event.end_date;
  if (first && last) return start ? (end ? `${start} – ${end}` : start) : 'All day';
  if (first) return start ?? 'All day';
  return last && end ? `Until ${end}` : 'All day';
}

/** Why this start and end can't be saved, or null. Times are HH:MM. */
export function slotError(
  startDate: string,
  startTime: string | null,
  endDate: string,
  endTime: string | null,
): string | null {
  if (endTime && !startTime) return 'Add a start time, or leave the end time empty.';
  if (endDate < startDate || (endDate === startDate && endTime && endTime <= startTime!)) {
    return 'The end must be after the start.';
  }
  return null;
}

/** The end date once the start moves: a single day stays one, and the end never precedes it. */
export function endAfterStartMove(end: string, oldStart: string, newStart: string): string {
  return end === oldStart || end < newStart ? newStart : end;
}

/** HH:MM from 14:30, 14h30, 1430 or 14. Null when it can't be read. */
export function parseTime(text: string): string | null {
  const match = /^([01]?\d|2[0-3])(?:[:hH.]?([0-5]\d))?$/.exec(text.trim());
  if (!match) return null;
  return `${match[1].padStart(2, '0')}:${match[2] ?? '00'}`;
}
