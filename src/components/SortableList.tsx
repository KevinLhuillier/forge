import { GripVertical } from 'lucide-react-native';
import { useEffect, useState, type ReactNode } from 'react';
import { Animated, PanResponder, StyleSheet, View } from 'react-native';

import { haptics, spacing, todoColors } from '@/theme';

type DragEvents = { begin: () => void; move: (dy: number) => void; end: (cancel: boolean) => void };

/**
 * One PanResponder for the life of a handle: recreating it would reset the running gesture.
 * It forwards to the latest callbacks, which change as the row re-renders during a drag.
 */
class DragRelay {
  constructor(private events: DragEvents) {}

  update(events: DragEvents) {
    this.events = events;
  }

  responder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderTerminationRequest: () => false,
    onPanResponderGrant: () => this.events.begin(),
    onPanResponderMove: (_, gesture) => this.events.move(gesture.dy),
    onPanResponderRelease: () => this.events.end(false),
    onPanResponderTerminate: () => this.events.end(true),
  });
}

/** The grip a row is dragged by. */
function DragHandle({
  events,
  label,
  canMoveUp,
  canMoveDown,
  onStep,
}: {
  events: DragEvents;
  label: string;
  canMoveUp: boolean;
  canMoveDown: boolean;
  onStep: (delta: number) => void;
}) {
  const [relay] = useState(() => new DragRelay(events));
  useEffect(() => {
    relay.update(events);
  });

  return (
    <View
      {...relay.responder.panHandlers}
      accessible
      accessibilityLabel={label}
      accessibilityActions={[
        ...(canMoveUp ? [{ name: 'moveUp', label: 'Move up' }] : []),
        ...(canMoveDown ? [{ name: 'moveDown', label: 'Move down' }] : []),
      ]}
      onAccessibilityAction={(event) => onStep(event.nativeEvent.actionName === 'moveUp' ? -1 : 1)}
      style={styles.handle}>
      <GripVertical size={20} color={todoColors.textMuted} />
    </View>
  );
}

function moved(ids: string[], from: number, to: number): string[] {
  const next = [...ids];
  next.splice(to, 0, next.splice(from, 1)[0]);
  return next;
}

/** A vertical list whose rows are reordered by dragging the handle passed to `renderItem`. */
export function SortableList<T extends { id: string }>({
  items,
  labelOf,
  renderItem,
  onReorder,
  onDragChange,
}: {
  items: T[];
  labelOf: (item: T) => string;
  renderItem: (item: T, handle: ReactNode) => ReactNode;
  onReorder: (ids: string[]) => void;
  onDragChange: (dragging: boolean) => void;
}) {
  const [drag, setDrag] = useState<{ id: string; from: number; to: number } | null>(null);
  const [dragY] = useState(() => new Animated.Value(0));
  const [heights, setHeights] = useState<Record<string, number>>({});
  const ids = items.map((item) => item.id);

  function targetIndex(from: number, dy: number): number {
    const direction = dy > 0 ? 1 : -1;
    let crossed = 0;
    let to = from;
    for (let index = from + direction; ids[index] !== undefined; index += direction) {
      const height = heights[ids[index]] ?? 0;
      if (Math.abs(dy) <= crossed + height / 2) break;
      crossed += height;
      to = index;
    }
    return to;
  }

  function offsetOf(index: number): number {
    if (!drag) return 0;
    const height = heights[drag.id] ?? 0;
    if (index > drag.from && index <= drag.to) return -height;
    if (index < drag.from && index >= drag.to) return height;
    return 0;
  }

  return (
    <View>
      {items.map((item, index) => {
        const dragged = drag?.id === item.id;
        const events: DragEvents = {
          begin: () => {
            haptics.press();
            dragY.setValue(0);
            setDrag({ id: item.id, from: index, to: index });
            onDragChange(true);
          },
          move: (dy) => {
            dragY.setValue(dy);
            if (!drag) return;
            const to = targetIndex(drag.from, dy);
            if (to !== drag.to) {
              haptics.tap();
              setDrag({ ...drag, to });
            }
          },
          end: (cancel) => {
            setDrag(null);
            onDragChange(false);
            if (drag && !cancel && drag.to !== drag.from) {
              onReorder(moved(ids, drag.from, drag.to));
            }
          },
        };

        return (
          <Animated.View
            key={item.id}
            onLayout={(event) => {
              const { height } = event.nativeEvent.layout;
              setHeights((current) =>
                current[item.id] === height ? current : { ...current, [item.id]: height },
              );
            }}
            style={
              dragged
                ? [styles.dragged, { transform: [{ translateY: dragY }] }]
                : { transform: [{ translateY: offsetOf(index) }] }
            }>
            {renderItem(
              item,
              <DragHandle
                events={events}
                label={`Reorder ${labelOf(item)}`}
                canMoveUp={index > 0}
                canMoveDown={index < items.length - 1}
                onStep={(delta) => onReorder(moved(ids, index, index + delta))}
              />,
            )}
          </Animated.View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  dragged: { zIndex: 1, elevation: 6, opacity: 0.92 },
  handle: {
    width: 40,
    alignSelf: 'stretch',
    alignItems: 'center',
    justifyContent: 'center',
    paddingLeft: spacing.sm,
  },
});
