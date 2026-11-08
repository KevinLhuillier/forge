import { colors } from '@/theme';

/** The rules of the game. Level targets themselves live in the `skill_levels` table. */
export const MAX_LEVEL = 30;

export type Rank = { name: string; min: number; max: number; color: string };

export const RANKS: Rank[] = [
  { name: 'Scaled', min: 1, max: 10, color: colors.scaled },
  { name: 'Intermediate', min: 11, max: 20, color: colors.intermediate },
  { name: 'Rx', min: 21, max: 30, color: colors.rx },
];

export function rankForLevel(level: number): Rank {
  return RANKS.find((rank) => level <= rank.max) ?? RANKS[RANKS.length - 1];
}

/** The level being worked on: you start at 1, and validating a level moves you to the next. */
export function skillLevel(validatedLevels: number): number {
  return Math.min(validatedLevels + 1, MAX_LEVEL);
}

/** XP earned by validating a level of a skill. */
export const xpForLevelValidated = (level: number) => level * 100;

/** Athlete XP needed to reach a level. The athlete level itself is computed by the database. */
export const xpToReachLevel = (level: number) => 50 * level * (level - 1);

export const formatKg = (kg: number) => String(Number(kg));

/** What a level's target and a PR measure. `time` is the only one where lower is better. */
export type Metric = 'one_rm' | 'reps' | 'time' | 'meters' | 'hold' | 'per_minute';

export type Requirement = { target: number; reps: number | null; weight_kg: number | null };

export const PR_UNITS: Record<Metric, string> = {
  one_rm: 'kg',
  reps: 'reps',
  time: 'mm:ss',
  meters: 'm',
  hold: 's',
  per_minute: '/min',
};

export const EFFORT_LABELS: Record<Metric, string> = {
  one_rm: '1 set',
  reps: '1 unbroken set',
  time: '1 attempt',
  meters: '1 attempt',
  hold: '1 hold',
  per_minute: '1 minute',
};

export function formatDuration(seconds: number): string {
  const total = Math.round(seconds);
  return `${Math.floor(total / 60)}:${String(total % 60).padStart(2, '0')}`;
}

/** Big value and unit of a mission, for anything but barbell levels. */
export function missionValue(metric: Metric, target: number): { value: string; unit: string } {
  const value = String(Number(target));
  switch (metric) {
    case 'time':
      return { value: formatDuration(target), unit: 'OR FASTER' };
    case 'meters':
      return { value, unit: 'M' };
    case 'hold':
      return { value, unit: 'SEC' };
    case 'per_minute':
      return { value, unit: 'REPS / MIN' };
    default:
      return { value, unit: Number(target) > 1 ? 'REPS' : 'REP' };
  }
}

export function missionText(metric: Metric, level: Requirement): string {
  if (metric === 'one_rm') return `${level.reps} × ${formatKg(level.weight_kg ?? 0)} KG`;
  const { value, unit } = missionValue(metric, level.target);
  return `${value} ${unit}`;
}

export function formatPr(metric: Metric, value: number): string {
  return metric === 'time' ? formatDuration(value) : String(Number(value));
}

/** The number a PR field holds, or null when it can't be read. */
export function parsePr(metric: Metric, text: string): number | null {
  const clean = text.trim().replace(',', '.');
  if (metric === 'time') {
    const match = /^(\d{1,3}):([0-5]\d)$/.exec(clean);
    if (!match) return null;
    const seconds = Number(match[1]) * 60 + Number(match[2]);
    return seconds > 0 ? seconds : null;
  }
  if (!/^\d+(\.\d+)?$/.test(clean)) return null;
  const value = Number(clean);
  return value > 0 && value < 100000 ? value : null;
}
