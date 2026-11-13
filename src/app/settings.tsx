import { useRouter } from 'expo-router';
import { Bell, ChevronLeft } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import {
  KeyboardAvoidingView,
  Linking,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { parseTime } from '@/lib/events';
import {
  DEFAULT_RECAP_TIME,
  getRecapTime,
  sendTestRecap,
  setRecapTime,
  type TestResult,
} from '@/lib/recap';
import { haptics, spacing, todoColors, todoFonts } from '@/theme';

type TestState = { status: 'idle' | 'sending' } | TestResult;

const TEST_MESSAGES: Record<TestResult['status'], string> = {
  sent: 'Sent. It shows tomorrow as it stands now.',
  denied: 'Notifications are turned off for Forge. Allow them in your phone settings.',
  unsupported: 'Notifications are only available in the mobile app.',
  unavailable:
    "This build of the app doesn't include notifications. Install a new build to use them.",
  load: "Couldn't load your todos and events. Check your connection and try again.",
  failed: "Couldn't show the notification.",
};

export default function SettingsScreen() {
  const router = useRouter();
  // The saved time, and what is being typed.
  const [saved, setSaved] = useState(DEFAULT_RECAP_TIME);
  const [time, setTime] = useState(DEFAULT_RECAP_TIME);
  const [timeError, setTimeError] = useState<string | null>(null);
  const [justSaved, setJustSaved] = useState(false);
  const [test, setTest] = useState<TestState>({ status: 'idle' });

  useEffect(() => {
    getRecapTime().then((stored) => {
      setSaved(stored);
      setTime(stored);
    });
  }, []);

  const changed = time.trim() !== saved;

  async function saveTime() {
    const parsed = parseTime(time);
    if (!parsed) {
      haptics.error();
      setTimeError('Use a time like 20:00 or 19h30.');
      return;
    }
    try {
      await setRecapTime(parsed);
      haptics.success();
      setSaved(parsed);
      setTime(parsed);
      setJustSaved(true);
    } catch {
      haptics.error();
      setTimeError("Couldn't save the time. Try again.");
    }
  }

  async function sendTest() {
    haptics.tap();
    setTest({ status: 'sending' });
    const result = await sendTestRecap();
    if (result.status === 'sent') haptics.success();
    else haptics.error();
    setTest(result);
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
          <Text style={styles.title}>Settings</Text>
        </View>
        <View style={styles.divider} />

        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <View style={styles.sectionHeader}>
            <Bell size={18} color={todoColors.accentLight} />
            <Text style={styles.sectionTitle}>Evening recap</Text>
          </View>
          <Text style={styles.note}>
            The day before, a notification lists the todos and events planned for the next day.
          </Text>

          <View style={styles.card}>
            <View style={styles.row}>
              <Text style={styles.label}>Time</Text>
              <TextInput
                accessibilityLabel="Recap time"
                style={[styles.input, timeError && styles.inputInvalid]}
                value={time}
                onChangeText={(text) => {
                  setTime(text);
                  setTimeError(null);
                  setJustSaved(false);
                }}
                onSubmitEditing={() => changed && saveTime()}
                placeholder={DEFAULT_RECAP_TIME}
                placeholderTextColor={todoColors.textMuted}
                keyboardType="numbers-and-punctuation"
                returnKeyType="done"
                maxLength={5}
              />
              <Pressable
                accessibilityRole="button"
                accessibilityState={{ disabled: !changed }}
                disabled={!changed}
                onPress={saveTime}
                style={[styles.save, !changed && styles.disabled]}>
                <Text style={styles.saveText}>Save</Text>
              </Pressable>
            </View>
          </View>
          {timeError ? <Text style={styles.error}>{timeError}</Text> : null}
          {justSaved ? <Text style={styles.success}>Recap set for {saved}.</Text> : null}

          <Pressable
            accessibilityRole="button"
            disabled={test.status === 'sending'}
            onPress={sendTest}
            style={({ pressed }) => [
              styles.test,
              (pressed || test.status === 'sending') && styles.pressed,
            ]}>
            <Text style={styles.testText}>
              {test.status === 'sending' ? 'Sending…' : 'Send a test notification'}
            </Text>
          </Pressable>
          {test.status !== 'idle' && test.status !== 'sending' ? (
            <Text style={test.status === 'sent' ? styles.success : styles.error}>
              {TEST_MESSAGES[test.status]}
            </Text>
          ) : null}
          {'detail' in test ? <Text style={styles.detail}>{test.detail}</Text> : null}
          {test.status === 'denied' ? (
            <Pressable accessibilityRole="button" onPress={() => Linking.openSettings()}>
              <Text style={styles.link}>Open phone settings</Text>
            </Pressable>
          ) : null}
        </ScrollView>
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
  content: { padding: spacing.xl, gap: spacing.md },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  sectionTitle: { fontFamily: todoFonts.bold, fontSize: 16, color: todoColors.text },
  note: { fontFamily: todoFonts.regular, fontSize: 14, color: todoColors.textMuted },
  card: { borderRadius: 12, backgroundColor: todoColors.surface, padding: spacing.lg },
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  label: { flex: 1, fontFamily: todoFonts.medium, fontSize: 15, color: todoColors.text },
  input: {
    width: 84,
    minHeight: 44,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: todoColors.line,
    backgroundColor: todoColors.surfaceRaised,
    color: todoColors.text,
    fontFamily: todoFonts.bold,
    fontSize: 16,
    textAlign: 'center',
  },
  inputInvalid: { borderColor: todoColors.danger },
  save: {
    minHeight: 44,
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
    borderRadius: 22,
    backgroundColor: todoColors.accent,
  },
  saveText: { fontFamily: todoFonts.bold, fontSize: 15, color: todoColors.text },
  disabled: { opacity: 0.4 },
  test: {
    minHeight: 48,
    marginTop: spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: todoColors.accent,
  },
  testText: { fontFamily: todoFonts.bold, fontSize: 15, color: todoColors.accentLight },
  pressed: { opacity: 0.6 },
  success: { fontFamily: todoFonts.medium, fontSize: 14, color: todoColors.accentLight },
  error: { fontFamily: todoFonts.medium, fontSize: 14, color: todoColors.danger },
  detail: { fontFamily: todoFonts.regular, fontSize: 12, color: todoColors.textMuted },
  link: {
    fontFamily: todoFonts.bold,
    fontSize: 14,
    color: todoColors.text,
    textDecorationLine: 'underline',
  },
});
