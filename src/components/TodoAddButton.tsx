import { Plus } from 'lucide-react-native';
import { Pressable, StyleSheet, View } from 'react-native';
import Svg, { Circle, Defs, LinearGradient, Stop } from 'react-native-svg';

import { spacing, todoColors } from '@/theme';

/** The round orange + of the Todo and Calendar screens. */
export function TodoAddButton({ label, onPress }: { label: string; onPress: () => void }) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={onPress}
      style={({ pressed }) => [styles.fab, pressed && styles.pressed]}>
      <Svg width={88} height={88} style={StyleSheet.absoluteFill}>
        <Defs>
          <LinearGradient id="todoFab" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor={todoColors.accentLight} />
            <Stop offset="1" stopColor={todoColors.accent} />
          </LinearGradient>
        </Defs>
        <Circle cx={44} cy={44} r={44} fill={todoColors.surfaceRaised} />
        <Circle cx={44} cy={44} r={30} fill="url(#todoFab)" />
      </Svg>
      <View>
        <Plus size={30} color={todoColors.text} strokeWidth={3} />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    alignSelf: 'center',
    bottom: spacing.xl,
    width: 88,
    height: 88,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressed: { opacity: 0.8 },
});
