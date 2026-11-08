import { Pressable, StyleSheet, Text, View } from 'react-native';

import { spacing, todoColors, todoFonts } from '@/theme';

/** Asks before something is deleted. Rendered above the rest of a Todo or Calendar screen. */
export function ConfirmDialog({
  title,
  message,
  confirmLabel = 'Delete',
  onConfirm,
  onCancel,
}: {
  title: string;
  message: string;
  confirmLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <View style={styles.backdrop}>
      <View accessibilityRole="alert" style={styles.dialog}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.message}>{message}</Text>
        <View style={styles.actions}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Cancel"
            onPress={onCancel}
            style={[styles.button, styles.cancel]}>
            <Text style={styles.cancelText}>Cancel</Text>
          </Pressable>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Confirm delete"
            onPress={onConfirm}
            style={[styles.button, styles.confirm]}>
            <Text style={styles.confirmText}>{confirmLabel}</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFill,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
    backgroundColor: 'rgba(16, 17, 34, 0.8)',
  },
  dialog: {
    alignSelf: 'stretch',
    gap: spacing.md,
    padding: spacing.xl,
    borderRadius: 16,
    backgroundColor: todoColors.surfaceRaised,
  },
  title: { fontFamily: todoFonts.bold, fontSize: 18, color: todoColors.text },
  message: { fontFamily: todoFonts.regular, fontSize: 15, color: todoColors.textMuted },
  actions: { flexDirection: 'row', gap: spacing.md, marginTop: spacing.sm },
  button: {
    flex: 1,
    minHeight: 48,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 24,
  },
  cancel: { borderWidth: 1, borderColor: todoColors.line },
  cancelText: { fontFamily: todoFonts.medium, fontSize: 15, color: todoColors.text },
  confirm: { backgroundColor: todoColors.danger },
  confirmText: { fontFamily: todoFonts.bold, fontSize: 15, color: todoColors.onAccent },
});
