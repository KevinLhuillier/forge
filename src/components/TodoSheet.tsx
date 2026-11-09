import { CalendarClock, CalendarDays, Check, X } from 'lucide-react-native';
import { useRef, useState, type ComponentRef } from 'react';
import {
  KeyboardAvoidingView,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { MonthPicker } from '@/components/MonthPicker';
import { endAfterStartMove, formatTime, parseTime, slotError } from '@/lib/events';
import { formatDue, toDateKey, type Todo, type TodoFields, type TodoPlan } from '@/lib/todos';
import { haptics, spacing, todoColors, todoFonts } from '@/theme';

/** Creates a todo (stays open to add several) or edits the one it is given. */
export function TodoSheet({
  todo,
  listName,
  onSave,
  onClose,
}: {
  todo: Todo | null;
  listName: string;
  onSave: (fields: TodoFields, plan: TodoPlan | null) => Promise<void>;
  onClose: () => void;
}) {
  const [title, setTitle] = useState(todo?.title ?? '');
  const [description, setDescription] = useState(todo?.description ?? '');
  const [due, setDue] = useState<string | null>(todo?.due_date ?? null);
  const [planDate, setPlanDate] = useState<string | null>(todo?.plan?.date ?? null);
  const [planTime, setPlanTime] = useState(todo?.plan?.time ? formatTime(todo.plan.time) : '');
  const [planTimeInvalid, setPlanTimeInvalid] = useState(false);
  const [planEnd, setPlanEnd] = useState<string | null>(todo?.plan?.endDate ?? null);
  const [planEndTime, setPlanEndTime] = useState(
    todo?.plan?.endTime ? formatTime(todo.plan.endTime) : '',
  );
  const [planEndTimeInvalid, setPlanEndTimeInvalid] = useState(false);
  const [picking, setPicking] = useState<'due' | 'plan' | 'planEnd' | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const titleInput = useRef<ComponentRef<typeof TextInput>>(null);
  const canSave = !!title.trim() && !saving;

  async function save() {
    if (!canSave) return;
    const time = planDate && planTime.trim() ? parseTime(planTime) : null;
    if (planDate && planTime.trim() && !time) {
      haptics.error();
      setPlanTimeInvalid(true);
      setError('Use a time like 14:30, or leave it empty for all day.');
      return;
    }
    const endTime = planDate && planEndTime.trim() ? parseTime(planEndTime) : null;
    if (planDate && planEndTime.trim() && !endTime) {
      haptics.error();
      setPlanEndTimeInvalid(true);
      setError('Use an end time like 14:30, or leave it empty.');
      return;
    }
    const endDate = planEnd ?? planDate;
    const invalid = planDate && endDate ? slotError(planDate, time, endDate, endTime) : null;
    if (invalid) {
      haptics.error();
      setError(invalid);
      return;
    }
    setSaving(true);
    setError(null);
    try {
      await onSave(
        {
          title: title.trim(),
          description: description.trim() || null,
          due_date: due,
        },
        planDate && endDate ? { date: planDate, time, endDate, endTime } : null,
      );
      setTitle('');
      setDescription('');
      setDue(null);
      setPlanDate(null);
      setPlanTime('');
      setPlanEnd(null);
      setPlanEndTime('');
      setPicking(null);
      titleInput.current?.focus();
    } catch {
      haptics.error();
      setError("Couldn't save. Check your connection and try again.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <KeyboardAvoidingView behavior="padding" style={styles.backdrop}>
      <View style={styles.sheet}>
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <View style={styles.header}>
            <Text style={styles.heading} numberOfLines={1}>
              {todo ? 'Edit todo' : `Add to ${listName}`}
            </Text>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Close"
              hitSlop={12}
              onPress={onClose}>
              <X size={24} color={todoColors.textMuted} />
            </Pressable>
          </View>

          <TextInput
            ref={titleInput}
            accessibilityLabel={todo ? 'Todo title' : 'New todo'}
            style={styles.input}
            value={title}
            onChangeText={setTitle}
            placeholder="Title"
            placeholderTextColor={todoColors.textMuted}
            maxLength={200}
            autoFocus={!todo}
            blurOnSubmit={false}
            returnKeyType="done"
            onSubmitEditing={save}
          />
          <TextInput
            accessibilityLabel="Description"
            style={[styles.input, styles.description]}
            value={description}
            onChangeText={setDescription}
            placeholder="Description"
            placeholderTextColor={todoColors.textMuted}
            maxLength={2000}
            multiline
            textAlignVertical="top"
          />

          <View style={styles.dueRow}>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Due date"
              accessibilityState={{ expanded: picking === 'due' }}
              onPress={() => setPicking(picking === 'due' ? null : 'due')}
              style={styles.dueButton}>
              <CalendarDays size={20} color={due ? todoColors.accent : todoColors.textMuted} />
              <Text style={[styles.dueText, !!due && styles.dueTextSet]}>
                {due ? `Due ${formatDue(due)}` : 'Add a due date'}
              </Text>
            </Pressable>
            {due ? (
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Remove due date"
                hitSlop={12}
                onPress={() => {
                  setDue(null);
                  setPicking(null);
                }}>
                <X size={20} color={todoColors.textMuted} />
              </Pressable>
            ) : null}
          </View>

          {picking === 'due' ? (
            <MonthPicker
              value={due}
              onPick={(key) => {
                haptics.tap();
                setDue(key);
                setPicking(null);
              }}
            />
          ) : null}

          <View style={styles.dueRow}>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Plan in calendar"
              accessibilityState={{ expanded: picking === 'plan' }}
              onPress={() => {
                if (!planDate) {
                  const start = due ?? toDateKey(new Date());
                  setPlanDate(start);
                  setPlanEnd(start);
                }
                setPicking(picking === 'plan' ? null : 'plan');
              }}
              style={styles.dueButton}>
              <CalendarClock
                size={20}
                color={planDate ? todoColors.accent : todoColors.textMuted}
              />
              <Text style={[styles.dueText, !!planDate && styles.dueTextSet]}>
                {planDate ? `Starts ${formatDue(planDate)}` : 'Plan in calendar'}
              </Text>
            </Pressable>
            {planDate ? (
              <View style={styles.planControls}>
                <TextInput
                  accessibilityLabel="Plan time"
                  style={[styles.input, styles.planTime, planTimeInvalid && styles.inputInvalid]}
                  value={planTime}
                  onChangeText={(text) => {
                    setPlanTime(text);
                    setPlanTimeInvalid(false);
                    setError(null);
                  }}
                  placeholder="All day"
                  placeholderTextColor={todoColors.textMuted}
                  keyboardType="numbers-and-punctuation"
                  maxLength={5}
                />
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel="Remove from calendar"
                  hitSlop={12}
                  onPress={() => {
                    setPlanDate(null);
                    setPlanTime('');
                    setPlanTimeInvalid(false);
                    setPlanEnd(null);
                    setPlanEndTime('');
                    setPlanEndTimeInvalid(false);
                    setError(null);
                    setPicking(null);
                  }}>
                  <X size={20} color={todoColors.textMuted} />
                </Pressable>
              </View>
            ) : null}
          </View>

          {picking === 'plan' && planDate ? (
            <MonthPicker
              value={planDate}
              onPick={(key) => {
                haptics.tap();
                setPlanDate(key);
                setPlanEnd(endAfterStartMove(planEnd ?? planDate, planDate, key));
                setError(null);
                setPicking(null);
              }}
            />
          ) : null}

          {planDate && planEnd ? (
            <View style={styles.dueRow}>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Plan end date"
                accessibilityState={{ expanded: picking === 'planEnd' }}
                onPress={() => setPicking(picking === 'planEnd' ? null : 'planEnd')}
                style={styles.dueButton}>
                <CalendarClock size={20} color={todoColors.accent} />
                <Text style={[styles.dueText, styles.dueTextSet]}>Ends {formatDue(planEnd)}</Text>
              </Pressable>
              <TextInput
                accessibilityLabel="Plan end time"
                style={[
                  styles.input,
                  styles.planTime,
                  styles.planEndTime,
                  planEndTimeInvalid && styles.inputInvalid,
                ]}
                value={planEndTime}
                onChangeText={(text) => {
                  setPlanEndTime(text);
                  setPlanEndTimeInvalid(false);
                  setError(null);
                }}
                placeholder="End"
                placeholderTextColor={todoColors.textMuted}
                keyboardType="numbers-and-punctuation"
                maxLength={5}
              />
            </View>
          ) : null}

          {picking === 'planEnd' && planEnd ? (
            <MonthPicker
              value={planEnd}
              onPick={(key) => {
                haptics.tap();
                setPlanEnd(key);
                setError(null);
                setPicking(null);
              }}
            />
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
        </ScrollView>
      </View>
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.md,
  },
  heading: { flex: 1, fontFamily: todoFonts.bold, fontSize: 18, color: todoColors.text },
  input: {
    minHeight: 46,
    paddingHorizontal: spacing.md,
    borderRadius: 10,
    backgroundColor: todoColors.background,
    color: todoColors.text,
    fontFamily: todoFonts.regular,
    fontSize: 16,
  },
  description: { minHeight: 92, paddingTop: spacing.md, paddingBottom: spacing.md },
  dueRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  dueButton: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, minHeight: 44 },
  dueText: { fontFamily: todoFonts.regular, fontSize: 15, color: todoColors.textMuted },
  dueTextSet: { fontFamily: todoFonts.medium, color: todoColors.text },
  inputInvalid: { borderWidth: 1, borderColor: todoColors.danger },
  planControls: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  planTime: { width: 92, textAlign: 'center' },
  // Lines up with the start time, which has the remove button on its right.
  planEndTime: { marginRight: 20 + spacing.md },
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
});
