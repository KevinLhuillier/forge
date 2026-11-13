import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';
import { AndroidImportance } from 'expo-notifications';
import { Platform } from 'react-native';

import { compareEventsOn, fetchEvents, occursOn, parseTime, timeLabelOn } from './events';
import { fetchTodoData, formatDue, toDateKey } from './todos';

/**
 * The evening recap: the day before, at the time set in Settings (20:00 by default), a local
 * notification lists what is planned for the next day. Notifications are scheduled on the device
 * from the data as it was last loaded, so they are rescheduled whenever the app opens or something
 * changes.
 */

export const DEFAULT_RECAP_TIME = '20:00';
/** HH:MM, kept on this device like the notifications themselves. */
const TIME_KEY = 'forge.recap-time';
/** Days ahead with a recap built from the data. One more, generic, follows them. */
const DAYS_AHEAD = 7;
const MAX_LINES = 6;
const CHANNEL_ID = 'recap';
const KIND = 'evening-recap';

const supported = Platform.OS !== 'web';

if (supported) {
  // Also shown when the app is open at that time.
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowBanner: true,
      shouldShowList: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
    }),
  });
}

function addDays(date: Date, days: number): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate() + days);
}

/** `time` (HH:MM) on the day before `day`. */
function dayBeforeAt(day: Date, time: string): Date {
  const [hours, minutes] = time.split(':').map(Number);
  const moment = addDays(day, -1);
  moment.setHours(hours, minutes, 0, 0);
  return moment;
}

export async function getRecapTime(): Promise<string> {
  try {
    const stored = await AsyncStorage.getItem(TIME_KEY);
    return (stored && parseTime(stored)) || DEFAULT_RECAP_TIME;
  } catch {
    return DEFAULT_RECAP_TIME;
  }
}

/** Saves the time (HH:MM) and reschedules the recaps at it. */
export async function setRecapTime(time: string): Promise<void> {
  await AsyncStorage.setItem(TIME_KEY, time);
  refreshRecap();
}

async function canNotify(): Promise<boolean> {
  const current = await Notifications.getPermissionsAsync();
  if (current.granted) return true;
  if (!current.canAskAgain) return false;
  return (await Notifications.requestPermissionsAsync()).granted;
}

async function cancelRecaps() {
  const scheduled = await Notifications.getAllScheduledNotificationsAsync();
  await Promise.all(
    scheduled
      .filter((request) => request.content.data?.kind === KIND)
      .map((request) => Notifications.cancelScheduledNotificationAsync(request.identifier)),
  );
}

type Recap = { title: string; body: string };

/** Tomorrow · Fri 14.11 */
function recapTitle(date: Date): string {
  const weekday = date.toLocaleDateString('en-GB', { weekday: 'short' });
  return `Tomorrow · ${weekday} ${formatDue(toDateKey(date))}`;
}

async function buildRecaps(days: Date[]): Promise<(Recap | null)[]> {
  const [{ lists, todos }, events] = await Promise.all([fetchTodoData(), fetchEvents()]);
  const doneIds = new Set(todos.filter((todo) => todo.done).map((todo) => todo.id));
  const listName = (id: string) => lists.find((list) => list.id === id)?.name;

  return days.map((date) => {
    const day = toDateKey(date);
    // A done todo's slot no longer needs a reminder.
    const dayEvents = events
      .filter((event) => occursOn(event, day) && !(event.todo_id && doneIds.has(event.todo_id)))
      .sort(compareEventsOn(day));
    const plannedIds = new Set(dayEvents.map((event) => event.todo_id));
    const due = todos.filter(
      (todo) => !todo.done && todo.due_date === day && !plannedIds.has(todo.id),
    );

    const lines = [
      ...dayEvents.map((event) => {
        const list = event.list ? ` (${event.list.name})` : '';
        return `${timeLabelOn(event, day)} · ${event.title}${list}`;
      }),
      ...due.map((todo) => {
        const list = listName(todo.list_id);
        return `Due · ${todo.title}${list ? ` (${list})` : ''}`;
      }),
    ];
    if (lines.length === 0) return null;

    const shown = lines.length > MAX_LINES ? lines.slice(0, MAX_LINES - 1) : lines;
    const more = lines.length - shown.length;
    return {
      title: recapTitle(date),
      body: [...shown, ...(more > 0 ? [`+${more} more`] : [])].join('\n'),
    };
  });
}

async function prepare(): Promise<boolean> {
  if (!(await canNotify())) return false;
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync(CHANNEL_ID, {
      name: 'Evening recap',
      importance: AndroidImportance.DEFAULT,
    });
  }
  return true;
}

async function schedule() {
  if (!(await prepare())) return;

  const today = new Date();
  const days = Array.from({ length: DAYS_AHEAD }, (_, i) => addDays(today, i + 1));
  // Build first: if loading fails, the recaps already scheduled are kept.
  const [recaps, time] = await Promise.all([buildRecaps(days), getRecapTime()]);
  await cancelRecaps();

  const now = Date.now();
  const at = (date: Date, recap: Recap) =>
    Notifications.scheduleNotificationAsync({
      content: { ...recap, data: { kind: KIND } },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DATE,
        date,
        channelId: CHANNEL_ID,
      },
    });

  await Promise.all(
    days.map((day, i) => {
      const recap = recaps[i];
      const moment = dayBeforeAt(day, time);
      return recap && moment.getTime() > now ? at(moment, recap) : null;
    }),
  );
  // Past the days it knows about, the app hasn't been opened in a while.
  const after = addDays(today, DAYS_AHEAD + 1);
  await at(dayBeforeAt(after, time), {
    title: 'Plans for tomorrow?',
    body: 'Open Forge to get your evening recap again.',
  });
}

let timer: ReturnType<typeof setTimeout> | undefined;
let running: Promise<void> = Promise.resolve();

/** Reschedules the recaps, shortly after the last call: changes often come in bursts. */
export function refreshRecap() {
  if (!supported) return;
  clearTimeout(timer);
  timer = setTimeout(() => {
    running = running.then(schedule).catch(() => {});
  }, 1500);
}

/** On sign out: the next user must not get these. */
export function clearRecap() {
  if (!supported) return;
  clearTimeout(timer);
  running = running.then(cancelRecaps).catch(() => {});
}

export type TestResult =
  | { status: 'sent' | 'denied' | 'unsupported' }
  /** `unavailable`: this build has no notifications module. `load`: the data didn't load. */
  | { status: 'unavailable' | 'load' | 'failed'; detail: string };

const detailOf = (error: unknown) => (error instanceof Error ? error.message : String(error));

/**
 * Shows tomorrow's recap right away, as it would come tonight. Works in any build: it only
 * uses local notifications. Each step reports its own failure, so the cause can be told apart.
 */
export async function sendTestRecap(): Promise<TestResult> {
  if (!supported) return { status: 'unsupported' };
  const failure = (error: unknown): TestResult => ({
    status: (error as { code?: string })?.code === 'ERR_UNAVAILABLE' ? 'unavailable' : 'failed',
    detail: detailOf(error),
  });

  try {
    if (!(await prepare())) return { status: 'denied' };
  } catch (error) {
    return failure(error);
  }

  const tomorrow = addDays(new Date(), 1);
  let recap: Recap | null;
  try {
    [recap] = await buildRecaps([tomorrow]);
  } catch (error) {
    return { status: 'load', detail: detailOf(error) };
  }

  try {
    await Notifications.scheduleNotificationAsync({
      content: recap ?? {
        title: recapTitle(tomorrow),
        body: 'Nothing planned. Enjoy your day!',
      },
      trigger: { channelId: CHANNEL_ID },
    });
  } catch (error) {
    return failure(error);
  }
  return { status: 'sent' };
}
