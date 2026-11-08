import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';

import { useAuth } from './auth';
import { MAX_LEVEL, skillLevel, xpForLevelValidated, type Metric } from './progression';
import { supabase } from './supabase';

export type SkillLevel = {
  level: number;
  target: number;
  reps: number | null;
  weight_kg: number | null;
  variant: string | null;
};

export type SkillPr = { variant: string | null; value: number };

export type SkillProgress = {
  id: string;
  name: string;
  domainId: string;
  metric: Metric;
  /** First level of the skill, and the athlete level that unlocks it. */
  entryLevel: number;
  locked: boolean;
  levels: SkillLevel[];
  /** Last level validated (the one before the entry level when none is). */
  validated: number;
  /** Date each validated level was completed, by level. */
  completedAt: Record<number, string>;
  level: number;
  mastered: boolean;
  pr: SkillPr | null;
};

export type PrChange = { skill_id: string; variant: string | null; value: number | null };

export type DomainStatus = { id: string; name: string; average: number };

/** Computed by the database (`athlete_status_for`), the only place the XP rules live. */
export type AthleteStatus = {
  xp: number;
  /** Level the XP alone would give, before the rank gates. */
  xp_level: number;
  level: number;
  domains: DomainStatus[];
  /** Skills above level 1 that this athlete has opened. */
  unlocked: string[];
};

export type ValidationResult = {
  skill: SkillProgress;
  xpGained: number;
  globalBefore: number;
  globalAfter: number;
};

type Status = 'loading' | 'ready' | 'error';

type ProgressContextValue = {
  skills: SkillProgress[];
  athlete: AthleteStatus;
  status: Status;
  reload: () => void;
  validate: (skillId: string, level: number) => Promise<ValidationResult>;
  /** Makes `level` the skill's current level: it and the levels above must be validated again. */
  downgrade: (skillId: string, level: number) => Promise<void>;
  savePrs: (changes: PrChange[]) => Promise<void>;
};

const INITIAL_ATHLETE: AthleteStatus = { xp: 0, xp_level: 1, level: 1, domains: [], unlocked: [] };

const ProgressContext = createContext<ProgressContextValue | null>(null);

async function fetchProgress(): Promise<{ skills: SkillProgress[]; athlete: AthleteStatus }> {
  const [skills, completions, prs, athlete] = await Promise.all([
    supabase
      .from('skills')
      .select(
        'id, name, domain_id, metric, entry_level, skill_levels (level, target, reps, weight_kg, variant)',
      )
      .order('position')
      .order('level', { referencedTable: 'skill_levels' }),
    // RLS limits these to the signed-in user.
    supabase.from('level_completions').select('skill_id, level, completed_at'),
    supabase.from('skill_prs').select('skill_id, variant, value'),
    supabase.rpc('get_athlete_status'),
  ]);
  if (skills.error) throw new Error(skills.error.message);
  if (completions.error) throw new Error(completions.error.message);
  if (prs.error) throw new Error(prs.error.message);
  if (athlete.error) throw new Error(athlete.error.message);

  const status = athlete.data as AthleteStatus;
  return {
    athlete: status,
    skills: skills.data.map((skill) => {
      const completedAt: Record<number, string> = {};
      for (const row of completions.data) {
        if (row.skill_id === skill.id) completedAt[row.level] = row.completed_at;
      }
      const validated = Math.max(skill.entry_level - 1, ...Object.keys(completedAt).map(Number));
      const pr = prs.data.find((row) => row.skill_id === skill.id);
      return {
        id: skill.id,
        name: skill.name,
        domainId: skill.domain_id,
        metric: skill.metric as Metric,
        entryLevel: skill.entry_level,
        locked: skill.entry_level > 1 && !status.unlocked.includes(skill.id),
        levels: skill.skill_levels,
        validated,
        completedAt,
        level: skillLevel(validated),
        mastered: validated >= MAX_LEVEL,
        pr: pr ? { variant: pr.variant, value: Number(pr.value) } : null,
      };
    }),
  };
}

export function ProgressProvider({ children }: { children: ReactNode }) {
  const { session } = useAuth();
  const userId = session?.user.id;
  // Keyed by user: another account never sees the previous one's progress.
  return (
    <UserProgressProvider key={userId} userId={userId}>
      {children}
    </UserProgressProvider>
  );
}

function UserProgressProvider({
  userId,
  children,
}: {
  userId: string | undefined;
  children: ReactNode;
}) {
  const [skills, setSkills] = useState<SkillProgress[]>([]);
  const [athlete, setAthlete] = useState<AthleteStatus>(INITIAL_ATHLETE);
  const [status, setStatus] = useState<Status>('loading');
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    if (!userId) return;
    let stale = false;
    fetchProgress()
      .then((next) => {
        if (stale) return;
        setSkills(next.skills);
        setAthlete(next.athlete);
        setStatus('ready');
      })
      .catch(() => {
        if (!stale) setStatus('error');
      });
    return () => {
      stale = true;
    };
  }, [userId, attempt]);

  async function validate(skillId: string, level: number): Promise<ValidationResult> {
    const { error } = await supabase.rpc('validate_level', {
      p_skill_id: skillId,
      p_level: level,
    });
    if (error) throw new Error(error.message);
    const next = await fetchProgress();
    const skill = next.skills.find((item) => item.id === skillId);
    if (!skill) throw new Error('Skill not found');
    const globalBefore = athlete.level;
    setSkills(next.skills);
    setAthlete(next.athlete);
    return {
      skill,
      xpGained: xpForLevelValidated(level),
      globalBefore,
      globalAfter: next.athlete.level,
    };
  }

  async function downgrade(skillId: string, level: number): Promise<void> {
    const { error } = await supabase.rpc('downgrade_skill', {
      p_skill_id: skillId,
      p_level: level,
    });
    if (error) throw new Error(error.message);
    const next = await fetchProgress();
    setSkills(next.skills);
    setAthlete(next.athlete);
  }

  async function savePrs(changes: PrChange[]): Promise<void> {
    const { error } = await supabase.rpc('save_prs', { p_prs: changes });
    if (error) throw new Error(error.message);
    const next = await fetchProgress();
    setSkills(next.skills);
    setAthlete(next.athlete);
  }

  return (
    <ProgressContext.Provider
      value={{
        skills,
        athlete,
        status,
        reload: () => {
          setStatus('loading');
          setAttempt((n) => n + 1);
        },
        validate,
        downgrade,
        savePrs,
      }}>
      {children}
    </ProgressContext.Provider>
  );
}

export function useProgress() {
  const value = useContext(ProgressContext);
  if (!value) throw new Error('useProgress must be used inside ProgressProvider');
  return value;
}
