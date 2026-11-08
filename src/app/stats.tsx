import { useRouter } from 'expo-router';
import { ChevronLeft } from 'lucide-react-native';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Panel, ScreenBackground } from '@/components/hud';
import { RadarChart } from '@/components/RadarChart';
import { useProgress } from '@/lib/progress';
import { colors, fonts, spacing } from '@/theme';

// Names short enough to sit around a chart of 15 axes.
const SHORT_NAMES: Record<string, string> = {
  run: 'Run',
  row: 'Row',
  bike: 'Bike',
  skierg: 'Ski',
  'jump-rope': 'Rope',
  burpee: 'Burpee',
  'box-jump': 'Box Jump',
  'strict-pull-up': 'Strict PU',
  'kipping-pull-up': 'Kipping',
  'push-up': 'Push-up',
  'air-squat': 'Air Squat',
  'sit-up': 'Sit-up',
  'toes-to-bar': 'T2B',
  'muscle-up': 'MU',
  hspu: 'HSPU',
  'strict-hspu': 'S. HSPU',
  'handstand-walk': 'HS Walk',
  'rope-climb': 'Climb',
  'l-sit': 'L-Sit',
  dip: 'Dip',
  lunge: 'Lunge',
  'pistol-squat': 'Pistol',
  deadlift: 'Deadlift',
  'front-squat': 'Front Sq',
  'overhead-squat': 'OHS',
  'back-squat': 'Back Sq',
  'push-press': 'Push Pr',
  'strict-press': 'Strict Pr',
  clean: 'Clean',
  'clean-and-jerk': 'C&J',
  'db-snatch': 'DB Snatch',
  'db-clean-and-jerk': 'DB C&J',
  snatch: 'Snatch',
  thruster: 'Thruster',
  'kb-russian-swing': 'KB Rus',
  'kb-american-swing': 'KB Am',
  'wall-ball': 'Wall Ball',
};

export default function StatsScreen() {
  const router = useRouter();
  const { skills, athlete } = useProgress();

  return (
    <View style={styles.root}>
      <ScreenBackground />
      <SafeAreaView style={styles.root}>
        <View style={styles.header}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Back"
            hitSlop={12}
            onPress={() => router.back()}>
            <ChevronLeft size={28} color={colors.text} />
          </Pressable>
          <Text style={styles.title}>STATS</Text>
          <View style={styles.headerSpacer} />
        </View>

        <ScrollView contentContainerStyle={styles.content}>
          <Panel accent={colors.rx} style={styles.panel}>
            <Text style={styles.chartTitle}>ALL CATEGORIES</Text>
            <RadarChart
              axes={athlete.domains.map((domain) => ({
                key: domain.id,
                label: domain.name,
                name: domain.name,
                value: domain.average,
              }))}
            />
          </Panel>

          {athlete.domains.map((domain) => (
            <Panel key={domain.id} accent={colors.rx} style={styles.panel}>
              <Text style={styles.chartTitle}>{domain.name.toUpperCase()}</Text>
              <RadarChart
                axes={skills
                  .filter((skill) => skill.domainId === domain.id)
                  .map((skill) => ({
                    key: skill.id,
                    label: SHORT_NAMES[skill.id] ?? skill.name,
                    name: skill.name,
                    value: skill.locked ? 0 : skill.level,
                    locked: skill.locked,
                  }))}
              />
            </Panel>
          ))}
        </ScrollView>
      </SafeAreaView>
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
  title: { fontFamily: fonts.display, fontSize: 20, letterSpacing: 3, color: colors.text },
  content: { paddingHorizontal: spacing.lg, paddingBottom: spacing.xxl, gap: spacing.lg },
  panel: { gap: spacing.sm, padding: spacing.md },
  chartTitle: {
    fontFamily: fonts.display,
    fontSize: 14,
    letterSpacing: 3,
    color: colors.text,
    textAlign: 'center',
  },
});
