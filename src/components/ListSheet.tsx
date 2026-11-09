import { Check, Trash2, X } from 'lucide-react-native';
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

import type { TodoList } from '@/lib/todos';
import { haptics, listColors, spacing, todoColors, todoFonts } from '@/theme';

/** Creates a list, or edits the one it is given. */
export function ListSheet({
  list,
  onSave,
  onDelete,
  onClose,
}: {
  list: TodoList | null;
  onSave: (name: string, color: string) => Promise<void>;
  onDelete: () => void;
  onClose: () => void;
}) {
  const [name, setName] = useState(list?.name ?? '');
  const [color, setColor] = useState(list?.color ?? listColors[0].value);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const canSave = !!name.trim() && !saving;

  async function save() {
    if (!canSave) return;
    setSaving(true);
    setError(null);
    try {
      await onSave(name.trim(), color);
    } catch {
      haptics.error();
      setError("Couldn't save. Check your connection and try again.");
      setSaving(false);
    }
  }

  return (
    <KeyboardAvoidingView behavior="padding" style={styles.backdrop}>
      <View style={styles.sheet}>
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <View style={styles.header}>
            <Text style={styles.heading}>{list ? 'Edit list' : 'New list'}</Text>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Close"
              hitSlop={12}
              onPress={onClose}>
              <X size={24} color={todoColors.textMuted} />
            </Pressable>
          </View>

          <TextInput
            accessibilityLabel="List name"
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder="Name"
            placeholderTextColor={todoColors.textMuted}
            maxLength={60}
            autoFocus={!list}
            returnKeyType="done"
            onSubmitEditing={save}
          />

          <View style={styles.colors}>
            {listColors.map((option) => {
              const selected = option.value === color;
              return (
                <Pressable
                  key={option.value}
                  accessibilityRole="radio"
                  accessibilityLabel={option.name}
                  accessibilityState={{ checked: selected }}
                  onPress={() => {
                    haptics.tap();
                    setColor(option.value);
                  }}
                  style={[styles.swatch, { backgroundColor: option.value }]}>
                  {selected ? (
                    <Check size={22} color={todoColors.onAccent} strokeWidth={3.5} />
                  ) : null}
                </Pressable>
              );
            })}
          </View>

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

          {list ? (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Delete list"
              disabled={saving}
              onPress={onDelete}
              style={styles.delete}>
              <Trash2 size={18} color={todoColors.danger} />
              <Text style={styles.deleteText}>Delete</Text>
            </Pressable>
          ) : null}
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
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  heading: { fontFamily: todoFonts.bold, fontSize: 18, color: todoColors.text },
  input: {
    minHeight: 46,
    paddingHorizontal: spacing.md,
    borderRadius: 10,
    backgroundColor: todoColors.background,
    color: todoColors.text,
    fontFamily: todoFonts.regular,
    fontSize: 16,
  },
  colors: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md },
  swatch: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
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
