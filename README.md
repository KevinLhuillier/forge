# Forge

Level up at CrossFit, one set at a time. Expo (SDK 58, expo-router, TypeScript) and Supabase.

## How progression works

- Each skill has 30 levels. You start at level 1.
- Each level has a target 1RM and is validated by one set of 3 to 12 reps at a working weight of
  `target x (37 - reps) / 36` (Brzycki), in 2.5 kg steps. Reps are drawn once per level and fixed
  for everyone. Validating a level moves you to the next.
- Validating level n earns 100 x n XP. Weightlifting, Gymnastics and Cardio weigh the same whatever
  their number of skills; a domain without skills is ignored.
- Your athlete level comes from your XP: level L needs `50 x L x (L - 1)` XP.
- Rank gates: reaching level 11 needs every domain to average level 11, and level 21 to average
  level 21. Your athlete level never goes down.
- Some skills unlock at an athlete level and start at that level; the levels below then count as
  acquired. A skill stays unlocked once opened.
- PRs (one per skill, best single rep for barbell lifts) place you on each skill. Editing them
  recomputes levels, XP and athlete level, up or down. Validating a level raises the PR to it.
- After a long break you can restart a skill from any validated level. That level and those above
  must be validated again, and your athlete level is recomputed (the one case where it can drop).
- Ranks, for athlete and skill levels: 1 to 10 Scaled, 11 to 20 Intermediate, 21 to 30 Rx.

Athlete XP and level are computed by the `athlete_status_for` database function. Targets per level
are data, in the `skill_levels` table.

## Setup

1. Create a Supabase project, with **Authentication → Providers → Email** enabled.
2. Apply the schema:
   ```bash
   npx supabase login
   npx supabase link --project-ref <your-project-ref>
   npx supabase db push
   ```
   Or paste `supabase/migrations/*.sql` into the dashboard's SQL Editor.
3. Copy `.env.example` to `.env` and fill in the project URL and publishable key.
4. Run it:
   ```bash
   npm install
   npm start
   ```

## Adding a skill

Insert one row in `skills` (with its `domain_id`) and its 30 rows in `skill_levels`, in a new
migration.

## Checks

```bash
npm run lint
npm run typecheck
```
