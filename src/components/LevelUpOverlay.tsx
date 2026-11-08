import { StyleSheet, Text, View } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';

import { ActionButton, Hex } from '@/components/hud';
import type { ValidationResult } from '@/lib/progress';
import { missionText, rankForLevel } from '@/lib/progression';
import { colors, fonts, spacing } from '@/theme';

export function LevelUpOverlay({
  result,
  onClose,
}: {
  result: ValidationResult;
  onClose: () => void;
}) {
  const { skill, xpGained, globalBefore, globalAfter } = result;
  const rank = rankForLevel(skill.level);
  const rankedUp = rankForLevel(skill.level - 1).name !== rank.name;
  const next = skill.levels.find((item) => item.level === skill.level);
  const globalRank = rankForLevel(globalAfter);
  const globalRankedUp = rankForLevel(globalBefore).name !== globalRank.name;

  return (
    <Animated.View entering={FadeIn.duration(180)} style={styles.backdrop}>
      <View style={styles.badge}>
        <Hex size={150} fill={colors.surface} stroke={rank.color} strokeWidth={4}>
          <Text style={[styles.badgeLevel, { color: rank.color }]}>
            {skill.mastered ? 'MAX' : skill.level}
          </Text>
        </Hex>
      </View>

      <Text style={[styles.title, { color: rank.color }]}>
        {skill.mastered ? 'SKILL MASTERED' : 'LEVEL UP'}
      </Text>
      <Text style={styles.line}>
        {skill.mastered
          ? `All 30 ${skill.name} levels cleared.`
          : `${skill.name} is now level ${skill.level}`}
      </Text>

      <Text style={[styles.highlight, { color: rank.color }]}>
        +{xpGained.toLocaleString('en-US')} XP
      </Text>

      {rankedUp && !skill.mastered ? (
        <Text style={[styles.highlight, { color: rank.color }]}>
          New skill rank: {rank.name.toUpperCase()}
        </Text>
      ) : null}
      {globalAfter > globalBefore ? (
        <Text style={[styles.highlight, { color: globalRank.color }]}>
          {globalRankedUp
            ? `Athlete rank up: ${globalRank.name.toUpperCase()}`
            : `Athlete level ${globalAfter}`}
        </Text>
      ) : null}

      {next && !skill.mastered ? (
        <View style={styles.next}>
          <Text style={styles.nextLabel}>NEXT MISSION</Text>
          <Text style={styles.nextValue}>{missionText(skill.metric, next)}</Text>
        </View>
      ) : null}

      <View style={styles.action}>
        <ActionButton label="CONTINUE" color={rank.color} onPress={onClose} />
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(6, 8, 15, 0.96)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
    gap: spacing.sm,
  },
  badge: { marginBottom: spacing.lg },
  badgeLevel: { fontFamily: fonts.displayHeavy, fontSize: 46 },
  title: { fontFamily: fonts.displayHeavy, fontSize: 30, letterSpacing: 2, textAlign: 'center' },
  line: { fontFamily: fonts.bodySemi, fontSize: 19, color: colors.text, textAlign: 'center' },
  highlight: { fontFamily: fonts.display, fontSize: 13, letterSpacing: 1, textAlign: 'center' },
  next: { alignItems: 'center', marginTop: spacing.xl },
  nextLabel: {
    fontFamily: fonts.bodyBold,
    fontSize: 13,
    letterSpacing: 2,
    color: colors.textMuted,
  },
  nextValue: { fontFamily: fonts.display, fontSize: 24, color: colors.text },
  action: { alignSelf: 'stretch', marginTop: spacing.xl },
});
