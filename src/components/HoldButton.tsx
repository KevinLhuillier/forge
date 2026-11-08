import { useEffect, useRef } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import { colors, fonts, haptics } from '@/theme';

const HOLD_MS = 1200;

/** Must be held to fire: a level can't be validated by an accidental tap. */
export function HoldButton({
  label,
  color,
  busy,
  onComplete,
}: {
  label: string;
  color: string;
  busy: boolean;
  onComplete: () => void;
}) {
  const progress = useSharedValue(0);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const fillStyle = useAnimatedStyle(() => ({ width: `${progress.value * 100}%` }));

  useEffect(() => {
    if (!busy) progress.set(0);
  }, [busy, progress]);

  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    [],
  );

  function start() {
    if (busy) return;
    haptics.press();
    progress.set(withTiming(1, { duration: HOLD_MS, easing: Easing.linear }));
    timer.current = setTimeout(() => {
      timer.current = null;
      haptics.success();
      onComplete();
    }, HOLD_MS);
  }

  function cancel() {
    if (!timer.current) return;
    clearTimeout(timer.current);
    timer.current = null;
    progress.set(withTiming(0, { duration: 160 }));
  }

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityActions={[{ name: 'activate' }]}
      onAccessibilityAction={onComplete}
      accessibilityState={{ busy }}
      onPressIn={start}
      onPressOut={cancel}
      style={[styles.track, { borderColor: color }]}>
      <Animated.View style={[styles.fill, { backgroundColor: color }, fillStyle]} />
      {busy ? <ActivityIndicator color={color} /> : <Text style={styles.label}>{label}</Text>}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  track: {
    height: 58,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    backgroundColor: colors.surfaceRaised,
  },
  fill: { position: 'absolute', left: 0, top: 0, bottom: 0 },
  label: { fontFamily: fonts.display, fontSize: 14, letterSpacing: 2, color: colors.text },
});
