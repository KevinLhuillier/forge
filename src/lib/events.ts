import { supabase } from './supabase';

/** `event_date` is a local day (YYYY-MM-DD); a null `start_time` means all day. */
export type EventFields = {
  title: string;
  description: string | null;
  event_date: string;
  start_time: string | null;
};
/** `todo_id` is set when the event is the slot planned for a todo. */
export type CalendarEvent = EventFields & { id: string; todo_id: string | null };

const COLUMNS = 'id, todo_id, title, description, event_date, start_time';

function unwrap<T>(result: { data: T | null; error: { message: string } | null }): T {
  if (result.error) throw new Error(result.error.message);
  return result.data as T;
}

// RLS limits every call to the signed-in user's events.

export async function fetchEvents(): Promise<CalendarEvent[]> {
  return unwrap(await supabase.from('events').select(COLUMNS).order('event_date'));
}

export async function createEvent(fields: EventFields): Promise<CalendarEvent> {
  return unwrap(await supabase.from('events').insert(fields).select(COLUMNS).single());
}

export async function updateEvent(id: string, fields: EventFields): Promise<CalendarEvent> {
  return unwrap(await supabase.from('events').update(fields).eq('id', id).select(COLUMNS).single());
}

export async function deleteEvent(id: string): Promise<void> {
  unwrap(await supabase.from('events').delete().eq('id', id));
}

/** All-day events first, then by time, then by title. */
export function compareEvents(a: CalendarEvent, b: CalendarEvent): number {
  return (a.start_time ?? '').localeCompare(b.start_time ?? '') || a.title.localeCompare(b.title);
}

/** 14:30 from what the database returns (14:30:00). */
export const formatTime = (time: string) => time.slice(0, 5);

/** HH:MM from 14:30, 14h30, 1430 or 14. Null when it can't be read. */
export function parseTime(text: string): string | null {
  const match = /^([01]?\d|2[0-3])(?:[:hH.]?([0-5]\d))?$/.exec(text.trim());
  if (!match) return null;
  return `${match[1].padStart(2, '0')}:${match[2] ?? '00'}`;
}
