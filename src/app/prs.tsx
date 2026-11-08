import { useRouter } from 'expo-router';
import { ChevronLeft, Lock } from 'lucide-react-native';
import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ActionButton, ScreenBackground } from '@/components/hud';
import { useProgress, type PrChange, type SkillProgress } from '@/lib/progress';
import { formatPr, parsePr, PR_UNITS } from '@/lib/progression';
import { colors, fonts, haptics, spacing } from '@/theme';

type Draft = { variant: string | null; text: string };

function variantsOf(skill: SkillProgress): (string | null)[] {
  return [...new Set(skill.levels.map((level) => level.variant))];
}

export default function PrsScreen() {
  const router = useRouter();
  const { skills, athlete, savePrs } = useProgress();
  const [drafts, setDrafts] = useState<Record<string, Draft>>(() =>
    Object.fromEntries(
      skills.map((skill) => [
        skill.id,
        {
          variant: skill.pr ? skill.pr.variant : variantsOf(skill)[0],
          text: skill.pr ? formatPr(skill.metric, skill.pr.value) : '',
        },
      ]),
    ),
  );
  const [invalid, setInvalid] = useState<string[]>([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function update(id: string, change: Partial<Draft>) {
    setDrafts((current) => ({ ...current, [id]: { ...current[id], ...change } }));
    setInvalid((current) => current.filter((item) => item !== id));
    setError(null);
  }

  async function save() {
    const changes: PrChange[] = [];
    const wrong: string[] = [];
    for (const skill of skills) {
      if (skill.locked) continue;
      const draft = drafts[skill.id];
      if (!draft.text.trim()) {
        if (skill.pr) changes.push({ skill_id: skill.id, variant: null, value: null });
        continue;
      }
      const value = parsePr(skill.metric, draft.text);
      if (value === null) {
        wrong.push(skill.id);
      } else if (value !== skill.pr?.value || draft.variant !== skill.pr?.variant) {
        changes.push({ skill_id: skill.id, variant: draft.variant, value });
      }
    }
    setInvalid(wrong);
    if (wrong.length > 0) {
      haptics.error();
      setError('Check the highlighted values.');
      return;
    }
    setBusy(true);
    setError(null);
    try {
      if (changes.length > 0) await savePrs(changes);
      haptics.success();
      router.back();
    } catch {
      haptics.error();
      setError("Couldn't save your PRs. Check your connection and try again.");
      setBusy(false);
    }
  }

  return (
    <View style={styles.root}>
      <ScreenBackground />
      <SafeAreaView style={styles.root}>
        <KeyboardAvoidingView
          style={styles.root}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          <View style={styles.header}>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Back"
              hitSlop={12}
              onPress={() => router.back()}>
              <ChevronLeft size={28} color={colors.text} />
            </Pressable>
            <Text style={styles.title}>PERSONAL RECORDS</Text>
            <View style={styles.headerSpacer} />
          </View>

          <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
            <Text style={styles.hint}>
              Barbell lifts: your best single rep. Leave a line empty to start at the skill&apos;s
              first level. Saving moves each skill, your XP and your level to match.
            </Text>

            {athlete.domains.map((domain) => (
              <View key={domain.id} style={styles.domain}>
                <Text style={styles.section}>{domain.name.toUpperCase()}</Text>
                {skills
                  .filter((skill) => skill.domainId === domain.id)
                  .map((skill) => (
                    <PrRow
                      key={skill.id}
                      skill={skill}
                      draft={drafts[skill.id]}
                      invalid={invalid.includes(skill.id)}
                      onChange={(change) => update(skill.id, change)}
                    />
                  ))}
              </View>
            ))}
          </ScrollView>

          <View style={styles.footer}>
            {error ? <Text style={styles.error}>{error}</Text> : null}
            <ActionButton label="SAVE PRS" loading={busy} onPress={save} />
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}

function PrRow({
  skill,
  draft,
  invalid,
  onChange,
}: {
  skill: SkillProgress;
  draft: Draft;
  invalid: boolean;
  onChange: (change: Partial<Draft>) => void;
}) {
  const variants = variantsOf(skill);

  if (skill.locked) {
    return (
      <View style={styles.row}>
        <View style={styles.rowMain}>
          <Text style={[styles.name, styles.muted]} numberOfLines={1}>
            {skill.name}
          </Text>
          <View style={styles.lockedInfo}>
            <Lock size={14} color={colors.textMuted} />
            <Text style={styles.lockedText}>Athlete level {skill.entryLevel}</Text>
          </View>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.row}>
      <View style={styles.rowMain}>
        <Text style={styles.name} numberOfLines={1}>
          {skill.name}
        </Text>
        <TextInput
          accessibilityLabel={`${skill.name} PR`}
          style={[styles.input, invalid && styles.inputInvalid]}
          value={draft.text}
          onChangeText={(text) => onChange({ text })}
          placeholder="—"
          placeholderTextColor={colors.textMuted}
          keyboardType={skill.metric === 'time' ? 'numbers-and-punctuation' : 'decimal-pad'}
          autoCorrect={false}
        />
        <Text style={styles.unit}>{PR_UNITS[skill.metric]}</Text>
      </View>
      {variants.length > 1 ? (
        <View style={styles.variants}>
          {variants.map((variant) => {
            const active = variant === draft.variant;
            return (
              <Pressable
                key={variant}
                accessibilityRole="radio"
                accessibilityLabel={`${skill.name}: ${variant}`}
                accessibilityState={{ selected: active }}
                onPress={() => onChange({ variant })}
                style={[styles.chip, active && styles.chipActive]}>
                <Text style={[styles.chipText, active && styles.chipTextActive]}>{variant}</Text>
              </Pressable>
            );
          })}
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.lg,
  },
  headerSpacer: { width: 28 },
  title: { fontFamily: fonts.display, fontSize: 16, letterSpacing: 2, color: colors.text },
  content: { paddingHorizontal: spacing.lg, paddingBottom: spacing.xl, gap: spacing.xl },
  hint: { fontFamily: fonts.body, fontSize: 17, color: colors.textMuted },
  domain: { gap: spacing.xs },
  section: {
    fontFamily: fonts.display,
    fontSize: 14,
    letterSpacing: 3,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  row: {
    gap: spacing.sm,
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.line,
  },
  rowMain: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, minHeight: 44 },
  name: { flex: 1, fontFamily: fonts.bodySemi, fontSize: 18, color: colors.text },
  muted: { color: colors.textMuted },
  lockedInfo: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
  lockedText: { fontFamily: fonts.body, fontSize: 15, color: colors.textMuted },
  input: {
    width: 84,
    height: 44,
    paddingHorizontal: spacing.sm,
    textAlign: 'right',
    backgroundColor: colors.surfaceRaised,
    borderWidth: 1,
    borderColor: colors.line,
    color: colors.text,
    fontFamily: fonts.bodyBold,
    fontSize: 18,
  },
  inputInvalid: { borderColor: colors.danger },
  unit: { width: 44, fontFamily: fonts.body, fontSize: 15, color: colors.textMuted },
  variants: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  chip: {
    minHeight: 34,
    justifyContent: 'center',
    paddingHorizontal: spacing.md,
    borderWidth: 1,
    borderColor: colors.line,
  },
  chipActive: { borderColor: colors.rx, backgroundColor: colors.surfaceRaised },
  chipText: { fontFamily: fonts.bodySemi, fontSize: 15, color: colors.textMuted },
  chipTextActive: { color: colors.rx },
  footer: { padding: spacing.lg, gap: spacing.sm },
  error: { fontFamily: fonts.bodySemi, fontSize: 16, color: colors.danger },
});
