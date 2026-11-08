import type { ReactNode } from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import Svg, { Defs, Line, Pattern, Polygon, RadialGradient, Rect, Stop } from 'react-native-svg';

import { MAX_LEVEL, rankForLevel } from '@/lib/progression';
import { colors, fonts, haptics, spacing } from '@/theme';

/** Dark blueprint grid with a heat glow at the top, behind every screen. */
export function ScreenBackground() {
  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill}>
      <Svg width="100%" height="100%">
        <Defs>
          <Pattern id="grid" width={32} height={32} patternUnits="userSpaceOnUse">
            <Line x1={0} y1={0} x2={32} y2={0} stroke={colors.line} strokeOpacity={0.3} />
            <Line x1={0} y1={0} x2={0} y2={32} stroke={colors.line} strokeOpacity={0.3} />
          </Pattern>
          <RadialGradient id="glow" cx="50%" cy="0%" rx="80%" ry="45%">
            <Stop offset="0" stopColor={colors.rx} stopOpacity={0.2} />
            <Stop offset="1" stopColor={colors.rx} stopOpacity={0} />
          </RadialGradient>
        </Defs>
        <Rect width="100%" height="100%" fill={colors.background} />
        <Rect width="100%" height="100%" fill="url(#grid)" />
        <Rect width="100%" height="100%" fill="url(#glow)" />
      </Svg>
    </View>
  );
}

/** Panel with targeting brackets on its corners. */
export function Panel({
  accent = colors.line,
  style,
  children,
}: {
  accent?: string;
  style?: StyleProp<ViewStyle>;
  children: ReactNode;
}) {
  const bracket = { borderColor: accent };
  return (
    <View style={[styles.panel, style]}>
      <View style={[styles.bracket, styles.topLeft, bracket]} />
      <View style={[styles.bracket, styles.topRight, bracket]} />
      <View style={[styles.bracket, styles.bottomLeft, bracket]} />
      <View style={[styles.bracket, styles.bottomRight, bracket]} />
      {children}
    </View>
  );
}

const HEX_POINTS = '50,3 93,27 93,73 50,97 7,73 7,27';

/** Hexagon with centered content: level badges and path nodes. */
export function Hex({
  size,
  fill,
  stroke,
  strokeWidth = 3,
  children,
}: {
  size: number;
  fill: string;
  stroke: string;
  strokeWidth?: number;
  children?: ReactNode;
}) {
  return (
    <View style={[styles.hex, { width: size, height: size }]}>
      <Svg width={size} height={size} viewBox="0 0 100 100" style={StyleSheet.absoluteFill}>
        <Polygon points={HEX_POINTS} fill={fill} stroke={stroke} strokeWidth={strokeWidth} />
      </Svg>
      {/* Own layer: keeps icons above the absolutely positioned hexagon on web. */}
      <View>{children}</View>
    </View>
  );
}

/** One segment per level, colored by the rank each level belongs to. */
export function LevelBar({ filled }: { filled: number }) {
  return (
    <View
      style={styles.bar}
      accessible
      accessibilityRole="progressbar"
      accessibilityValue={{ min: 0, max: MAX_LEVEL, now: filled }}>
      {Array.from({ length: MAX_LEVEL }, (_, i) => (
        <View
          key={i}
          style={[
            styles.segment,
            i < filled && { backgroundColor: rankForLevel(i + 1).color },
            i > 0 && i % 10 === 0 && styles.segmentGap,
          ]}
        />
      ))}
    </View>
  );
}

export function RankTag({ level }: { level: number }) {
  const rank = rankForLevel(level);
  return (
    <View style={[styles.tag, { borderColor: rank.color }]}>
      <Text style={[styles.tagText, { color: rank.color }]}>{rank.name.toUpperCase()}</Text>
    </View>
  );
}

export function ActionButton({
  label,
  color = colors.rx,
  loading,
  disabled,
  onPress,
}: {
  label: string;
  color?: string;
  loading?: boolean;
  disabled?: boolean;
  onPress: () => void;
}) {
  const inactive = disabled || loading;
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: !!inactive }}
      disabled={inactive}
      onPress={() => {
        haptics.tap();
        onPress();
      }}
      style={({ pressed }) => [
        styles.button,
        { backgroundColor: color },
        inactive && styles.buttonDisabled,
        pressed && styles.buttonPressed,
      ]}>
      {loading ? (
        <ActivityIndicator color={colors.onAccent} />
      ) : (
        <Text style={styles.buttonLabel}>{label}</Text>
      )}
    </Pressable>
  );
}

const BRACKET = 14;

const styles = StyleSheet.create({
  panel: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.line,
    padding: spacing.lg,
  },
  bracket: { position: 'absolute', width: BRACKET, height: BRACKET },
  topLeft: { top: -1, left: -1, borderTopWidth: 2, borderLeftWidth: 2 },
  topRight: { top: -1, right: -1, borderTopWidth: 2, borderRightWidth: 2 },
  bottomLeft: { bottom: -1, left: -1, borderBottomWidth: 2, borderLeftWidth: 2 },
  bottomRight: { bottom: -1, right: -1, borderBottomWidth: 2, borderRightWidth: 2 },
  hex: { alignItems: 'center', justifyContent: 'center' },
  bar: { flexDirection: 'row', gap: 2 },
  segment: { flex: 1, height: 8, backgroundColor: colors.surfaceRaised },
  segmentGap: { marginLeft: 4 },
  tag: {
    alignSelf: 'flex-start',
    borderWidth: 1,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
  },
  tagText: { fontFamily: fonts.display, fontSize: 11, letterSpacing: 1.5 },
  button: { height: 54, alignItems: 'center', justifyContent: 'center' },
  buttonDisabled: { opacity: 0.45 },
  buttonPressed: { opacity: 0.8 },
  buttonLabel: {
    fontFamily: fonts.display,
    fontSize: 15,
    letterSpacing: 2,
    color: colors.onAccent,
  },
});
