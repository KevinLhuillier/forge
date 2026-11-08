import { useState } from 'react';
import { StyleSheet, Text as RNText, View } from 'react-native';
import Svg, { Circle, Line, Polygon, Text as SvgText } from 'react-native-svg';

import { MAX_LEVEL } from '@/lib/progression';
import { colors, fonts, spacing } from '@/theme';

export type RadarAxis = {
  key: string;
  /** Short name drawn around the chart. */
  label: string;
  /** Name shown in the readout and the table. */
  name: string;
  value: number;
  locked?: boolean;
};

const WIDTH = 360;
const HEIGHT = 320;
const CENTER_X = WIDTH / 2;
const CENTER_Y = HEIGHT / 2;
const RADIUS = 104;
const LABEL_OFFSET = 16;
// One ring per rank boundary.
const RINGS = [10, 20, 30];

function pointAt(index: number, count: number, distance: number) {
  const angle = -Math.PI / 2 + (index * 2 * Math.PI) / count;
  return {
    x: CENTER_X + distance * Math.cos(angle),
    y: CENTER_Y + distance * Math.sin(angle),
    cos: Math.cos(angle),
  };
}

const distanceFor = (value: number) => (RADIUS * Math.min(value, MAX_LEVEL)) / MAX_LEVEL;

const describe = (axis: RadarAxis) =>
  axis.locked ? `${axis.name} · Locked` : `${axis.name} · Level ${Math.floor(axis.value)}`;

/** Levels on a 0 to 30 scale. Tapping the end of an axis shows its value. */
export function RadarChart({ axes }: { axes: RadarAxis[] }) {
  const [selected, setSelected] = useState<string | null>(null);
  const count = axes.length;
  const points = (distance: (index: number) => number) =>
    axes
      .map((_, index) => {
        const point = pointAt(index, count, distance(index));
        return `${point.x},${point.y}`;
      })
      .join(' ');
  const active = axes.find((axis) => axis.key === selected);

  return (
    <View>
      <RNText style={[styles.readout, active && styles.readoutActive]}>
        {active ? describe(active) : 'Tap a name to see its level'}
      </RNText>
      <Svg
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        style={styles.svg}
        accessibilityLabel={axes.map(describe).join(', ')}>
        {RINGS.map((ring) => (
          <Polygon
            key={ring}
            points={points(() => distanceFor(ring))}
            fill="none"
            stroke={colors.line}
          />
        ))}
        {axes.map((axis, index) => {
          const end = pointAt(index, count, RADIUS);
          return (
            <Line
              key={axis.key}
              x1={CENTER_X}
              y1={CENTER_Y}
              x2={end.x}
              y2={end.y}
              stroke={colors.line}
              strokeOpacity={0.6}
            />
          );
        })}
        {RINGS.map((ring) => (
          <SvgText
            key={ring}
            x={CENTER_X + 4}
            y={CENTER_Y - distanceFor(ring) + 11}
            fontFamily={fonts.bodySemi}
            fontSize={10}
            fill={colors.textMuted}>
            {ring}
          </SvgText>
        ))}

        <Polygon
          points={points((index) => distanceFor(axes[index].value))}
          fill={colors.rx}
          fillOpacity={0.2}
          stroke={colors.rx}
          strokeWidth={2}
          strokeLinejoin="round"
        />
        {axes.map((axis, index) => {
          const point = pointAt(index, count, distanceFor(axis.value));
          return (
            <Circle
              key={axis.key}
              cx={point.x}
              cy={point.y}
              r={axis.key === selected ? 6 : 4}
              fill={colors.rx}
              stroke={colors.surface}
              strokeWidth={2}
            />
          );
        })}

        {axes.map((axis, index) => {
          const point = pointAt(index, count, RADIUS + LABEL_OFFSET);
          const anchor = point.cos > 0.2 ? 'start' : point.cos < -0.2 ? 'end' : 'middle';
          return (
            <SvgText
              key={axis.key}
              x={point.x}
              y={point.y + 4}
              textAnchor={anchor}
              fontFamily={fonts.bodySemi}
              fontSize={12}
              fill={axis.locked ? colors.textMuted : colors.text}>
              {axis.label}
            </SvgText>
          );
        })}
        {/* Drawn last, at the labels where points never bunch up: bigger than what they cover. */}
        {axes.map((axis, index) => {
          const point = pointAt(index, count, RADIUS + LABEL_OFFSET);
          return (
            <Circle
              key={axis.key}
              testID="radar-target"
              cx={point.x}
              cy={point.y}
              r={20}
              fill="transparent"
              onPress={() => setSelected(axis.key)}
            />
          );
        })}
      </Svg>

      <View style={styles.table}>
        {axes.map((axis) => (
          <View key={axis.key} style={styles.row}>
            <RNText style={styles.name} numberOfLines={1}>
              {axis.name}
            </RNText>
            <RNText style={styles.value}>{axis.locked ? 'Locked' : Math.floor(axis.value)}</RNText>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  readout: {
    fontFamily: fonts.bodySemi,
    fontSize: 16,
    color: colors.textMuted,
    textAlign: 'center',
  },
  readoutActive: { color: colors.text },
  svg: { width: '100%', aspectRatio: WIDTH / HEIGHT },
  table: { flexDirection: 'row', flexWrap: 'wrap', columnGap: spacing.lg, marginTop: spacing.sm },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing.sm,
    width: '47%',
    paddingVertical: 3,
  },
  name: { flex: 1, fontFamily: fonts.body, fontSize: 15, color: colors.textMuted },
  value: { fontFamily: fonts.bodyBold, fontSize: 15, color: colors.text },
});
