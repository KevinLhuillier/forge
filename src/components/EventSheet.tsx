import { CalendarDays, Check, Trash2, X } from 'lucide-react-native';
import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { ConfirmDialog } from '@/components/ConfirmDialog';
import { MonthPicker } from '@/components/MonthPicker';
import { formatTime, parseTime, type CalendarEvent, type EventFields } from '@/lib/events';
import { formatDue } from '@/lib/todos';
import { haptics, spacing, todoColors, todoFonts } from '@/theme';

const SAVE_ERROR = "Couldn't save. Check your connection and try again.";

/** Creates an event on `day`, or edits and deletes the one it is given. */
export function EventSheet({
  event,
  day,
  onSave,
  onDelete,
  onClose,
}: {
  event: CalendarEvent | null;
  day: string;
  onSave: (fields: EventFields) => Promise<void>;
  onDelete: () => Promise<void>;
  onClose: () => void;
}) {
  const [title, setTitle] = useState(event?.title ?? '');
  const [date, setDate] = useState(event?.event_date ?? day);
  const [time, setTime] = useState(event?.start_time ? formatTime(event.start_time) : '');
  const [description, setDescription] = useState(event?.description ?? '');
  const [picking, setPicking] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [timeInvalid, setTimeInvalid] = useState(false);
  const canSave = !!title.trim() && !saving;
  // A planned todo keeps its title and description from Todo; only its slot is edited here.
  const linked = !!event?.todo_id;

  async function run(action: () => Promise<void>) {
    setSaving(true);
    setError(null);
    try {
      await action();
    } catch {
      haptics.error();
      setError(SAVE_ERROR);
      setSaving(false);
    }
  }

  function save() {
    if (!canSave) return;
    const parsed = time.trim() ? parseTime(time) : null;
    if (time.trim() && !parsed) {
      haptics.error();
      setTimeInvalid(true);
      setError('Use a time like 14:30, or leave it empty for all day.');
      return;
    }
    run(() =>
      onSave({
        title: title.trim(),
        description: description.trim() || null,
        event_date: date,
        start_time: parsed,
      }),
    );
  }

  return (
    <KeyboardAvoidingView behavior="padding" style={styles.backdrop}>
      <View style={styles.sheet}>
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <View style={styles.header}>
            <Text style={styles.heading}>{event ? 'Edit event' : 'New event'}</Text>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Close"
              hitSlop={12}
              onPress={onClose}>
              <X size={24} color={todoColors.textMuted} />
            </Pressable>
          </View>

          <TextInput
            accessibilityLabel="Event title"
            editable={!linked}
            style={[styles.input, linked && styles.locked]}
            value={title}
            onChangeText={setTitle}
            placeholder="Title"
            placeholderTextColor={todoColors.textMuted}
            maxLength={200}
            autoFocus={!event}
          />

          <View style={styles.when}>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Event date"
              accessibilityState={{ expanded: picking }}
              onPress={() => setPicking(!picking)}
              style={styles.dateButton}>
              <CalendarDays size={20} color={todoColors.accent} />
              <Text style={styles.dateText}>{formatDue(date)}</Text>
            </Pressable>
            <TextInput
              accessibilityLabel="Event time"
              style={[styles.input, styles.time, timeInvalid && styles.inputInvalid]}
              value={time}
              onChangeText={(text) => {
                setTime(text);
                setTimeInvalid(false);
                setError(null);
              }}
              placeholder="All day"
              placeholderTextColor={todoColors.textMuted}
              keyboardType="numbers-and-punctuation"
              maxLength={5}
            />
          </View>

          {picking ? (
            <MonthPicker
              value={date}
              onPick={(key) => {
                haptics.tap();
                setDate(key);
                setPicking(false);
              }}
            />
          ) : null}

          <TextInput
            accessibilityLabel="Event description"
            editable={!linked}
            style={[styles.input, styles.description, linked && styles.locked]}
            value={description}
            onChangeText={setDescription}
            placeholder="Description"
            placeholderTextColor={todoColors.textMuted}
            maxLength={2000}
            multiline
            textAlignVertical="top"
          />

          {linked ? (
            <Text style={styles.note}>Planned from a todo. Edit its text in Todo.</Text>
          ) : null}

          {error ? <Text style={styles.error}>{error}</Text> : null}

          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Save"
            accessibilityState={{ disabled: !canSave }}
            disabled={!canSave}
            onPress={save}
            style={[styles.save, !canSave && styles.disabled]}>
            <Check size={20} color={todoColors.text} strokeWidth={3} />
            <Text style={styles.saveText}>Save</Text>
          </Pressable>

          {event ? (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Delete event"
              disabled={saving}
              onPress={() => setConfirming(true)}
              style={styles.delete}>
              <Trash2 size={18} color={todoColors.danger} />
              <Text style={styles.deleteText}>{linked ? 'Remove from calendar' : 'Delete'}</Text>
            </Pressable>
          ) : null}
        </ScrollView>
      </View>

      {confirming && event ? (
        <ConfirmDialog
          title={linked ? 'Remove from calendar?' : 'Delete this event?'}
          message={
            linked
              ? `“${event.title}” leaves the calendar. The todo itself is kept.`
              : `“${event.title}” will be deleted.`
          }
          confirmLabel={linked ? 'Remove' : 'Delete'}
          onCancel={() => setConfirming(false)}
          onConfirm={() => {
            setConfirming(false);
            run(onDelete);
          }}
        />
      ) : null}
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFill,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(16, 17, 34, 0.7)',
  },
  sheet: {
    maxHeight: '92%',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    backgroundColor: todoColors.surfaceRaised,
  },
  content: { padding: spacing.lg, gap: spacing.md },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  heading: { fontFamily: todoFonts.bold, fontSize: 18, color: todoColors.text },
  input: {
    minHeight: 46,
    paddingHorizontal: spacing.md,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'transparent',
    backgroundColor: todoColors.background,
    color: todoColors.text,
    fontFamily: todoFonts.regular,
    fontSize: 16,
  },
  locked: { color: todoColors.textMuted },
  note: { fontFamily: todoFonts.regular, fontSize: 13, color: todoColors.textMuted },
  inputInvalid: { borderColor: todoColors.danger },
  description: { minHeight: 80, paddingTop: spacing.md, paddingBottom: spacing.md },
  when: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  dateButton: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, minHeight: 44 },
  dateText: { fontFamily: todoFonts.medium, fontSize: 16, color: todoColors.text },
  time: { width: 100, textAlign: 'center' },
  error: { fontFamily: todoFonts.medium, fontSize: 14, color: todoColors.danger },
  save: {
    minHeight: 50,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    borderRadius: 25,
    backgroundColor: todoColors.accent,
  },
  disabled: { opacity: 0.45 },
  saveText: { fontFamily: todoFonts.bold, fontSize: 16, color: todoColors.text },
  delete: {
    minHeight: 44,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
  },
  deleteText: { fontFamily: todoFonts.medium, fontSize: 15, color: todoColors.danger },
});
