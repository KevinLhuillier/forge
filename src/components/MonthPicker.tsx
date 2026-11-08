import { ChevronLeft, ChevronRight } from 'lucide-react-native';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { toDateKey } from '@/lib/todos';
import { spacing, todoColors, todoFonts } from '@/theme';

const WEEKDAYS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

/** A month of days, Monday first. `marked` days carry a dot. */
export function MonthPicker({
  value,
  onPick,
  marked,
}: {
  value: string | null;
  onPick: (key: string) => void;
  marked?: Set<string>;
}) {
  const today = toDateKey(new Date());
  const [month, setMonth] = useState(() => {
    const [year, monthNumber] = (value ?? today).split('-').map(Number);
    return new Date(year, monthNumber - 1, 1);
  });
  const year = month.getFullYear();
  const monthIndex = month.getMonth();
  const dayCount = new Date(year, monthIndex + 1, 0).getDate();
  // Empty cells before the 1st: the week starts on Monday.
  const offset = (month.getDay() + 6) % 7;

  return (
    <View style={styles.picker}>
      <View style={styles.header}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Previous month"
          hitSlop={12}
          onPress={() => setMonth(new Date(year, monthIndex - 1, 1))}>
          <ChevronLeft size={22} color={todoColors.text} />
        </Pressable>
        <Text style={styles.title}>
          {month.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })}
        </Text>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Next month"
          hitSlop={12}
          onPress={() => setMonth(new Date(year, monthIndex + 1, 1))}>
          <ChevronRight size={22} color={todoColors.text} />
        </Pressable>
      </View>
      <View style={styles.grid}>
        {WEEKDAYS.map((day, index) => (
          <View key={index} style={styles.cell}>
            <Text style={styles.weekday}>{day}</Text>
          </View>
        ))}
        {Array.from({ length: offset }, (_, index) => (
          <View key={`empty-${index}`} style={styles.cell} />
        ))}
        {Array.from({ length: dayCount }, (_, index) => {
          const day = index + 1;
          const key = toDateKey(new Date(year, monthIndex, day));
          const selected = key === value;
          const hasDot = marked?.has(key);
          return (
            <Pressable
              key={key}
              accessibilityRole="button"
              accessibilityLabel={`Day ${day}`}
              accessibilityHint={hasDot ? 'Has events' : undefined}
              accessibilityState={{ selected }}
              onPress={() => onPick(key)}
              style={styles.cell}>
              <View
                style={[
                  styles.day,
                  key === today && styles.dayToday,
                  selected && styles.daySelected,
                ]}>
                <Text style={[styles.dayText, selected && styles.dayTextSelected]}>{day}</Text>
                {hasDot ? <View style={[styles.dot, selected && styles.dotSelected]} /> : null}
              </View>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  picker: { gap: spacing.sm },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  title: { fontFamily: todoFonts.bold, fontSize: 15, color: todoColors.text },
  grid: { flexDirection: 'row', flexWrap: 'wrap' },
  cell: { width: `${100 / 7}%`, height: 44, alignItems: 'center', justifyContent: 'center' },
  weekday: { fontFamily: todoFonts.medium, fontSize: 13, color: todoColors.accent },
  day: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  dayToday: { borderWidth: 1, borderColor: todoColors.textMuted },
  daySelected: { backgroundColor: todoColors.accent, borderColor: todoColors.accent },
  dayText: { fontFamily: todoFonts.regular, fontSize: 15, color: todoColors.text },
  dayTextSelected: { fontFamily: todoFonts.bold },
  dot: {
    position: 'absolute',
    bottom: 3,
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: todoColors.accent,
  },
  dotSelected: { backgroundColor: todoColors.text },
});
