import { useRouter } from 'expo-router';
import { ChevronLeft } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { EventSheet } from '@/components/EventSheet';
import { MonthPicker } from '@/components/MonthPicker';
import { TodoAddButton } from '@/components/TodoAddButton';
import {
  compareEventsOn,
  createEvent,
  deleteEvent,
  eventDays,
  fetchEvents,
  occursOn,
  timeLabelOn,
  updateEvent,
  type CalendarEvent,
  type EventFields,
} from '@/lib/events';
import { formatDue, toDateKey } from '@/lib/todos';
import { haptics, spacing, todoColors, todoFonts } from '@/theme';

function dayHeading(key: string): string {
  const [year, month, day] = key.split('-').map(Number);
  return new Date(year, month - 1, day).toLocaleDateString('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });
}

export default function CalendarScreen() {
  const router = useRouter();
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading');
  const [attempt, setAttempt] = useState(0);
  const [day, setDay] = useState(() => toDateKey(new Date()));
  // The event form: `event` is null when adding a new one.
  const [sheet, setSheet] = useState<{ event: CalendarEvent | null } | null>(null);

  useEffect(() => {
    let stale = false;
    fetchEvents()
      .then((data) => {
        if (stale) return;
        setEvents(data);
        setStatus('ready');
      })
      .catch(() => {
        if (!stale) setStatus('error');
      });
    return () => {
      stale = true;
    };
  }, [attempt]);

  const marked = new Set(events.flatMap(eventDays));
  const dayEvents = events.filter((event) => occursOn(event, day)).sort(compareEventsOn(day));

  async function save(fields: EventFields) {
    const editing = sheet?.event;
    const saved = editing ? await updateEvent(editing.id, fields) : await createEvent(fields);
    setEvents((current) => [...current.filter((item) => item.id !== saved.id), saved]);
    // Stay on this day if the event still covers it, otherwise follow the event.
    if (!occursOn(saved, day)) setDay(saved.start_date);
    setSheet(null);
  }

  async function remove() {
    const editing = sheet?.event;
    if (!editing) return;
    await deleteEvent(editing.id);
    setEvents((current) => current.filter((item) => item.id !== editing.id));
    setSheet(null);
  }

  return (
    <SafeAreaView style={styles.root}>
      <KeyboardAvoidingView style={styles.root} behavior="padding">
        <View style={styles.header}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Home"
            hitSlop={12}
            onPress={() => (router.canGoBack() ? router.back() : router.replace('/'))}>
            <ChevronLeft size={26} color={todoColors.text} />
          </Pressable>
          <Text style={styles.title}>Calendar</Text>
        </View>
        <View style={styles.divider} />

        {status === 'loading' ? (
          <ActivityIndicator color={todoColors.accent} size="large" style={styles.loader} />
        ) : status === 'error' ? (
          <View style={styles.centered}>
            <Text style={styles.message}>Couldn&apos;t load your events.</Text>
            <Pressable
              accessibilityRole="button"
              onPress={() => {
                setStatus('loading');
                setAttempt((n) => n + 1);
              }}
              style={styles.retry}>
              <Text style={styles.retryText}>Retry</Text>
            </Pressable>
          </View>
        ) : (
          <>
            <ScrollView contentContainerStyle={styles.content}>
              <MonthPicker
                value={day}
                marked={marked}
                onPick={(key) => {
                  haptics.tap();
                  setDay(key);
                }}
              />

              <Text style={styles.dayHeading}>{dayHeading(day)}</Text>

              <View>
                <View style={[styles.stackLayer, styles.stackLayerBack]} />
                <View style={[styles.stackLayer, styles.stackLayerMiddle]} />
                <View style={styles.card}>
                  {dayEvents.length === 0 ? (
                    <Text style={styles.empty}>No events this day.</Text>
                  ) : (
                    dayEvents.map((event) => (
                      <Pressable
                        key={event.id}
                        accessibilityRole="button"
                        accessibilityLabel={`Edit event ${event.title}`}
                        onPress={() => {
                          haptics.tap();
                          setSheet({ event });
                        }}
                        style={styles.row}>
                        <View style={styles.rowWhen}>
                          <Text style={styles.rowTime}>{timeLabelOn(event, day)}</Text>
                          {event.todo_id ? <Text style={styles.rowTag}>Todo</Text> : null}
                        </View>
                        <View style={styles.rowText}>
                          <Text style={styles.rowTitle}>{event.title}</Text>
                          {event.end_date !== event.start_date ? (
                            <Text style={styles.rowDescription}>
                              {formatDue(event.start_date)} → {formatDue(event.end_date)}
                            </Text>
                          ) : null}
                          {event.description ? (
                            <Text style={styles.rowDescription} numberOfLines={2}>
                              {event.description}
                            </Text>
                          ) : null}
                        </View>
                      </Pressable>
                    ))
                  )}
                </View>
              </View>
            </ScrollView>

            <TodoAddButton
              label="Add an event"
              onPress={() => {
                haptics.tap();
                setSheet({ event: null });
              }}
            />

            {sheet ? (
              <EventSheet
                key={sheet.event?.id ?? 'new'}
                event={sheet.event}
                day={day}
                onSave={save}
                onDelete={remove}
                onClose={() => setSheet(null)}
              />
            ) : null}
          </>
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: todoColors.background },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  title: { fontFamily: todoFonts.bold, fontSize: 18, color: todoColors.text },
  divider: { height: 1, marginHorizontal: spacing.lg, backgroundColor: todoColors.line },
  loader: { marginTop: 80 },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.lg,
    padding: spacing.xl,
  },
  message: { fontFamily: todoFonts.regular, fontSize: 15, color: todoColors.textMuted },
  retry: {
    minHeight: 44,
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
    borderRadius: 22,
    backgroundColor: todoColors.accent,
  },
  retryText: { fontFamily: todoFonts.bold, fontSize: 15, color: todoColors.text },
  content: { padding: spacing.lg, gap: spacing.lg, paddingBottom: 128 },
  dayHeading: { fontFamily: todoFonts.bold, fontSize: 16, color: todoColors.text },
  stackLayer: {
    alignSelf: 'center',
    height: 10,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    backgroundColor: todoColors.surface,
  },
  stackLayerBack: { width: '84%', opacity: 0.45 },
  stackLayerMiddle: { width: '92%', opacity: 0.75 },
  card: { borderRadius: 12, backgroundColor: todoColors.surface, overflow: 'hidden' },
  empty: {
    fontFamily: todoFonts.regular,
    fontSize: 15,
    color: todoColors.textMuted,
    textAlign: 'center',
    padding: spacing.xl,
  },
  row: {
    flexDirection: 'row',
    gap: spacing.lg,
    minHeight: 56,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: todoColors.line,
    backgroundColor: todoColors.surfaceRaised,
  },
  rowWhen: { width: 64, gap: 2 },
  rowTag: { fontFamily: todoFonts.regular, fontSize: 12, color: todoColors.textMuted },
  rowTime: {
    fontFamily: todoFonts.medium,
    fontSize: 14,
    lineHeight: 20,
    color: todoColors.accentLight,
  },
  rowText: { flex: 1, gap: spacing.xs },
  rowTitle: { fontFamily: todoFonts.bold, fontSize: 15, lineHeight: 20, color: todoColors.text },
  rowDescription: { fontFamily: todoFonts.regular, fontSize: 13, color: todoColors.textMuted },
});
