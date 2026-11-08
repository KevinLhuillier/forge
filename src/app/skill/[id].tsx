import { useLocalSearchParams, useRouter } from 'expo-router';
import { Check, ChevronLeft, Lock } from 'lucide-react-native';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { HoldButton } from '@/components/HoldButton';
import { Hex, LevelBar, Panel, RankTag, ScreenBackground } from '@/components/hud';
import { LevelUpOverlay } from '@/components/LevelUpOverlay';
import { useProgress, type SkillLevel, type ValidationResult } from '@/lib/progress';
import {
  EFFORT_LABELS,
  formatKg,
  missionValue,
  RANKS,
  rankForLevel,
  type Rank,
} from '@/lib/progression';
import { colors, fonts, haptics, spacing } from '@/theme';

export default function SkillScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { skills, validate, downgrade } = useProgress();
  const skill = skills.find((item) => item.id === id);
  const [selected, setSelected] = useState<number | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ValidationResult | null>(null);

  if (!skill) return <View style={styles.root} />;

  const shown = selected ?? skill.level;
  const mission = skill.levels.find((item) => item.level === shown);
  const rank = rankForLevel(shown);
  const cleared = shown <= skill.validated;
  const isCurrent = shown === skill.level && !skill.mastered;

  async function complete(level: number) {
    setBusy(true);
    setError(null);
    try {
      setResult(await validate(id, level));
      setSelected(null);
    } catch {
      haptics.error();
      setError("Couldn't save this level. Check your connection and try again.");
    } finally {
      setBusy(false);
    }
  }

  async function restartFrom(level: number) {
    setBusy(true);
    setError(null);
    try {
      await downgrade(id, level);
      setSelected(null);
    } catch {
      haptics.error();
      setError("Couldn't change your level. Check your connection and try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <View style={styles.root}>
      <ScreenBackground />
      <SafeAreaView style={styles.root}>
        <ScrollView contentContainerStyle={styles.content}>
          <View style={styles.header}>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Back"
              hitSlop={12}
              onPress={() => router.back()}>
              <ChevronLeft size={28} color={colors.text} />
            </Pressable>
            <Text style={styles.title} numberOfLines={2}>
              {skill.name.toUpperCase()}
            </Text>
            <View style={styles.headerSpacer} />
          </View>

          {mission ? (
            <Panel accent={rank.color} style={styles.mission}>
              <View style={styles.missionTop}>
                <Text style={styles.missionLevel}>LEVEL {mission.level}</Text>
                <RankTag level={mission.level} />
              </View>
              {skill.metric === 'one_rm' ? (
                <View style={styles.setRow}>
                  <Text style={[styles.setValue, { color: rank.color }]}>{mission.reps}</Text>
                  <Text style={styles.setUnit}>REPS</Text>
                  <Text style={styles.setTimes}>×</Text>
                  <Text style={[styles.setValue, { color: rank.color }]}>
                    {formatKg(mission.weight_kg ?? 0)}
                  </Text>
                  <Text style={styles.setUnit}>KG</Text>
                </View>
              ) : (
                <View style={styles.setRow}>
                  <Text style={[styles.setValue, { color: rank.color }]}>
                    {missionValue(skill.metric, mission.target).value}
                  </Text>
                  <Text style={styles.setUnit}>
                    {missionValue(skill.metric, mission.target).unit}
                  </Text>
                </View>
              )}
              <Text style={styles.target}>
                {skill.metric === 'one_rm'
                  ? `Proves a ${formatKg(mission.target)} kg 1RM · 1 set`
                  : [mission.variant, EFFORT_LABELS[skill.metric]].filter(Boolean).join(' · ')}
              </Text>

              {isCurrent ? (
                <>
                  <HoldButton
                    label="HOLD WHEN SET IS DONE"
                    color={rank.color}
                    busy={busy}
                    onComplete={() => complete(mission.level)}
                  />
                  {error ? <Text style={styles.error}>{error}</Text> : null}
                </>
              ) : cleared ? (
                <>
                  <Text style={[styles.state, { color: rank.color }]}>
                    Cleared on{' '}
                    {new Date(skill.completedAt[mission.level]).toLocaleDateString('en-GB')}
                  </Text>
                  <Text style={styles.state}>
                    Back from a break? Restart here. You lose the XP from level {mission.level}
                    {skill.validated > mission.level ? ` to ${skill.validated}` : ''} until you
                    validate again.
                  </Text>
                  <HoldButton
                    label="HOLD TO RESTART HERE"
                    color={colors.danger}
                    busy={busy}
                    onComplete={() => restartFrom(mission.level)}
                  />
                  {error ? <Text style={styles.error}>{error}</Text> : null}
                </>
              ) : (
                <Text style={styles.state}>Locked. Clear level {skill.level} first.</Text>
              )}
            </Panel>
          ) : null}

          <LevelBar filled={skill.validated} />

          {RANKS.filter((tier) => tier.max >= skill.entryLevel).map((tier) => (
            <TierGrid
              key={tier.name}
              tier={tier}
              levels={skill.levels.filter(
                (item) => item.level >= tier.min && item.level <= tier.max,
              )}
              validated={skill.validated}
              current={skill.mastered ? null : skill.level}
              selected={shown}
              onSelect={(level) => {
                haptics.tap();
                setError(null);
                setSelected(level);
              }}
            />
          ))}
        </ScrollView>
      </SafeAreaView>
      {result ? <LevelUpOverlay result={result} onClose={() => setResult(null)} /> : null}
    </View>
  );
}

function TierGrid({
  tier,
  levels,
  validated,
  current,
  selected,
  onSelect,
}: {
  tier: Rank;
  levels: SkillLevel[];
  validated: number;
  current: number | null;
  selected: number;
  onSelect: (level: number) => void;
}) {
  return (
    <View style={styles.tier}>
      <View style={styles.tierHeader}>
        <Text style={[styles.tierName, { color: tier.color }]}>{tier.name.toUpperCase()}</Text>
        <View style={[styles.tierLine, { backgroundColor: tier.color }]} />
      </View>
      <View style={styles.grid}>
        {levels.map(({ level }) => {
          const cleared = level <= validated;
          const isCurrent = level === current;
          const isSelected = level === selected;
          const state = cleared ? 'cleared' : isCurrent ? 'current' : 'locked';
          return (
            <Pressable
              key={level}
              accessibilityRole="button"
              accessibilityLabel={`Level ${level}, ${state}`}
              accessibilityState={{ selected: isSelected }}
              onPress={() => onSelect(level)}
              style={styles.cell}>
              <Hex
                size={56}
                fill={cleared ? tier.color : colors.surfaceRaised}
                stroke={isCurrent || isSelected ? tier.color : colors.line}
                strokeWidth={isSelected ? 7 : 3}>
                {cleared ? (
                  <Check size={22} color={colors.onAccent} strokeWidth={3} />
                ) : isCurrent ? (
                  <Text style={[styles.nodeLevel, { color: tier.color }]}>{level}</Text>
                ) : (
                  <Lock size={16} color={colors.textMuted} />
                )}
              </Hex>
              <Text style={styles.nodeCaption}>{level}</Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  content: { padding: spacing.lg, gap: spacing.lg, paddingBottom: spacing.xxl },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  headerSpacer: { width: 28 },
  title: {
    flex: 1,
    textAlign: 'center',
    fontFamily: fonts.display,
    fontSize: 20,
    letterSpacing: 3,
    color: colors.text,
  },
  mission: { gap: spacing.md },
  missionTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  missionLevel: { fontFamily: fonts.display, fontSize: 16, letterSpacing: 2, color: colors.text },
  setRow: { flexDirection: 'row', alignItems: 'baseline', flexWrap: 'wrap', gap: spacing.sm },
  setValue: { fontFamily: fonts.displayHeavy, fontSize: 46 },
  setUnit: { fontFamily: fonts.display, fontSize: 14, color: colors.textMuted },
  setTimes: { fontFamily: fonts.bodyBold, fontSize: 26, color: colors.textMuted },
  target: { fontFamily: fonts.bodySemi, fontSize: 17, color: colors.textMuted },
  state: { fontFamily: fonts.bodySemi, fontSize: 17, color: colors.textMuted },
  error: { fontFamily: fonts.bodySemi, fontSize: 16, color: colors.danger },
  tier: { gap: spacing.md },
  tierHeader: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  tierName: { fontFamily: fonts.display, fontSize: 13, letterSpacing: 2 },
  tierLine: { flex: 1, height: 1, opacity: 0.4 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', rowGap: spacing.md },
  cell: { width: '20%', alignItems: 'center', gap: 2 },
  nodeLevel: { fontFamily: fonts.display, fontSize: 18 },
  nodeCaption: { fontFamily: fonts.bodySemi, fontSize: 13, color: colors.textMuted },
});
