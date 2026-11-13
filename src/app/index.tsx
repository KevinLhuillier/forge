import { useRouter } from 'expo-router';
import { Check, ChevronRight, LogOut } from 'lucide-react-native';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Hex, Panel, ScreenBackground } from '@/components/hud';
import { useProgress } from '@/lib/progress';
import { rankForLevel } from '@/lib/progression';
import { supabase } from '@/lib/supabase';
import { colors, fonts, haptics, spacing, todoColors, todoFonts } from '@/theme';

/** Entry point of the app. Each card previews the look of the space it opens. */
export default function Home() {
  const router = useRouter();
  const { athlete, status } = useProgress();
  const rank = rankForLevel(athlete.level);

  return (
    <View style={styles.root}>
      <ScreenBackground />
      <SafeAreaView style={styles.root}>
        <View style={styles.content}>
          <View style={styles.header}>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Sign out"
              hitSlop={12}
              onPress={() => supabase.auth.signOut()}>
              <LogOut size={22} color={colors.textMuted} />
            </Pressable>
          </View>

          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Open Forge"
            onPress={() => {
              haptics.tap();
              router.push('/forge');
            }}
            style={({ pressed }) => [styles.cardPressable, pressed && styles.pressed]}>
            <Panel accent={rank.color} style={styles.forgeCard}>
              <Hex size={84} fill={colors.surfaceRaised} stroke={rank.color} strokeWidth={4}>
                <Text style={[styles.forgeLevel, { color: rank.color }]}>
                  {status === 'ready' ? athlete.level : ''}
                </Text>
              </Hex>
              <View style={styles.cardInfo}>
                <Text style={styles.forgeTitle}>FORGE</Text>
                <Text style={styles.forgeSubtitle}>
                  {status === 'ready' ? rank.name : 'CrossFit level'}
                </Text>
              </View>
              <ChevronRight size={26} color={colors.textMuted} />
            </Panel>
          </Pressable>

          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Open Todo"
            onPress={() => {
              haptics.tap();
              router.push('/todo');
            }}
            style={({ pressed }) => [styles.cardPressable, pressed && styles.pressed]}>
            <View style={styles.todoCard}>
              <View style={styles.todoBadge}>
                <Check size={28} color={todoColors.text} strokeWidth={3} />
              </View>
              <View style={styles.cardInfo}>
                <Text style={styles.todoTitle}>Todo</Text>
                <Text style={styles.todoSubtitle}>Things to do and calendar</Text>
              </View>
              <ChevronRight size={26} color={todoColors.textMuted} />
            </View>
          </Pressable>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  content: { flex: 1, padding: spacing.lg, gap: spacing.lg },
  header: { flexDirection: 'row', justifyContent: 'flex-end' },
  cardPressable: { flex: 1, maxHeight: 220 },
  pressed: { opacity: 0.8 },
  cardInfo: { flex: 1, gap: spacing.xs },
  forgeCard: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: spacing.lg },
  forgeLevel: { fontFamily: fonts.displayHeavy, fontSize: 28 },
  forgeTitle: { fontFamily: fonts.displayHeavy, fontSize: 26, letterSpacing: 4, color: colors.rx },
  forgeSubtitle: { fontFamily: fonts.bodySemi, fontSize: 18, color: colors.textMuted },
  todoCard: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.lg,
    padding: spacing.xl,
    borderRadius: 16,
    backgroundColor: todoColors.surface,
  },
  todoBadge: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: todoColors.accent,
  },
  todoTitle: { fontFamily: todoFonts.bold, fontSize: 26, color: todoColors.text },
  todoSubtitle: { fontFamily: todoFonts.regular, fontSize: 15, color: todoColors.textMuted },
});
