import { useRouter } from 'expo-router';
import { Check, ChevronLeft, Plus, X } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { formatTime } from '@/lib/events';
import { ConfirmDialog } from '@/components/ConfirmDialog';
import { TodoAddButton } from '@/components/TodoAddButton';
import { TodoSheet } from '@/components/TodoSheet';
import {
  createList,
  deleteList,
  deleteTodo,
  fetchTodoData,
  saveTodo,
  formatDue,
  setTodoDone,
  toDateKey,
  type Todo,
  type TodoFields,
  type TodoList,
  type TodoPlan,
} from '@/lib/todos';
import { haptics, spacing, todoColors, todoFonts } from '@/theme';

const SAVE_ERROR = "Couldn't save. Check your connection and try again.";

function todayLabel(): string {
  const now = new Date();
  const day = String(now.getDate()).padStart(2, '0');
  const month = String(now.getMonth() + 1).padStart(2, '0');
  return `${day}.${month}, ${now.toLocaleDateString('en-GB', { weekday: 'short' })}`;
}

export default function TodoScreen() {
  const router = useRouter();
  const [lists, setLists] = useState<TodoList[]>([]);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading');
  const [attempt, setAttempt] = useState(0);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [composer, setComposer] = useState(false);
  const [draft, setDraft] = useState('');
  // The todo form: `todo` is null when adding a new one.
  const [sheet, setSheet] = useState<{ todo: Todo | null } | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // What a long press asks to delete.
  const [confirmList, setConfirmList] = useState(false);
  const [confirmTodo, setConfirmTodo] = useState<Todo | null>(null);

  useEffect(() => {
    let stale = false;
    fetchTodoData()
      .then((data) => {
        if (stale) return;
        setLists(data.lists);
        setTodos(data.todos);
        setStatus('ready');
      })
      .catch(() => {
        if (!stale) setStatus('error');
      });
    return () => {
      stale = true;
    };
  }, [attempt]);

  const active = lists.find((list) => list.id === selectedId) ?? lists[0];
  // Still to do first, each group in the order it was added.
  const shown = todos
    .filter((todo) => todo.list_id === active?.id)
    .sort((a, b) => Number(a.done) - Number(b.done));

  function clearTransientState() {
    haptics.tap();
    setError(null);
    setConfirmList(false);
    setConfirmTodo(null);
  }

  function openComposer() {
    clearTransientState();
    setComposer(true);
    setDraft('');
  }

  function openSheet(todo: Todo | null) {
    clearTransientState();
    setComposer(false);
    setSheet({ todo });
  }

  async function saveSheet(fields: TodoFields, plan: TodoPlan | null) {
    const editing = sheet?.todo;
    if (editing) {
      await saveTodo(editing.id, editing.list_id, fields, plan);
      setTodos((current) =>
        current.map((item) => (item.id === editing.id ? { ...item, ...fields, plan } : item)),
      );
      setSheet(null);
    } else if (active) {
      // The sheet stays open: todos are often added several at a time.
      const id = await saveTodo(null, active.id, fields, plan);
      setTodos((current) => [...current, { id, list_id: active.id, done: false, ...fields, plan }]);
    }
  }

  async function submit() {
    const text = draft.trim();
    if (!text || saving) return;
    setSaving(true);
    setError(null);
    try {
      const list = await createList(text);
      setLists((current) => [...current, list]);
      setSelectedId(list.id);
      setComposer(false);
      setDraft('');
    } catch {
      haptics.error();
      setError(SAVE_ERROR);
    } finally {
      setSaving(false);
    }
  }

  async function toggle(todo: Todo) {
    haptics.tap();
    setError(null);
    const update = (done: boolean) =>
      setTodos((current) =>
        current.map((item) => (item.id === todo.id ? { ...item, done } : item)),
      );
    update(!todo.done);
    try {
      await setTodoDone(todo.id, !todo.done);
    } catch {
      update(todo.done);
      haptics.error();
      setError(SAVE_ERROR);
    }
  }

  async function removeTodo(id: string) {
    setError(null);
    try {
      await deleteTodo(id);
      setTodos((current) => current.filter((todo) => todo.id !== id));
    } catch {
      haptics.error();
      setError(SAVE_ERROR);
    }
  }

  async function removeActiveList() {
    if (!active) return;
    setError(null);
    try {
      await deleteList(active.id);
      setLists((current) => current.filter((list) => list.id !== active.id));
      setTodos((current) => current.filter((todo) => todo.list_id !== active.id));
      setSelectedId(null);
    } catch {
      haptics.error();
      setError(SAVE_ERROR);
    }
  }

  return (
    <SafeAreaView style={styles.root}>
      <KeyboardAvoidingView style={styles.fill} behavior="padding">
        <View style={styles.header}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Home"
            hitSlop={12}
            onPress={() => (router.canGoBack() ? router.back() : router.replace('/'))}>
            <ChevronLeft size={26} color={todoColors.text} />
          </Pressable>
          <Text style={styles.today}>Today</Text>
          <Text style={styles.date}>· {todayLabel()}</Text>
        </View>
        <View style={styles.divider} />

        {status === 'loading' ? (
          <ActivityIndicator color={todoColors.accent} size="large" style={styles.loader} />
        ) : status === 'error' ? (
          <View style={styles.centered}>
            <Text style={styles.message}>Couldn&apos;t load your lists.</Text>
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
            <View style={styles.listsHeader}>
              <Text style={styles.listsTitle}>Lists</Text>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Add a list"
                hitSlop={12}
                onPress={openComposer}
                style={styles.addNew}>
                <Text style={styles.addNewText}>Add New</Text>
                <Plus size={13} color={todoColors.textMuted} />
              </Pressable>
            </View>

            {lists.length > 0 ? (
              <View>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.chips}>
                  {lists.map((list) => {
                    const selected = list.id === active?.id;
                    return (
                      <Pressable
                        key={list.id}
                        accessibilityRole="button"
                        accessibilityLabel={`List ${list.name}`}
                        accessibilityState={{ selected }}
                        onPress={() => {
                          haptics.tap();
                          setSelectedId(list.id);
                          setConfirmList(false);
                          setConfirmTodo(null);
                          setError(null);
                        }}
                        onLongPress={() => {
                          haptics.press();
                          setSelectedId(list.id);
                          setConfirmList(true);
                        }}
                        style={[styles.chip, selected && styles.chipSelected]}>
                        <Text style={[styles.chipText, selected && styles.chipTextSelected]}>
                          {list.name}
                        </Text>
                      </Pressable>
                    );
                  })}
                </ScrollView>
              </View>
            ) : null}

            <View style={styles.stack}>
              <View style={[styles.stackLayer, styles.stackLayerBack]} />
              <View style={[styles.stackLayer, styles.stackLayerMiddle]} />
              <View style={styles.card}>
                {lists.length === 0 ? (
                  <View style={styles.centered}>
                    <Text style={styles.message}>Create your first list to get started.</Text>
                  </View>
                ) : shown.length === 0 ? (
                  <View style={styles.centered}>
                    <Text style={styles.message}>Nothing to do here yet.</Text>
                  </View>
                ) : (
                  <ScrollView contentContainerStyle={styles.rows}>
                    {shown.map((todo) => (
                      <TodoRow
                        key={todo.id}
                        todo={todo}
                        onToggle={() => toggle(todo)}
                        onOpen={() => openSheet(todo)}
                        onHold={() => {
                          haptics.press();
                          setConfirmTodo(todo);
                        }}
                      />
                    ))}
                    <Text style={styles.hint}>
                      Tap a todo to edit it. Hold a todo or a list to delete it.
                    </Text>
                  </ScrollView>
                )}
              </View>
            </View>

            {error ? <Text style={styles.error}>{error}</Text> : null}

            {composer ? (
              <View style={styles.composer}>
                <TextInput
                  accessibilityLabel="New list name"
                  style={styles.input}
                  value={draft}
                  onChangeText={setDraft}
                  placeholder="New list"
                  placeholderTextColor={todoColors.textMuted}
                  maxLength={60}
                  autoFocus
                  blurOnSubmit={false}
                  returnKeyType="done"
                  onSubmitEditing={submit}
                />
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel="Save"
                  disabled={!draft.trim() || saving}
                  onPress={submit}
                  style={[styles.composerSave, !draft.trim() && styles.disabled]}>
                  <Check size={22} color={todoColors.text} strokeWidth={3} />
                </Pressable>
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel="Close"
                  hitSlop={8}
                  onPress={() => setComposer(false)}>
                  <X size={24} color={todoColors.textMuted} />
                </Pressable>
              </View>
            ) : (
              <TodoAddButton
                label={lists.length === 0 ? 'Add a list' : 'Add a todo'}
                onPress={() => (lists.length === 0 ? openComposer() : openSheet(null))}
              />
            )}

            {confirmTodo ? (
              <ConfirmDialog
                title="Delete this todo?"
                message={`“${confirmTodo.title}” will be deleted${confirmTodo.plan ? ', along with its calendar slot' : ''}.`}
                onCancel={() => setConfirmTodo(null)}
                onConfirm={() => {
                  setConfirmTodo(null);
                  removeTodo(confirmTodo.id);
                }}
              />
            ) : null}

            {confirmList && active ? (
              <ConfirmDialog
                title="Delete this list?"
                message={`“${active.name}” and all its todos will be deleted.`}
                onCancel={() => setConfirmList(false)}
                onConfirm={() => {
                  setConfirmList(false);
                  removeActiveList();
                }}
              />
            ) : null}

            {sheet && active ? (
              <TodoSheet
                key={sheet.todo?.id ?? 'new'}
                todo={sheet.todo}
                listName={active.name}
                onSave={saveSheet}
                onClose={() => setSheet(null)}
              />
            ) : null}
          </>
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function TodoRow({
  todo,
  onToggle,
  onOpen,
  onHold,
}: {
  todo: Todo;
  onToggle: () => void;
  onOpen: () => void;
  onHold: () => void;
}) {
  // Due today or already late.
  const dueNow = !todo.done && !!todo.due_date && todo.due_date <= toDateKey(new Date());

  return (
    <View style={[styles.row, !todo.done && styles.rowOpen]}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`Edit ${todo.title}`}
        onPress={onOpen}
        onLongPress={onHold}
        style={styles.rowMain}>
        <Text
          style={[styles.rowTitle, todo.done && styles.rowTitleDone, dueNow && styles.rowTitleDue]}>
          {todo.title}
        </Text>
        {todo.description ? (
          <Text style={styles.rowDescription} numberOfLines={2}>
            {todo.description}
          </Text>
        ) : null}
        {todo.plan ? (
          <Text style={styles.rowPlan}>
            Planned {formatDue(todo.plan.date)}
            {todo.plan.time ? ` · ${formatTime(todo.plan.time)}` : ''}
          </Text>
        ) : null}
      </Pressable>
      <View style={styles.rowSide}>
        {todo.due_date ? (
          <Text style={[styles.rowDue, dueNow && styles.rowDueNow]}>
            {formatDue(todo.due_date)}
          </Text>
        ) : null}
        <Pressable
          accessibilityRole="checkbox"
          accessibilityLabel={todo.title}
          accessibilityState={{ checked: todo.done }}
          hitSlop={10}
          onPress={onToggle}
          style={[styles.circle, todo.done && styles.circleDone]}>
          {todo.done ? <Check size={15} color={todoColors.text} strokeWidth={3.5} /> : null}
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: todoColors.background },
  fill: { flex: 1 },
  disabled: { opacity: 0.45 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  today: { fontFamily: todoFonts.bold, fontSize: 18, color: todoColors.text },
  date: { fontFamily: todoFonts.regular, fontSize: 13, color: todoColors.textMuted },
  divider: {
    height: 1,
    marginHorizontal: spacing.lg,
    backgroundColor: todoColors.line,
  },
  loader: { marginTop: 80 },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.lg,
    padding: spacing.xl,
  },
  message: {
    fontFamily: todoFonts.regular,
    fontSize: 15,
    color: todoColors.textMuted,
    textAlign: 'center',
  },
  retry: {
    minHeight: 44,
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
    borderRadius: 22,
    backgroundColor: todoColors.accent,
  },
  retryText: { fontFamily: todoFonts.bold, fontSize: 15, color: todoColors.text },
  listsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xl,
    paddingBottom: spacing.md,
  },
  listsTitle: { fontFamily: todoFonts.bold, fontSize: 16, color: todoColors.text },
  addNew: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
  addNewText: { fontFamily: todoFonts.medium, fontSize: 12, color: todoColors.textMuted },
  chips: { gap: spacing.sm, paddingHorizontal: spacing.xl },
  chip: {
    minHeight: 36,
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: todoColors.line,
  },
  chipSelected: { backgroundColor: todoColors.accent, borderColor: todoColors.accent },
  chipText: { fontFamily: todoFonts.regular, fontSize: 14, color: todoColors.textMuted },
  chipTextSelected: { fontFamily: todoFonts.bold, color: todoColors.text },
  stack: { flex: 1, paddingHorizontal: spacing.lg, paddingTop: spacing.xxl },
  stackLayer: {
    alignSelf: 'center',
    height: 10,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  stackLayerBack: { width: '84%', backgroundColor: todoColors.surface, opacity: 0.45 },
  stackLayerMiddle: { width: '92%', backgroundColor: todoColors.surface, opacity: 0.75 },
  card: {
    flex: 1,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    backgroundColor: todoColors.surface,
    overflow: 'hidden',
  },
  rows: { paddingBottom: 96 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: todoColors.line,
  },
  rowOpen: { backgroundColor: todoColors.surfaceRaised },
  rowMain: {
    flex: 1,
    minHeight: 56,
    justifyContent: 'center',
    gap: spacing.xs,
    paddingLeft: spacing.lg,
    paddingVertical: spacing.md,
  },
  rowTitle: { fontFamily: todoFonts.bold, fontSize: 15, color: todoColors.text },
  rowTitleDue: { color: todoColors.danger },
  rowTitleDone: { fontFamily: todoFonts.regular, color: todoColors.textMuted },
  rowDescription: { fontFamily: todoFonts.regular, fontSize: 13, color: todoColors.textMuted },
  rowPlan: { fontFamily: todoFonts.medium, fontSize: 12, color: todoColors.accentLight },
  rowSide: {
    alignItems: 'flex-end',
    justifyContent: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  rowDue: { fontFamily: todoFonts.medium, fontSize: 12, color: todoColors.textMuted },
  rowDueNow: { color: todoColors.danger },
  circle: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: todoColors.textMuted,
  },
  circleDone: { backgroundColor: todoColors.accent, borderColor: todoColors.accent },
  hint: {
    fontFamily: todoFonts.regular,
    fontSize: 13,
    color: todoColors.textMuted,
    textAlign: 'center',
    padding: spacing.lg,
  },
  error: {
    fontFamily: todoFonts.medium,
    fontSize: 14,
    color: todoColors.danger,
    textAlign: 'center',
    padding: spacing.sm,
  },
  composer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.lg,
    backgroundColor: todoColors.surfaceRaised,
  },
  input: {
    flex: 1,
    height: 44,
    paddingHorizontal: spacing.md,
    borderRadius: 10,
    backgroundColor: todoColors.background,
    color: todoColors.text,
    fontFamily: todoFonts.regular,
    fontSize: 16,
  },
  composerSave: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 22,
    backgroundColor: todoColors.accent,
  },
});
