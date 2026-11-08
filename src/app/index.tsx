import { useRouter } from 'expo-router';
import {
  ChevronDown,
  ChevronRight,
  ChevronUp,
  Lock,
  LogOut,
  Radar,
  Trophy,
} from 'lucide-react-native';
import { useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ActionButton, Hex, LevelBar, Panel, RankTag, ScreenBackground } from '@/components/hud';
import { useProgress, type SkillProgress } from '@/lib/progress';
import { MAX_LEVEL, missionText, rankForLevel, xpToReachLevel } from '@/lib/progression';
import { supabase } from '@/lib/supabase';
import { colors, fonts, haptics, spacing } from '@/theme';

export default function Home() {
  const router = useRouter();
  const { skills, athlete, status, reload } = useProgress();
  const [openDomain, setOpenDomain] = useState<string | null>(null);
  const global = athlete.level;
  const rank = rankForLevel(global);
  // The XP is enough for the next rank, but a domain is holding it back.
  const blockingDomains =
    athlete.xp_level > global ? athlete.domains.filter((d) => d.average < global + 1) : [];

  return (
    <View style={styles.root}>
      <ScreenBackground />
      <SafeAreaView style={styles.root}>
        <ScrollView contentContainerStyle={styles.content}>
          <View style={styles.header}>
            <Text style={styles.logo}>FORGE</Text>
            <View style={styles.headerActions}>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Personal records"
                hitSlop={12}
                onPress={() => router.push('/prs')}
                style={styles.prLink}>
                <Trophy size={20} color={colors.rx} />
                <Text style={styles.prLinkText}>PRS</Text>
              </Pressable>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Sign out"
                hitSlop={12}
                onPress={() => supabase.auth.signOut()}>
                <LogOut size={22} color={colors.textMuted} />
              </Pressable>
            </View>
          </View>

          {status === 'loading' && skills.length === 0 ? (
            <ActivityIndicator color={colors.rx} size="large" style={styles.loader} />
          ) : status === 'error' ? (
            <Panel accent={colors.danger} style={styles.errorPanel}>
              <Text style={styles.errorText}>Couldn&apos;t load your progress.</Text>
              <ActionButton label="RETRY" onPress={reload} />
            </Panel>
          ) : (
            <>
              <Panel accent={rank.color} style={styles.athlete}>
                <View style={styles.athleteRow}>
                  <Hex size={104} fill={colors.surfaceRaised} stroke={rank.color} strokeWidth={4}>
                    <Text style={[styles.athleteLevel, { color: rank.color }]}>{global}</Text>
                  </Hex>
                  <View style={styles.athleteInfo}>
                    <Text style={styles.eyebrow}>ATHLETE LEVEL</Text>
                    <Text style={[styles.rankName, { color: rank.color }]} numberOfLines={1}>
                      {rank.name.toUpperCase()}
                    </Text>
                    <Text style={styles.rankRange}>
                      {athlete.xp.toLocaleString('en-US')} XP
                      {global < MAX_LEVEL && blockingDomains.length === 0
                        ? ` · ${(xpToReachLevel(global + 1) - athlete.xp).toLocaleString('en-US')} to level ${global + 1}`
                        : ''}
                    </Text>
                  </View>
                </View>
                <LevelBar filled={global} />
                {blockingDomains.length > 0 ? (
                  <View style={styles.lock}>
                    <Lock size={16} color={colors.danger} />
                    <Text style={styles.lockText}>
                      {rankForLevel(global + 1).name} locked:{' '}
                      {blockingDomains.map((d) => d.name).join(' and ')} must reach level{' '}
                      {global + 1}
                    </Text>
                  </View>
                ) : null}
              </Panel>

              {skills.every((skill) => !skill.pr) ? (
                <Panel accent={colors.rx} style={styles.placement}>
                  <Text style={styles.placementText}>
                    Enter your PRs to start every skill at your real level.
                  </Text>
                  <ActionButton label="ENTER MY PRS" onPress={() => router.push('/prs')} />
                </Panel>
              ) : null}

              {athlete.domains.map((domain) => {
                const domainLevel = Math.floor(domain.average);
                const domainRank = rankForLevel(domainLevel);
                const open = openDomain === domain.id;
                const Chevron = open ? ChevronUp : ChevronDown;
                return (
                  <View key={domain.id} style={styles.domain}>
                    <Pressable
                      accessibilityRole="button"
                      accessibilityLabel={`${domain.name} category`}
                      accessibilityState={{ expanded: open }}
                      onPress={() => {
                        haptics.tap();
                        setOpenDomain(open ? null : domain.id);
                      }}
                      style={({ pressed }) => pressed && styles.pressed}>
                      <Panel accent={domainRank.color} style={styles.card}>
                        <Hex size={56} fill={colors.surfaceRaised} stroke={domainRank.color}>
                          <Text style={[styles.cardLevel, { color: domainRank.color }]}>
                            {domainLevel}
                          </Text>
                        </Hex>
                        <View style={styles.cardInfo}>
                          <Text style={styles.domainName} numberOfLines={1}>
                            {domain.name.toUpperCase()}
                          </Text>
                          <RankTag level={domainLevel} />
                        </View>
                        <Chevron size={24} color={colors.textMuted} />
                      </Panel>
                    </Pressable>
                    {open
                      ? skills
                          .filter((skill) => skill.domainId === domain.id)
                          .map((skill) => <SkillCard key={skill.id} skill={skill} />)
                      : null}
                  </View>
                );
              })}

              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Stats"
                onPress={() => {
                  haptics.tap();
                  router.push('/stats');
                }}
                style={({ pressed }) => pressed && styles.pressed}>
                <Panel accent={colors.rx} style={styles.card}>
                  <Radar size={28} color={colors.rx} />
                  <Text style={[styles.domainName, styles.statsLabel]}>STATS</Text>
                  <ChevronRight size={24} color={colors.textMuted} />
                </Panel>
              </Pressable>
            </>
          )}
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

function SkillCard({ skill }: { skill: SkillProgress }) {
  const router = useRouter();
  const mission = skill.levels.find((item) => item.level === skill.level);
  const rank = rankForLevel(skill.level);
  const accent = skill.locked ? colors.line : rank.color;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={
        skill.locked ? `${skill.name}, locked` : `${skill.name}, level ${skill.level}`
      }
      accessibilityState={{ disabled: skill.locked }}
      disabled={skill.locked}
      onPress={() => {
        haptics.tap();
        router.push({ pathname: '/skill/[id]', params: { id: skill.id } });
      }}
      style={({ pressed }) => pressed && styles.pressed}>
      <Panel accent={accent} style={styles.card}>
        <Hex size={48} fill={colors.surfaceRaised} stroke={accent}>
          {skill.locked ? (
            <Lock size={16} color={colors.textMuted} />
          ) : (
            <Text style={[styles.cardLevel, { color: rank.color }]}>{skill.level}</Text>
          )}
        </Hex>
        <View style={styles.cardInfo}>
          <Text style={[styles.cardName, skill.locked && styles.muted]} numberOfLines={1}>
            {skill.name.toUpperCase()}
          </Text>
          <Text style={styles.mission} numberOfLines={1}>
            {skill.locked
              ? `Unlocks at athlete level ${skill.entryLevel}`
              : skill.mastered
                ? 'All levels cleared'
                : mission
                  ? [missionText(skill.metric, mission), mission.variant]
                      .filter(Boolean)
                      .join(' · ')
                  : ''}
          </Text>
        </View>
        {skill.locked ? null : <ChevronRight size={22} color={colors.textMuted} />}
      </Panel>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  content: { padding: spacing.lg, gap: spacing.lg },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  logo: { fontFamily: fonts.displayHeavy, fontSize: 24, letterSpacing: 5, color: colors.rx },
  loader: { marginTop: 80 },
  errorPanel: { gap: spacing.lg },
  errorText: { fontFamily: fonts.bodySemi, fontSize: 18, color: colors.text },
  athlete: { gap: spacing.lg },
  athleteRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.lg },
  athleteLevel: { fontFamily: fonts.displayHeavy, fontSize: 36 },
  athleteInfo: { flex: 1, gap: 2 },
  eyebrow: { fontFamily: fonts.bodyBold, fontSize: 13, letterSpacing: 2, color: colors.textMuted },
  rankName: { fontFamily: fonts.displayHeavy, fontSize: 22 },
  rankRange: { fontFamily: fonts.body, fontSize: 16, color: colors.textMuted },
  lock: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  lockText: { flex: 1, fontFamily: fonts.bodySemi, fontSize: 16, color: colors.danger },
  domain: { gap: spacing.md },
  domainName: { fontFamily: fonts.display, fontSize: 16, letterSpacing: 2, color: colors.text },
  statsLabel: { flex: 1 },
  card: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, padding: spacing.md },
  cardLevel: { fontFamily: fonts.display, fontSize: 16 },
  cardInfo: { flex: 1, gap: 2 },
  cardName: { fontFamily: fonts.display, fontSize: 14, letterSpacing: 1, color: colors.text },
  muted: { color: colors.textMuted },
  mission: { fontFamily: fonts.bodySemi, fontSize: 16, color: colors.textMuted },
  pressed: { opacity: 0.8 },
  headerActions: { flexDirection: 'row', alignItems: 'center', gap: spacing.xl },
  prLink: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
  prLinkText: { fontFamily: fonts.display, fontSize: 13, letterSpacing: 1, color: colors.text },
  placement: { gap: spacing.md },
  placementText: { fontFamily: fonts.bodySemi, fontSize: 17, color: colors.text },
});
