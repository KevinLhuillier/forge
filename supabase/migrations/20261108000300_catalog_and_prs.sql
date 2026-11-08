-- Full movement catalog, unlockable skills and personal records (PRs).

alter table public.skill_levels rename column target_1rm_kg to target;
alter table public.skill_levels alter column target type numeric(7, 2);
alter table public.skill_levels alter column reps drop not null;
alter table public.skill_levels alter column weight_kg drop not null;
alter table public.skill_levels add column variant text;

-- metric: what a level's target and a PR measure.
-- one_rm kg, reps count, time seconds (lower is better), meters, hold seconds, per_minute reps.
-- entry_level: first level of the skill, and the athlete level that unlocks it.
alter table public.skills
  add column metric text not null default 'one_rm'
    check (metric in ('one_rm', 'reps', 'time', 'meters', 'hold', 'per_minute')),
  add column entry_level int not null default 1 check (entry_level between 1 and 30);
alter table public.skills alter column metric drop default;

update public.skills set position = 12 where id = 'thruster';

-- Drawn once. One set of 3 to 12 reps at target x (37 - reps) / 36 (Brzycki) for barbell levels.
insert into public.skills (id, name, position, domain_id, metric, entry_level) values
  ('run', 'Run 5 km', 1, 'cardio', 'time', 1),
  ('row', 'Row 500 m', 2, 'cardio', 'time', 1),
  ('bike', 'BikeErg 1 km', 3, 'cardio', 'time', 1),
  ('skierg', 'SkiErg 500 m', 4, 'cardio', 'time', 1),
  ('jump-rope', 'Jump Rope', 5, 'cardio', 'reps', 1),
  ('burpee', 'Burpee', 6, 'cardio', 'per_minute', 1),
  ('box-jump', 'Box Jump', 7, 'cardio', 'per_minute', 1),
  ('strict-pull-up', 'Strict Pull-up', 1, 'gymnastics', 'reps', 1),
  ('kipping-pull-up', 'Kipping Pull-up', 2, 'gymnastics', 'reps', 1),
  ('push-up', 'Push-up', 3, 'gymnastics', 'reps', 1),
  ('air-squat', 'Air Squat', 4, 'gymnastics', 'reps', 1),
  ('sit-up', 'Sit-up', 5, 'gymnastics', 'reps', 1),
  ('toes-to-bar', 'Toes-to-Bar', 6, 'gymnastics', 'reps', 1),
  ('muscle-up', 'Muscle-up', 7, 'gymnastics', 'reps', 10),
  ('hspu', 'Handstand Push-up', 8, 'gymnastics', 'reps', 1),
  ('strict-hspu', 'Strict Handstand Push-up', 9, 'gymnastics', 'reps', 10),
  ('handstand-walk', 'Handstand Walk', 10, 'gymnastics', 'meters', 10),
  ('rope-climb', 'Rope Climb 4.5 m', 11, 'gymnastics', 'reps', 10),
  ('l-sit', 'L-Sit', 12, 'gymnastics', 'hold', 10),
  ('dip', 'Dip', 13, 'gymnastics', 'reps', 1),
  ('lunge', 'Lunge', 14, 'gymnastics', 'reps', 1),
  ('pistol-squat', 'Pistol Squat', 15, 'gymnastics', 'reps', 10),
  ('deadlift', 'Deadlift', 1, 'weightlifting', 'one_rm', 1),
  ('front-squat', 'Front Squat', 2, 'weightlifting', 'one_rm', 1),
  ('overhead-squat', 'Overhead Squat', 3, 'weightlifting', 'one_rm', 1),
  ('back-squat', 'Back Squat', 4, 'weightlifting', 'one_rm', 1),
  ('push-press', 'Push Press', 5, 'weightlifting', 'one_rm', 1),
  ('strict-press', 'Strict Press', 6, 'weightlifting', 'one_rm', 1),
  ('clean', 'Clean', 7, 'weightlifting', 'one_rm', 1),
  ('clean-and-jerk', 'Clean & Jerk', 8, 'weightlifting', 'one_rm', 1),
  ('db-snatch', 'DB Snatch', 9, 'weightlifting', 'reps', 1),
  ('db-clean-and-jerk', 'DB Clean & Jerk', 10, 'weightlifting', 'reps', 1),
  ('snatch', 'Snatch', 11, 'weightlifting', 'one_rm', 1),
  ('kb-russian-swing', 'KB Russian Swing', 13, 'weightlifting', 'reps', 1),
  ('kb-american-swing', 'KB American Swing', 14, 'weightlifting', 'reps', 1),
  ('wall-ball', 'Wall Ball', 15, 'weightlifting', 'reps', 1);

insert into public.skill_levels (skill_id, level, target, reps, weight_kg, variant) values
  ('run', 1, 2040, null, null, null),
  ('run', 2, 2003, null, null, null),
  ('run', 3, 1967, null, null, null),
  ('run', 4, 1930, null, null, null),
  ('run', 5, 1893, null, null, null),
  ('run', 6, 1857, null, null, null),
  ('run', 7, 1820, null, null, null),
  ('run', 8, 1783, null, null, null),
  ('run', 9, 1747, null, null, null),
  ('run', 10, 1710, null, null, null),
  ('run', 11, 1674, null, null, null),
  ('run', 12, 1638, null, null, null),
  ('run', 13, 1602, null, null, null),
  ('run', 14, 1566, null, null, null),
  ('run', 15, 1530, null, null, null),
  ('run', 16, 1494, null, null, null),
  ('run', 17, 1458, null, null, null),
  ('run', 18, 1422, null, null, null),
  ('run', 19, 1386, null, null, null),
  ('run', 20, 1350, null, null, null),
  ('run', 21, 1320, null, null, null),
  ('run', 22, 1290, null, null, null),
  ('run', 23, 1260, null, null, null),
  ('run', 24, 1230, null, null, null),
  ('run', 25, 1200, null, null, null),
  ('run', 26, 1170, null, null, null),
  ('run', 27, 1140, null, null, null),
  ('run', 28, 1110, null, null, null),
  ('run', 29, 1080, null, null, null),
  ('run', 30, 1050, null, null, null),
  ('row', 1, 125, null, null, null),
  ('row', 2, 123, null, null, null),
  ('row', 3, 121, null, null, null),
  ('row', 4, 118, null, null, null),
  ('row', 5, 116, null, null, null),
  ('row', 6, 114, null, null, null),
  ('row', 7, 112, null, null, null),
  ('row', 8, 109, null, null, null),
  ('row', 9, 107, null, null, null),
  ('row', 10, 105, null, null, null),
  ('row', 11, 104, null, null, null),
  ('row', 12, 103, null, null, null),
  ('row', 13, 101, null, null, null),
  ('row', 14, 100, null, null, null),
  ('row', 15, 99, null, null, null),
  ('row', 16, 98, null, null, null),
  ('row', 17, 97, null, null, null),
  ('row', 18, 95, null, null, null),
  ('row', 19, 94, null, null, null),
  ('row', 20, 93, null, null, null),
  ('row', 21, 92, null, null, null),
  ('row', 22, 91, null, null, null),
  ('row', 23, 89, null, null, null),
  ('row', 24, 88, null, null, null),
  ('row', 25, 87, null, null, null),
  ('row', 26, 86, null, null, null),
  ('row', 27, 84, null, null, null),
  ('row', 28, 83, null, null, null),
  ('row', 29, 81, null, null, null),
  ('row', 30, 80, null, null, null),
  ('bike', 1, 150, null, null, null),
  ('bike', 2, 147, null, null, null),
  ('bike', 3, 143, null, null, null),
  ('bike', 4, 140, null, null, null),
  ('bike', 5, 137, null, null, null),
  ('bike', 6, 133, null, null, null),
  ('bike', 7, 130, null, null, null),
  ('bike', 8, 127, null, null, null),
  ('bike', 9, 123, null, null, null),
  ('bike', 10, 120, null, null, null),
  ('bike', 11, 118, null, null, null),
  ('bike', 12, 116, null, null, null),
  ('bike', 13, 114, null, null, null),
  ('bike', 14, 112, null, null, null),
  ('bike', 15, 110, null, null, null),
  ('bike', 16, 108, null, null, null),
  ('bike', 17, 106, null, null, null),
  ('bike', 18, 104, null, null, null),
  ('bike', 19, 102, null, null, null),
  ('bike', 20, 100, null, null, null),
  ('bike', 21, 98, null, null, null),
  ('bike', 22, 96, null, null, null),
  ('bike', 23, 94, null, null, null),
  ('bike', 24, 92, null, null, null),
  ('bike', 25, 90, null, null, null),
  ('bike', 26, 88, null, null, null),
  ('bike', 27, 86, null, null, null),
  ('bike', 28, 84, null, null, null),
  ('bike', 29, 82, null, null, null),
  ('bike', 30, 80, null, null, null),
  ('skierg', 1, 140, null, null, null),
  ('skierg', 2, 138, null, null, null),
  ('skierg', 3, 136, null, null, null),
  ('skierg', 4, 133, null, null, null),
  ('skierg', 5, 131, null, null, null),
  ('skierg', 6, 129, null, null, null),
  ('skierg', 7, 127, null, null, null),
  ('skierg', 8, 124, null, null, null),
  ('skierg', 9, 122, null, null, null),
  ('skierg', 10, 120, null, null, null),
  ('skierg', 11, 119, null, null, null),
  ('skierg', 12, 117, null, null, null),
  ('skierg', 13, 116, null, null, null),
  ('skierg', 14, 114, null, null, null),
  ('skierg', 15, 113, null, null, null),
  ('skierg', 16, 111, null, null, null),
  ('skierg', 17, 110, null, null, null),
  ('skierg', 18, 108, null, null, null),
  ('skierg', 19, 107, null, null, null),
  ('skierg', 20, 105, null, null, null),
  ('skierg', 21, 104, null, null, null),
  ('skierg', 22, 102, null, null, null),
  ('skierg', 23, 101, null, null, null),
  ('skierg', 24, 99, null, null, null),
  ('skierg', 25, 98, null, null, null),
  ('skierg', 26, 96, null, null, null),
  ('skierg', 27, 95, null, null, null),
  ('skierg', 28, 93, null, null, null),
  ('skierg', 29, 92, null, null, null),
  ('skierg', 30, 90, null, null, null),
  ('jump-rope', 1, 20, null, null, 'Single-unders'),
  ('jump-rope', 2, 29, null, null, 'Single-unders'),
  ('jump-rope', 3, 38, null, null, 'Single-unders'),
  ('jump-rope', 4, 47, null, null, 'Single-unders'),
  ('jump-rope', 5, 56, null, null, 'Single-unders'),
  ('jump-rope', 6, 64, null, null, 'Single-unders'),
  ('jump-rope', 7, 73, null, null, 'Single-unders'),
  ('jump-rope', 8, 82, null, null, 'Single-unders'),
  ('jump-rope', 9, 91, null, null, 'Single-unders'),
  ('jump-rope', 10, 100, null, null, 'Single-unders'),
  ('jump-rope', 11, 5, null, null, 'Double-unders'),
  ('jump-rope', 12, 10, null, null, 'Double-unders'),
  ('jump-rope', 13, 15, null, null, 'Double-unders'),
  ('jump-rope', 14, 20, null, null, 'Double-unders'),
  ('jump-rope', 15, 25, null, null, 'Double-unders'),
  ('jump-rope', 16, 30, null, null, 'Double-unders'),
  ('jump-rope', 17, 35, null, null, 'Double-unders'),
  ('jump-rope', 18, 40, null, null, 'Double-unders'),
  ('jump-rope', 19, 45, null, null, 'Double-unders'),
  ('jump-rope', 20, 50, null, null, 'Double-unders'),
  ('jump-rope', 21, 58, null, null, 'Double-unders'),
  ('jump-rope', 22, 66, null, null, 'Double-unders'),
  ('jump-rope', 23, 74, null, null, 'Double-unders'),
  ('jump-rope', 24, 82, null, null, 'Double-unders'),
  ('jump-rope', 25, 90, null, null, 'Double-unders'),
  ('jump-rope', 26, 102, null, null, 'Double-unders'),
  ('jump-rope', 27, 114, null, null, 'Double-unders'),
  ('jump-rope', 28, 126, null, null, 'Double-unders'),
  ('jump-rope', 29, 138, null, null, 'Double-unders'),
  ('jump-rope', 30, 150, null, null, 'Double-unders'),
  ('burpee', 1, 8, null, null, null),
  ('burpee', 2, 9, null, null, null),
  ('burpee', 3, 9, null, null, null),
  ('burpee', 4, 10, null, null, null),
  ('burpee', 5, 11, null, null, null),
  ('burpee', 6, 11, null, null, null),
  ('burpee', 7, 12, null, null, null),
  ('burpee', 8, 13, null, null, null),
  ('burpee', 9, 13, null, null, null),
  ('burpee', 10, 14, null, null, null),
  ('burpee', 11, 15, null, null, null),
  ('burpee', 12, 15, null, null, null),
  ('burpee', 13, 16, null, null, null),
  ('burpee', 14, 16, null, null, null),
  ('burpee', 15, 17, null, null, null),
  ('burpee', 16, 18, null, null, null),
  ('burpee', 17, 18, null, null, null),
  ('burpee', 18, 19, null, null, null),
  ('burpee', 19, 19, null, null, null),
  ('burpee', 20, 20, null, null, null),
  ('burpee', 21, 21, null, null, null),
  ('burpee', 22, 22, null, null, null),
  ('burpee', 23, 22, null, null, null),
  ('burpee', 24, 23, null, null, null),
  ('burpee', 25, 24, null, null, null),
  ('burpee', 26, 25, null, null, null),
  ('burpee', 27, 26, null, null, null),
  ('burpee', 28, 26, null, null, null),
  ('burpee', 29, 27, null, null, null),
  ('burpee', 30, 28, null, null, null),
  ('box-jump', 1, 8, null, null, '61 cm'),
  ('box-jump', 2, 9, null, null, '61 cm'),
  ('box-jump', 3, 10, null, null, '61 cm'),
  ('box-jump', 4, 10, null, null, '61 cm'),
  ('box-jump', 5, 11, null, null, '61 cm'),
  ('box-jump', 6, 12, null, null, '61 cm'),
  ('box-jump', 7, 13, null, null, '61 cm'),
  ('box-jump', 8, 13, null, null, '61 cm'),
  ('box-jump', 9, 14, null, null, '61 cm'),
  ('box-jump', 10, 15, null, null, '61 cm'),
  ('box-jump', 11, 16, null, null, '61 cm'),
  ('box-jump', 12, 17, null, null, '61 cm'),
  ('box-jump', 13, 18, null, null, '61 cm'),
  ('box-jump', 14, 19, null, null, '61 cm'),
  ('box-jump', 15, 20, null, null, '61 cm'),
  ('box-jump', 16, 21, null, null, '61 cm'),
  ('box-jump', 17, 22, null, null, '61 cm'),
  ('box-jump', 18, 23, null, null, '61 cm'),
  ('box-jump', 19, 24, null, null, '61 cm'),
  ('box-jump', 20, 25, null, null, '61 cm'),
  ('box-jump', 21, 26, null, null, '61 cm'),
  ('box-jump', 22, 27, null, null, '61 cm'),
  ('box-jump', 23, 28, null, null, '61 cm'),
  ('box-jump', 24, 29, null, null, '61 cm'),
  ('box-jump', 25, 30, null, null, '61 cm'),
  ('box-jump', 26, 31, null, null, '61 cm'),
  ('box-jump', 27, 32, null, null, '61 cm'),
  ('box-jump', 28, 33, null, null, '61 cm'),
  ('box-jump', 29, 34, null, null, '61 cm'),
  ('box-jump', 30, 35, null, null, '61 cm'),
  ('strict-pull-up', 1, 1, null, null, 'Thick band'),
  ('strict-pull-up', 2, 2, null, null, 'Thick band'),
  ('strict-pull-up', 3, 4, null, null, 'Thick band'),
  ('strict-pull-up', 4, 5, null, null, 'Thick band'),
  ('strict-pull-up', 5, 6, null, null, 'Thick band'),
  ('strict-pull-up', 6, 7, null, null, 'Thin band'),
  ('strict-pull-up', 7, 8, null, null, 'Thin band'),
  ('strict-pull-up', 8, 10, null, null, 'Thin band'),
  ('strict-pull-up', 9, 11, null, null, 'Thin band'),
  ('strict-pull-up', 10, 12, null, null, 'Thin band'),
  ('strict-pull-up', 11, 1, null, null, 'No band'),
  ('strict-pull-up', 12, 2, null, null, 'No band'),
  ('strict-pull-up', 13, 4, null, null, 'No band'),
  ('strict-pull-up', 14, 5, null, null, 'No band'),
  ('strict-pull-up', 15, 6, null, null, 'No band'),
  ('strict-pull-up', 16, 8, null, null, 'No band'),
  ('strict-pull-up', 17, 9, null, null, 'No band'),
  ('strict-pull-up', 18, 10, null, null, 'No band'),
  ('strict-pull-up', 19, 12, null, null, 'No band'),
  ('strict-pull-up', 20, 13, null, null, 'No band'),
  ('strict-pull-up', 21, 4, null, null, '+10 kg'),
  ('strict-pull-up', 22, 5, null, null, '+10 kg'),
  ('strict-pull-up', 23, 6, null, null, '+10 kg'),
  ('strict-pull-up', 24, 8, null, null, '+10 kg'),
  ('strict-pull-up', 25, 9, null, null, '+10 kg'),
  ('strict-pull-up', 26, 10, null, null, '+10 kg'),
  ('strict-pull-up', 27, 11, null, null, '+10 kg'),
  ('strict-pull-up', 28, 13, null, null, '+10 kg'),
  ('strict-pull-up', 29, 14, null, null, '+10 kg'),
  ('strict-pull-up', 30, 15, null, null, '+10 kg'),
  ('kipping-pull-up', 1, 3, null, null, 'Kipping'),
  ('kipping-pull-up', 2, 5, null, null, 'Kipping'),
  ('kipping-pull-up', 3, 7, null, null, 'Kipping'),
  ('kipping-pull-up', 4, 9, null, null, 'Kipping'),
  ('kipping-pull-up', 5, 11, null, null, 'Kipping'),
  ('kipping-pull-up', 6, 12, null, null, 'Kipping'),
  ('kipping-pull-up', 7, 14, null, null, 'Kipping'),
  ('kipping-pull-up', 8, 16, null, null, 'Kipping'),
  ('kipping-pull-up', 9, 18, null, null, 'Kipping'),
  ('kipping-pull-up', 10, 20, null, null, 'Kipping'),
  ('kipping-pull-up', 11, 22, null, null, 'Kipping'),
  ('kipping-pull-up', 12, 24, null, null, 'Kipping'),
  ('kipping-pull-up', 13, 26, null, null, 'Kipping'),
  ('kipping-pull-up', 14, 28, null, null, 'Kipping'),
  ('kipping-pull-up', 15, 30, null, null, 'Kipping'),
  ('kipping-pull-up', 16, 10, null, null, 'Butterfly'),
  ('kipping-pull-up', 17, 13, null, null, 'Butterfly'),
  ('kipping-pull-up', 18, 15, null, null, 'Butterfly'),
  ('kipping-pull-up', 19, 18, null, null, 'Butterfly'),
  ('kipping-pull-up', 20, 20, null, null, 'Butterfly'),
  ('kipping-pull-up', 21, 25, null, null, 'Butterfly'),
  ('kipping-pull-up', 22, 28, null, null, 'Butterfly'),
  ('kipping-pull-up', 23, 31, null, null, 'Butterfly'),
  ('kipping-pull-up', 24, 33, null, null, 'Butterfly'),
  ('kipping-pull-up', 25, 36, null, null, 'Butterfly'),
  ('kipping-pull-up', 26, 39, null, null, 'Butterfly'),
  ('kipping-pull-up', 27, 42, null, null, 'Butterfly'),
  ('kipping-pull-up', 28, 44, null, null, 'Butterfly'),
  ('kipping-pull-up', 29, 47, null, null, 'Butterfly'),
  ('kipping-pull-up', 30, 50, null, null, 'Butterfly'),
  ('push-up', 1, 5, null, null, 'Knees'),
  ('push-up', 2, 8, null, null, 'Knees'),
  ('push-up', 3, 11, null, null, 'Knees'),
  ('push-up', 4, 13, null, null, 'Knees'),
  ('push-up', 5, 16, null, null, 'Knees'),
  ('push-up', 6, 19, null, null, 'Knees'),
  ('push-up', 7, 22, null, null, 'Knees'),
  ('push-up', 8, 24, null, null, 'Knees'),
  ('push-up', 9, 27, null, null, 'Knees'),
  ('push-up', 10, 30, null, null, 'Knees'),
  ('push-up', 11, 10, null, null, 'Standard'),
  ('push-up', 12, 13, null, null, 'Standard'),
  ('push-up', 13, 16, null, null, 'Standard'),
  ('push-up', 14, 20, null, null, 'Standard'),
  ('push-up', 15, 23, null, null, 'Standard'),
  ('push-up', 16, 26, null, null, 'Standard'),
  ('push-up', 17, 29, null, null, 'Standard'),
  ('push-up', 18, 33, null, null, 'Standard'),
  ('push-up', 19, 36, null, null, 'Standard'),
  ('push-up', 20, 39, null, null, 'Standard'),
  ('push-up', 21, 15, null, null, '+10 kg'),
  ('push-up', 22, 19, null, null, '+10 kg'),
  ('push-up', 23, 23, null, null, '+10 kg'),
  ('push-up', 24, 27, null, null, '+10 kg'),
  ('push-up', 25, 31, null, null, '+10 kg'),
  ('push-up', 26, 34, null, null, '+10 kg'),
  ('push-up', 27, 38, null, null, '+10 kg'),
  ('push-up', 28, 42, null, null, '+10 kg'),
  ('push-up', 29, 46, null, null, '+10 kg'),
  ('push-up', 30, 50, null, null, '+10 kg'),
  ('air-squat', 1, 15, null, null, 'Bodyweight'),
  ('air-squat', 2, 19, null, null, 'Bodyweight'),
  ('air-squat', 3, 23, null, null, 'Bodyweight'),
  ('air-squat', 4, 27, null, null, 'Bodyweight'),
  ('air-squat', 5, 31, null, null, 'Bodyweight'),
  ('air-squat', 6, 34, null, null, 'Bodyweight'),
  ('air-squat', 7, 38, null, null, 'Bodyweight'),
  ('air-squat', 8, 42, null, null, 'Bodyweight'),
  ('air-squat', 9, 46, null, null, 'Bodyweight'),
  ('air-squat', 10, 50, null, null, 'Bodyweight'),
  ('air-squat', 11, 55, null, null, 'Bodyweight'),
  ('air-squat', 12, 60, null, null, 'Bodyweight'),
  ('air-squat', 13, 65, null, null, 'Bodyweight'),
  ('air-squat', 14, 70, null, null, 'Bodyweight'),
  ('air-squat', 15, 75, null, null, 'Bodyweight'),
  ('air-squat', 16, 80, null, null, 'Bodyweight'),
  ('air-squat', 17, 85, null, null, 'Bodyweight'),
  ('air-squat', 18, 90, null, null, 'Bodyweight'),
  ('air-squat', 19, 95, null, null, 'Bodyweight'),
  ('air-squat', 20, 100, null, null, 'Bodyweight'),
  ('air-squat', 21, 20, null, null, '+10 kg'),
  ('air-squat', 22, 24, null, null, '+10 kg'),
  ('air-squat', 23, 29, null, null, '+10 kg'),
  ('air-squat', 24, 33, null, null, '+10 kg'),
  ('air-squat', 25, 38, null, null, '+10 kg'),
  ('air-squat', 26, 42, null, null, '+10 kg'),
  ('air-squat', 27, 47, null, null, '+10 kg'),
  ('air-squat', 28, 51, null, null, '+10 kg'),
  ('air-squat', 29, 56, null, null, '+10 kg'),
  ('air-squat', 30, 60, null, null, '+10 kg'),
  ('sit-up', 1, 15, null, null, 'Sit-up'),
  ('sit-up', 2, 18, null, null, 'Sit-up'),
  ('sit-up', 3, 21, null, null, 'Sit-up'),
  ('sit-up', 4, 23, null, null, 'Sit-up'),
  ('sit-up', 5, 26, null, null, 'Sit-up'),
  ('sit-up', 6, 29, null, null, 'Sit-up'),
  ('sit-up', 7, 32, null, null, 'Sit-up'),
  ('sit-up', 8, 34, null, null, 'Sit-up'),
  ('sit-up', 9, 37, null, null, 'Sit-up'),
  ('sit-up', 10, 40, null, null, 'Sit-up'),
  ('sit-up', 11, 45, null, null, 'Sit-up'),
  ('sit-up', 12, 49, null, null, 'Sit-up'),
  ('sit-up', 13, 53, null, null, 'Sit-up'),
  ('sit-up', 14, 57, null, null, 'Sit-up'),
  ('sit-up', 15, 61, null, null, 'Sit-up'),
  ('sit-up', 16, 64, null, null, 'Sit-up'),
  ('sit-up', 17, 68, null, null, 'Sit-up'),
  ('sit-up', 18, 72, null, null, 'Sit-up'),
  ('sit-up', 19, 76, null, null, 'Sit-up'),
  ('sit-up', 20, 80, null, null, 'Sit-up'),
  ('sit-up', 21, 15, null, null, 'V-up'),
  ('sit-up', 22, 19, null, null, 'V-up'),
  ('sit-up', 23, 23, null, null, 'V-up'),
  ('sit-up', 24, 27, null, null, 'V-up'),
  ('sit-up', 25, 31, null, null, 'V-up'),
  ('sit-up', 26, 34, null, null, 'V-up'),
  ('sit-up', 27, 38, null, null, 'V-up'),
  ('sit-up', 28, 42, null, null, 'V-up'),
  ('sit-up', 29, 46, null, null, 'V-up'),
  ('sit-up', 30, 50, null, null, 'V-up'),
  ('toes-to-bar', 1, 5, null, null, 'Knee raise'),
  ('toes-to-bar', 2, 7, null, null, 'Knee raise'),
  ('toes-to-bar', 3, 9, null, null, 'Knee raise'),
  ('toes-to-bar', 4, 12, null, null, 'Knee raise'),
  ('toes-to-bar', 5, 14, null, null, 'Knee raise'),
  ('toes-to-bar', 6, 16, null, null, 'Knee raise'),
  ('toes-to-bar', 7, 18, null, null, 'Knee raise'),
  ('toes-to-bar', 8, 21, null, null, 'Knee raise'),
  ('toes-to-bar', 9, 23, null, null, 'Knee raise'),
  ('toes-to-bar', 10, 25, null, null, 'Knee raise'),
  ('toes-to-bar', 11, 3, null, null, 'Toes-to-bar'),
  ('toes-to-bar', 12, 5, null, null, 'Toes-to-bar'),
  ('toes-to-bar', 13, 7, null, null, 'Toes-to-bar'),
  ('toes-to-bar', 14, 9, null, null, 'Toes-to-bar'),
  ('toes-to-bar', 15, 11, null, null, 'Toes-to-bar'),
  ('toes-to-bar', 16, 12, null, null, 'Toes-to-bar'),
  ('toes-to-bar', 17, 14, null, null, 'Toes-to-bar'),
  ('toes-to-bar', 18, 16, null, null, 'Toes-to-bar'),
  ('toes-to-bar', 19, 18, null, null, 'Toes-to-bar'),
  ('toes-to-bar', 20, 20, null, null, 'Toes-to-bar'),
  ('toes-to-bar', 21, 25, null, null, 'Toes-to-bar'),
  ('toes-to-bar', 22, 28, null, null, 'Toes-to-bar'),
  ('toes-to-bar', 23, 31, null, null, 'Toes-to-bar'),
  ('toes-to-bar', 24, 33, null, null, 'Toes-to-bar'),
  ('toes-to-bar', 25, 36, null, null, 'Toes-to-bar'),
  ('toes-to-bar', 26, 39, null, null, 'Toes-to-bar'),
  ('toes-to-bar', 27, 42, null, null, 'Toes-to-bar'),
  ('toes-to-bar', 28, 44, null, null, 'Toes-to-bar'),
  ('toes-to-bar', 29, 47, null, null, 'Toes-to-bar'),
  ('toes-to-bar', 30, 50, null, null, 'Toes-to-bar'),
  ('muscle-up', 10, 1, null, null, 'Bar'),
  ('muscle-up', 11, 2, null, null, 'Bar'),
  ('muscle-up', 12, 3, null, null, 'Bar'),
  ('muscle-up', 13, 5, null, null, 'Bar'),
  ('muscle-up', 14, 6, null, null, 'Bar'),
  ('muscle-up', 15, 8, null, null, 'Bar'),
  ('muscle-up', 16, 9, null, null, 'Bar'),
  ('muscle-up', 17, 11, null, null, 'Bar'),
  ('muscle-up', 18, 12, null, null, 'Bar'),
  ('muscle-up', 19, 14, null, null, 'Bar'),
  ('muscle-up', 20, 15, null, null, 'Bar'),
  ('muscle-up', 21, 1, null, null, 'Rings'),
  ('muscle-up', 22, 3, null, null, 'Rings'),
  ('muscle-up', 23, 5, null, null, 'Rings'),
  ('muscle-up', 24, 6, null, null, 'Rings'),
  ('muscle-up', 25, 8, null, null, 'Rings'),
  ('muscle-up', 26, 10, null, null, 'Rings'),
  ('muscle-up', 27, 12, null, null, 'Rings'),
  ('muscle-up', 28, 13, null, null, 'Rings'),
  ('muscle-up', 29, 15, null, null, 'Rings'),
  ('muscle-up', 30, 17, null, null, 'Rings'),
  ('hspu', 1, 5, null, null, 'Pike'),
  ('hspu', 2, 7, null, null, 'Pike'),
  ('hspu', 3, 9, null, null, 'Pike'),
  ('hspu', 4, 12, null, null, 'Pike'),
  ('hspu', 5, 14, null, null, 'Pike'),
  ('hspu', 6, 16, null, null, 'Pike'),
  ('hspu', 7, 18, null, null, 'Pike'),
  ('hspu', 8, 21, null, null, 'Pike'),
  ('hspu', 9, 23, null, null, 'Pike'),
  ('hspu', 10, 25, null, null, 'Pike'),
  ('hspu', 11, 3, null, null, 'Kipping'),
  ('hspu', 12, 5, null, null, 'Kipping'),
  ('hspu', 13, 7, null, null, 'Kipping'),
  ('hspu', 14, 9, null, null, 'Kipping'),
  ('hspu', 15, 11, null, null, 'Kipping'),
  ('hspu', 16, 12, null, null, 'Kipping'),
  ('hspu', 17, 14, null, null, 'Kipping'),
  ('hspu', 18, 16, null, null, 'Kipping'),
  ('hspu', 19, 18, null, null, 'Kipping'),
  ('hspu', 20, 20, null, null, 'Kipping'),
  ('hspu', 21, 25, null, null, 'Kipping'),
  ('hspu', 22, 28, null, null, 'Kipping'),
  ('hspu', 23, 31, null, null, 'Kipping'),
  ('hspu', 24, 33, null, null, 'Kipping'),
  ('hspu', 25, 36, null, null, 'Kipping'),
  ('hspu', 26, 39, null, null, 'Kipping'),
  ('hspu', 27, 42, null, null, 'Kipping'),
  ('hspu', 28, 44, null, null, 'Kipping'),
  ('hspu', 29, 47, null, null, 'Kipping'),
  ('hspu', 30, 50, null, null, 'Kipping'),
  ('strict-hspu', 10, 1, null, null, null),
  ('strict-hspu', 11, 2, null, null, null),
  ('strict-hspu', 12, 3, null, null, null),
  ('strict-hspu', 13, 4, null, null, null),
  ('strict-hspu', 14, 5, null, null, null),
  ('strict-hspu', 15, 6, null, null, null),
  ('strict-hspu', 16, 6, null, null, null),
  ('strict-hspu', 17, 7, null, null, null),
  ('strict-hspu', 18, 8, null, null, null),
  ('strict-hspu', 19, 9, null, null, null),
  ('strict-hspu', 20, 10, null, null, null),
  ('strict-hspu', 21, 12, null, null, null),
  ('strict-hspu', 22, 13, null, null, null),
  ('strict-hspu', 23, 15, null, null, null),
  ('strict-hspu', 24, 16, null, null, null),
  ('strict-hspu', 25, 18, null, null, null),
  ('strict-hspu', 26, 19, null, null, null),
  ('strict-hspu', 27, 21, null, null, null),
  ('strict-hspu', 28, 22, null, null, null),
  ('strict-hspu', 29, 24, null, null, null),
  ('strict-hspu', 30, 25, null, null, null),
  ('handstand-walk', 10, 2, null, null, null),
  ('handstand-walk', 11, 3, null, null, null),
  ('handstand-walk', 12, 4, null, null, null),
  ('handstand-walk', 13, 6, null, null, null),
  ('handstand-walk', 14, 7, null, null, null),
  ('handstand-walk', 15, 8, null, null, null),
  ('handstand-walk', 16, 10, null, null, null),
  ('handstand-walk', 17, 11, null, null, null),
  ('handstand-walk', 18, 12, null, null, null),
  ('handstand-walk', 19, 14, null, null, null),
  ('handstand-walk', 20, 15, null, null, null),
  ('handstand-walk', 21, 20, null, null, null),
  ('handstand-walk', 22, 24, null, null, null),
  ('handstand-walk', 23, 29, null, null, null),
  ('handstand-walk', 24, 33, null, null, null),
  ('handstand-walk', 25, 38, null, null, null),
  ('handstand-walk', 26, 42, null, null, null),
  ('handstand-walk', 27, 47, null, null, null),
  ('handstand-walk', 28, 51, null, null, null),
  ('handstand-walk', 29, 56, null, null, null),
  ('handstand-walk', 30, 60, null, null, null),
  ('rope-climb', 10, 1, null, null, 'With legs'),
  ('rope-climb', 11, 2, null, null, 'With legs'),
  ('rope-climb', 12, 3, null, null, 'With legs'),
  ('rope-climb', 13, 4, null, null, 'With legs'),
  ('rope-climb', 14, 5, null, null, 'With legs'),
  ('rope-climb', 15, 6, null, null, 'With legs'),
  ('rope-climb', 16, 6, null, null, 'With legs'),
  ('rope-climb', 17, 7, null, null, 'With legs'),
  ('rope-climb', 18, 8, null, null, 'With legs'),
  ('rope-climb', 19, 9, null, null, 'With legs'),
  ('rope-climb', 20, 10, null, null, 'With legs'),
  ('rope-climb', 21, 1, null, null, 'Legless'),
  ('rope-climb', 22, 2, null, null, 'Legless'),
  ('rope-climb', 23, 2, null, null, 'Legless'),
  ('rope-climb', 24, 3, null, null, 'Legless'),
  ('rope-climb', 25, 4, null, null, 'Legless'),
  ('rope-climb', 26, 4, null, null, 'Legless'),
  ('rope-climb', 27, 5, null, null, 'Legless'),
  ('rope-climb', 28, 6, null, null, 'Legless'),
  ('rope-climb', 29, 6, null, null, 'Legless'),
  ('rope-climb', 30, 7, null, null, 'Legless'),
  ('l-sit', 10, 10, null, null, null),
  ('l-sit', 11, 12, null, null, null),
  ('l-sit', 12, 14, null, null, null),
  ('l-sit', 13, 16, null, null, null),
  ('l-sit', 14, 18, null, null, null),
  ('l-sit', 15, 20, null, null, null),
  ('l-sit', 16, 22, null, null, null),
  ('l-sit', 17, 24, null, null, null),
  ('l-sit', 18, 26, null, null, null),
  ('l-sit', 19, 28, null, null, null),
  ('l-sit', 20, 30, null, null, null),
  ('l-sit', 21, 35, null, null, null),
  ('l-sit', 22, 41, null, null, null),
  ('l-sit', 23, 47, null, null, null),
  ('l-sit', 24, 53, null, null, null),
  ('l-sit', 25, 59, null, null, null),
  ('l-sit', 26, 66, null, null, null),
  ('l-sit', 27, 72, null, null, null),
  ('l-sit', 28, 78, null, null, null),
  ('l-sit', 29, 84, null, null, null),
  ('l-sit', 30, 90, null, null, null),
  ('dip', 1, 1, null, null, 'Thick band'),
  ('dip', 2, 2, null, null, 'Thick band'),
  ('dip', 3, 4, null, null, 'Thick band'),
  ('dip', 4, 5, null, null, 'Thick band'),
  ('dip', 5, 6, null, null, 'Thick band'),
  ('dip', 6, 7, null, null, 'Thin band'),
  ('dip', 7, 8, null, null, 'Thin band'),
  ('dip', 8, 10, null, null, 'Thin band'),
  ('dip', 9, 11, null, null, 'Thin band'),
  ('dip', 10, 12, null, null, 'Thin band'),
  ('dip', 11, 3, null, null, 'No band'),
  ('dip', 12, 5, null, null, 'No band'),
  ('dip', 13, 7, null, null, 'No band'),
  ('dip', 14, 9, null, null, 'No band'),
  ('dip', 15, 11, null, null, 'No band'),
  ('dip', 16, 12, null, null, 'No band'),
  ('dip', 17, 14, null, null, 'No band'),
  ('dip', 18, 16, null, null, 'No band'),
  ('dip', 19, 18, null, null, 'No band'),
  ('dip', 20, 20, null, null, 'No band'),
  ('dip', 21, 8, null, null, '+10 kg'),
  ('dip', 22, 10, null, null, '+10 kg'),
  ('dip', 23, 12, null, null, '+10 kg'),
  ('dip', 24, 14, null, null, '+10 kg'),
  ('dip', 25, 16, null, null, '+10 kg'),
  ('dip', 26, 17, null, null, '+10 kg'),
  ('dip', 27, 19, null, null, '+10 kg'),
  ('dip', 28, 21, null, null, '+10 kg'),
  ('dip', 29, 23, null, null, '+10 kg'),
  ('dip', 30, 25, null, null, '+10 kg'),
  ('lunge', 1, 10, null, null, 'Bodyweight'),
  ('lunge', 2, 13, null, null, 'Bodyweight'),
  ('lunge', 3, 17, null, null, 'Bodyweight'),
  ('lunge', 4, 20, null, null, 'Bodyweight'),
  ('lunge', 5, 23, null, null, 'Bodyweight'),
  ('lunge', 6, 27, null, null, 'Bodyweight'),
  ('lunge', 7, 30, null, null, 'Bodyweight'),
  ('lunge', 8, 33, null, null, 'Bodyweight'),
  ('lunge', 9, 37, null, null, 'Bodyweight'),
  ('lunge', 10, 40, null, null, 'Bodyweight'),
  ('lunge', 11, 10, null, null, '+20 kg'),
  ('lunge', 12, 13, null, null, '+20 kg'),
  ('lunge', 13, 17, null, null, '+20 kg'),
  ('lunge', 14, 20, null, null, '+20 kg'),
  ('lunge', 15, 23, null, null, '+20 kg'),
  ('lunge', 16, 27, null, null, '+20 kg'),
  ('lunge', 17, 30, null, null, '+20 kg'),
  ('lunge', 18, 33, null, null, '+20 kg'),
  ('lunge', 19, 37, null, null, '+20 kg'),
  ('lunge', 20, 40, null, null, '+20 kg'),
  ('lunge', 21, 10, null, null, '+30 kg'),
  ('lunge', 22, 13, null, null, '+30 kg'),
  ('lunge', 23, 17, null, null, '+30 kg'),
  ('lunge', 24, 20, null, null, '+30 kg'),
  ('lunge', 25, 23, null, null, '+30 kg'),
  ('lunge', 26, 27, null, null, '+30 kg'),
  ('lunge', 27, 30, null, null, '+30 kg'),
  ('lunge', 28, 33, null, null, '+30 kg'),
  ('lunge', 29, 37, null, null, '+30 kg'),
  ('lunge', 30, 40, null, null, '+30 kg'),
  ('pistol-squat', 10, 1, null, null, null),
  ('pistol-squat', 11, 2, null, null, null),
  ('pistol-squat', 12, 3, null, null, null),
  ('pistol-squat', 13, 3, null, null, null),
  ('pistol-squat', 14, 4, null, null, null),
  ('pistol-squat', 15, 5, null, null, null),
  ('pistol-squat', 16, 5, null, null, null),
  ('pistol-squat', 17, 6, null, null, null),
  ('pistol-squat', 18, 7, null, null, null),
  ('pistol-squat', 19, 7, null, null, null),
  ('pistol-squat', 20, 8, null, null, null),
  ('pistol-squat', 21, 10, null, null, null),
  ('pistol-squat', 22, 12, null, null, null),
  ('pistol-squat', 23, 14, null, null, null),
  ('pistol-squat', 24, 17, null, null, null),
  ('pistol-squat', 25, 19, null, null, null),
  ('pistol-squat', 26, 21, null, null, null),
  ('pistol-squat', 27, 23, null, null, null),
  ('pistol-squat', 28, 26, null, null, null),
  ('pistol-squat', 29, 28, null, null, null),
  ('pistol-squat', 30, 30, null, null, null),
  ('deadlift', 1, 60.0, 8, 47.5, null),
  ('deadlift', 2, 66.0, 5, 57.5, null),
  ('deadlift', 3, 71.5, 10, 52.5, null),
  ('deadlift', 4, 77.5, 5, 70.0, null),
  ('deadlift', 5, 83.5, 7, 70.0, null),
  ('deadlift', 6, 89.0, 10, 67.5, null),
  ('deadlift', 7, 95.0, 3, 90.0, null),
  ('deadlift', 8, 101.0, 10, 75.0, null),
  ('deadlift', 9, 106.5, 12, 75.0, null),
  ('deadlift', 10, 112.5, 6, 97.5, null),
  ('deadlift', 11, 117.0, 10, 87.5, null),
  ('deadlift', 12, 121.0, 6, 105.0, null),
  ('deadlift', 13, 125.5, 4, 115.0, null),
  ('deadlift', 14, 129.5, 3, 122.5, null),
  ('deadlift', 15, 134.0, 4, 122.5, null),
  ('deadlift', 16, 138.0, 6, 120.0, null),
  ('deadlift', 17, 142.5, 12, 100.0, null),
  ('deadlift', 18, 146.5, 9, 115.0, null),
  ('deadlift', 19, 151.0, 5, 135.0, null),
  ('deadlift', 20, 155.0, 4, 142.5, null),
  ('deadlift', 21, 164.5, 6, 142.5, null),
  ('deadlift', 22, 174.0, 5, 155.0, null),
  ('deadlift', 23, 183.5, 10, 137.5, null),
  ('deadlift', 24, 193.0, 12, 135.0, null),
  ('deadlift', 25, 202.5, 8, 162.5, null),
  ('deadlift', 26, 212.5, 7, 177.5, null),
  ('deadlift', 27, 222.5, 10, 167.5, null),
  ('deadlift', 28, 232.5, 5, 207.5, null),
  ('deadlift', 29, 242.5, 10, 182.5, null),
  ('deadlift', 30, 252.5, 6, 217.5, null),
  ('front-squat', 1, 40.0, 8, 32.5, null),
  ('front-squat', 2, 44.0, 7, 37.5, null),
  ('front-squat', 3, 48.5, 8, 40.0, null),
  ('front-squat', 4, 52.5, 9, 40.0, null),
  ('front-squat', 5, 56.5, 4, 52.5, null),
  ('front-squat', 6, 61.0, 11, 45.0, null),
  ('front-squat', 7, 65.0, 9, 50.0, null),
  ('front-squat', 8, 69.0, 4, 62.5, null),
  ('front-squat', 9, 73.5, 9, 57.5, null),
  ('front-squat', 10, 77.5, 6, 67.5, null),
  ('front-squat', 11, 80.5, 3, 75.0, null),
  ('front-squat', 12, 83.0, 11, 60.0, null),
  ('front-squat', 13, 86.0, 8, 70.0, null),
  ('front-squat', 14, 88.5, 4, 80.0, null),
  ('front-squat', 15, 91.5, 11, 65.0, null),
  ('front-squat', 16, 94.0, 7, 77.5, null),
  ('front-squat', 17, 97.0, 11, 70.0, null),
  ('front-squat', 18, 99.5, 5, 87.5, null),
  ('front-squat', 19, 102.5, 11, 75.0, null),
  ('front-squat', 20, 105.0, 5, 92.5, null),
  ('front-squat', 21, 111.5, 9, 87.5, null),
  ('front-squat', 22, 118.0, 4, 107.5, null),
  ('front-squat', 23, 124.5, 3, 117.5, null),
  ('front-squat', 24, 131.0, 7, 110.0, null),
  ('front-squat', 25, 137.5, 5, 122.5, null),
  ('front-squat', 26, 144.5, 4, 132.5, null),
  ('front-squat', 27, 151.5, 12, 105.0, null),
  ('front-squat', 28, 158.5, 7, 132.5, null),
  ('front-squat', 29, 165.5, 6, 142.5, null),
  ('front-squat', 30, 172.5, 3, 162.5, null),
  ('overhead-squat', 1, 27.5, 9, 22.5, null),
  ('overhead-squat', 2, 29.5, 7, 25.0, null),
  ('overhead-squat', 3, 32.0, 12, 22.5, null),
  ('overhead-squat', 4, 34.0, 3, 32.5, null),
  ('overhead-squat', 5, 36.5, 10, 27.5, null),
  ('overhead-squat', 6, 38.5, 4, 35.0, null),
  ('overhead-squat', 7, 41.0, 5, 37.5, null),
  ('overhead-squat', 8, 43.0, 11, 30.0, null),
  ('overhead-squat', 9, 45.5, 12, 32.5, null),
  ('overhead-squat', 10, 47.5, 9, 37.5, null),
  ('overhead-squat', 11, 50.5, 5, 45.0, null),
  ('overhead-squat', 12, 53.0, 10, 40.0, null),
  ('overhead-squat', 13, 56.0, 9, 42.5, null),
  ('overhead-squat', 14, 58.5, 6, 50.0, null),
  ('overhead-squat', 15, 61.5, 4, 57.5, null),
  ('overhead-squat', 16, 64.0, 6, 55.0, null),
  ('overhead-squat', 17, 67.0, 8, 55.0, null),
  ('overhead-squat', 18, 69.5, 10, 52.5, null),
  ('overhead-squat', 19, 72.5, 4, 67.5, null),
  ('overhead-squat', 20, 75.0, 3, 70.0, null),
  ('overhead-squat', 21, 82.0, 12, 57.5, null),
  ('overhead-squat', 22, 89.0, 8, 72.5, null),
  ('overhead-squat', 23, 96.0, 7, 80.0, null),
  ('overhead-squat', 24, 103.0, 3, 97.5, null),
  ('overhead-squat', 25, 110.0, 4, 100.0, null),
  ('overhead-squat', 26, 117.5, 8, 95.0, null),
  ('overhead-squat', 27, 125.0, 9, 97.5, null),
  ('overhead-squat', 28, 132.5, 6, 115.0, null),
  ('overhead-squat', 29, 140.0, 12, 97.5, null),
  ('overhead-squat', 30, 147.5, 6, 127.5, null),
  ('back-squat', 1, 50.0, 3, 47.5, null),
  ('back-squat', 2, 55.0, 5, 50.0, null),
  ('back-squat', 3, 60.0, 9, 47.5, null),
  ('back-squat', 4, 65.0, 3, 62.5, null),
  ('back-squat', 5, 70.0, 10, 52.5, null),
  ('back-squat', 6, 75.0, 9, 57.5, null),
  ('back-squat', 7, 80.0, 7, 67.5, null),
  ('back-squat', 8, 85.0, 8, 67.5, null),
  ('back-squat', 9, 90.0, 3, 85.0, null),
  ('back-squat', 10, 95.0, 9, 75.0, null),
  ('back-squat', 11, 98.5, 5, 87.5, null),
  ('back-squat', 12, 102.0, 4, 92.5, null),
  ('back-squat', 13, 105.5, 9, 82.5, null),
  ('back-squat', 14, 109.0, 12, 75.0, null),
  ('back-squat', 15, 112.5, 6, 97.5, null),
  ('back-squat', 16, 116.0, 10, 87.5, null),
  ('back-squat', 17, 119.5, 7, 100.0, null),
  ('back-squat', 18, 123.0, 10, 92.5, null),
  ('back-squat', 19, 126.5, 12, 87.5, null),
  ('back-squat', 20, 130.0, 3, 122.5, null),
  ('back-squat', 21, 138.5, 12, 95.0, null),
  ('back-squat', 22, 147.0, 8, 117.5, null),
  ('back-squat', 23, 155.5, 4, 142.5, null),
  ('back-squat', 24, 164.0, 12, 115.0, null),
  ('back-squat', 25, 172.5, 9, 135.0, null),
  ('back-squat', 26, 182.0, 10, 137.5, null),
  ('back-squat', 27, 191.5, 6, 165.0, null),
  ('back-squat', 28, 201.0, 7, 167.5, null),
  ('back-squat', 29, 210.5, 11, 152.5, null),
  ('back-squat', 30, 220.0, 8, 177.5, null),
  ('push-press', 1, 35.0, 11, 25.0, null),
  ('push-press', 2, 37.5, 8, 30.0, null),
  ('push-press', 3, 40.0, 6, 35.0, null),
  ('push-press', 4, 42.5, 5, 37.5, null),
  ('push-press', 5, 45.0, 6, 40.0, null),
  ('push-press', 6, 47.5, 11, 35.0, null),
  ('push-press', 7, 50.0, 12, 35.0, null),
  ('push-press', 8, 52.5, 9, 40.0, null),
  ('push-press', 9, 55.0, 10, 42.5, null),
  ('push-press', 10, 57.5, 11, 42.5, null),
  ('push-press', 11, 60.0, 6, 52.5, null),
  ('push-press', 12, 62.5, 7, 52.5, null),
  ('push-press', 13, 65.0, 10, 50.0, null),
  ('push-press', 14, 67.5, 4, 62.5, null),
  ('push-press', 15, 70.0, 9, 55.0, null),
  ('push-press', 16, 72.5, 12, 50.0, null),
  ('push-press', 17, 75.0, 3, 70.0, null),
  ('push-press', 18, 77.5, 8, 62.5, null),
  ('push-press', 19, 80.0, 11, 57.5, null),
  ('push-press', 20, 82.5, 4, 75.0, null),
  ('push-press', 21, 88.0, 8, 70.0, null),
  ('push-press', 22, 93.5, 3, 87.5, null),
  ('push-press', 23, 99.0, 9, 77.5, null),
  ('push-press', 24, 104.5, 6, 90.0, null),
  ('push-press', 25, 110.0, 8, 87.5, null),
  ('push-press', 26, 115.5, 9, 90.0, null),
  ('push-press', 27, 121.0, 5, 107.5, null),
  ('push-press', 28, 126.5, 11, 92.5, null),
  ('push-press', 29, 132.0, 9, 102.5, null),
  ('push-press', 30, 137.5, 10, 102.5, null),
  ('strict-press', 1, 30.0, 7, 25.0, null),
  ('strict-press', 2, 31.5, 8, 25.0, null),
  ('strict-press', 3, 33.5, 12, 22.5, null),
  ('strict-press', 4, 35.0, 4, 32.5, null),
  ('strict-press', 5, 36.5, 11, 27.5, null),
  ('strict-press', 6, 38.5, 7, 32.5, null),
  ('strict-press', 7, 40.0, 10, 30.0, null),
  ('strict-press', 8, 41.5, 6, 35.0, null),
  ('strict-press', 9, 43.5, 12, 30.0, null),
  ('strict-press', 10, 45.0, 9, 35.0, null),
  ('strict-press', 11, 47.0, 3, 45.0, null),
  ('strict-press', 12, 48.5, 6, 42.5, null),
  ('strict-press', 13, 50.5, 9, 40.0, null),
  ('strict-press', 14, 52.0, 10, 40.0, null),
  ('strict-press', 15, 54.0, 5, 47.5, null),
  ('strict-press', 16, 55.5, 10, 42.5, null),
  ('strict-press', 17, 57.5, 5, 50.0, null),
  ('strict-press', 18, 59.0, 6, 50.0, null),
  ('strict-press', 19, 61.0, 12, 42.5, null),
  ('strict-press', 20, 62.5, 5, 55.0, null),
  ('strict-press', 21, 67.0, 11, 47.5, null),
  ('strict-press', 22, 71.5, 5, 62.5, null),
  ('strict-press', 23, 76.0, 4, 70.0, null),
  ('strict-press', 24, 80.5, 11, 57.5, null),
  ('strict-press', 25, 85.0, 9, 65.0, null),
  ('strict-press', 26, 89.5, 8, 72.5, null),
  ('strict-press', 27, 94.0, 6, 80.0, null),
  ('strict-press', 28, 98.5, 3, 92.5, null),
  ('strict-press', 29, 103.0, 8, 82.5, null),
  ('strict-press', 30, 107.5, 5, 95.0, null),
  ('clean', 1, 40.0, 11, 30.0, null),
  ('clean', 2, 43.5, 12, 30.0, null),
  ('clean', 3, 46.5, 5, 42.5, null),
  ('clean', 4, 50.0, 11, 35.0, null),
  ('clean', 5, 53.5, 6, 45.0, null),
  ('clean', 6, 56.5, 8, 45.0, null),
  ('clean', 7, 60.0, 3, 57.5, null),
  ('clean', 8, 63.5, 6, 55.0, null),
  ('clean', 9, 66.5, 7, 55.0, null),
  ('clean', 10, 70.0, 6, 60.0, null),
  ('clean', 11, 72.5, 4, 67.5, null),
  ('clean', 12, 74.5, 12, 52.5, null),
  ('clean', 13, 77.0, 9, 60.0, null),
  ('clean', 14, 79.0, 5, 70.0, null),
  ('clean', 15, 81.5, 10, 60.0, null),
  ('clean', 16, 83.5, 5, 75.0, null),
  ('clean', 17, 86.0, 10, 65.0, null),
  ('clean', 18, 88.0, 7, 72.5, null),
  ('clean', 19, 90.5, 11, 65.0, null),
  ('clean', 20, 92.5, 9, 72.5, null),
  ('clean', 21, 97.5, 8, 77.5, null),
  ('clean', 22, 102.5, 3, 97.5, null),
  ('clean', 23, 107.5, 10, 80.0, null),
  ('clean', 24, 112.5, 5, 100.0, null),
  ('clean', 25, 117.5, 12, 82.5, null),
  ('clean', 26, 123.0, 6, 105.0, null),
  ('clean', 27, 128.5, 3, 122.5, null),
  ('clean', 28, 134.0, 8, 107.5, null),
  ('clean', 29, 139.5, 11, 100.0, null),
  ('clean', 30, 145.0, 12, 100.0, null),
  ('clean-and-jerk', 1, 35.0, 12, 25.0, null),
  ('clean-and-jerk', 2, 38.5, 6, 32.5, null),
  ('clean-and-jerk', 3, 41.5, 3, 40.0, null),
  ('clean-and-jerk', 4, 45.0, 12, 32.5, null),
  ('clean-and-jerk', 5, 48.5, 10, 37.5, null),
  ('clean-and-jerk', 6, 51.5, 11, 37.5, null),
  ('clean-and-jerk', 7, 55.0, 6, 47.5, null),
  ('clean-and-jerk', 8, 58.5, 3, 55.0, null),
  ('clean-and-jerk', 9, 61.5, 4, 57.5, null),
  ('clean-and-jerk', 10, 65.0, 3, 62.5, null),
  ('clean-and-jerk', 11, 67.5, 11, 50.0, null),
  ('clean-and-jerk', 12, 70.0, 5, 62.5, null),
  ('clean-and-jerk', 13, 72.5, 12, 50.0, null),
  ('clean-and-jerk', 14, 75.0, 7, 62.5, null),
  ('clean-and-jerk', 15, 77.5, 4, 70.0, null),
  ('clean-and-jerk', 16, 80.0, 8, 65.0, null),
  ('clean-and-jerk', 17, 82.5, 10, 62.5, null),
  ('clean-and-jerk', 18, 85.0, 12, 60.0, null),
  ('clean-and-jerk', 19, 87.5, 4, 80.0, null),
  ('clean-and-jerk', 20, 90.0, 9, 70.0, null),
  ('clean-and-jerk', 21, 95.0, 7, 80.0, null),
  ('clean-and-jerk', 22, 100.0, 3, 95.0, null),
  ('clean-and-jerk', 23, 105.0, 6, 90.0, null),
  ('clean-and-jerk', 24, 110.0, 12, 77.5, null),
  ('clean-and-jerk', 25, 115.0, 9, 90.0, null),
  ('clean-and-jerk', 26, 120.0, 10, 90.0, null),
  ('clean-and-jerk', 27, 125.0, 4, 115.0, null),
  ('clean-and-jerk', 28, 130.0, 11, 95.0, null),
  ('clean-and-jerk', 29, 135.0, 5, 120.0, null),
  ('clean-and-jerk', 30, 140.0, 11, 100.0, null),
  ('db-snatch', 1, 6, null, null, '15 kg'),
  ('db-snatch', 2, 9, null, null, '15 kg'),
  ('db-snatch', 3, 11, null, null, '15 kg'),
  ('db-snatch', 4, 14, null, null, '15 kg'),
  ('db-snatch', 5, 17, null, null, '15 kg'),
  ('db-snatch', 6, 19, null, null, '15 kg'),
  ('db-snatch', 7, 22, null, null, '15 kg'),
  ('db-snatch', 8, 25, null, null, '15 kg'),
  ('db-snatch', 9, 27, null, null, '15 kg'),
  ('db-snatch', 10, 30, null, null, '15 kg'),
  ('db-snatch', 11, 15, null, null, '20 kg'),
  ('db-snatch', 12, 17, null, null, '20 kg'),
  ('db-snatch', 13, 19, null, null, '20 kg'),
  ('db-snatch', 14, 22, null, null, '20 kg'),
  ('db-snatch', 15, 24, null, null, '20 kg'),
  ('db-snatch', 16, 26, null, null, '20 kg'),
  ('db-snatch', 17, 28, null, null, '20 kg'),
  ('db-snatch', 18, 31, null, null, '20 kg'),
  ('db-snatch', 19, 33, null, null, '20 kg'),
  ('db-snatch', 20, 35, null, null, '20 kg'),
  ('db-snatch', 21, 20, null, null, '22.5 kg'),
  ('db-snatch', 22, 23, null, null, '22.5 kg'),
  ('db-snatch', 23, 27, null, null, '22.5 kg'),
  ('db-snatch', 24, 30, null, null, '22.5 kg'),
  ('db-snatch', 25, 33, null, null, '22.5 kg'),
  ('db-snatch', 26, 37, null, null, '22.5 kg'),
  ('db-snatch', 27, 40, null, null, '22.5 kg'),
  ('db-snatch', 28, 43, null, null, '22.5 kg'),
  ('db-snatch', 29, 47, null, null, '22.5 kg'),
  ('db-snatch', 30, 50, null, null, '22.5 kg'),
  ('db-clean-and-jerk', 1, 5, null, null, '15 kg'),
  ('db-clean-and-jerk', 2, 7, null, null, '15 kg'),
  ('db-clean-and-jerk', 3, 9, null, null, '15 kg'),
  ('db-clean-and-jerk', 4, 12, null, null, '15 kg'),
  ('db-clean-and-jerk', 5, 14, null, null, '15 kg'),
  ('db-clean-and-jerk', 6, 16, null, null, '15 kg'),
  ('db-clean-and-jerk', 7, 18, null, null, '15 kg'),
  ('db-clean-and-jerk', 8, 21, null, null, '15 kg'),
  ('db-clean-and-jerk', 9, 23, null, null, '15 kg'),
  ('db-clean-and-jerk', 10, 25, null, null, '15 kg'),
  ('db-clean-and-jerk', 11, 12, null, null, '20 kg'),
  ('db-clean-and-jerk', 12, 14, null, null, '20 kg'),
  ('db-clean-and-jerk', 13, 16, null, null, '20 kg'),
  ('db-clean-and-jerk', 14, 18, null, null, '20 kg'),
  ('db-clean-and-jerk', 15, 20, null, null, '20 kg'),
  ('db-clean-and-jerk', 16, 22, null, null, '20 kg'),
  ('db-clean-and-jerk', 17, 24, null, null, '20 kg'),
  ('db-clean-and-jerk', 18, 26, null, null, '20 kg'),
  ('db-clean-and-jerk', 19, 28, null, null, '20 kg'),
  ('db-clean-and-jerk', 20, 30, null, null, '20 kg'),
  ('db-clean-and-jerk', 21, 15, null, null, '22.5 kg'),
  ('db-clean-and-jerk', 22, 18, null, null, '22.5 kg'),
  ('db-clean-and-jerk', 23, 21, null, null, '22.5 kg'),
  ('db-clean-and-jerk', 24, 23, null, null, '22.5 kg'),
  ('db-clean-and-jerk', 25, 26, null, null, '22.5 kg'),
  ('db-clean-and-jerk', 26, 29, null, null, '22.5 kg'),
  ('db-clean-and-jerk', 27, 32, null, null, '22.5 kg'),
  ('db-clean-and-jerk', 28, 34, null, null, '22.5 kg'),
  ('db-clean-and-jerk', 29, 37, null, null, '22.5 kg'),
  ('db-clean-and-jerk', 30, 40, null, null, '22.5 kg'),
  ('snatch', 1, 30.0, 9, 22.5, null),
  ('snatch', 2, 32.5, 11, 22.5, null),
  ('snatch', 3, 35.0, 3, 32.5, null),
  ('snatch', 4, 37.5, 12, 25.0, null),
  ('snatch', 5, 40.0, 10, 30.0, null),
  ('snatch', 6, 42.5, 12, 30.0, null),
  ('snatch', 7, 45.0, 3, 42.5, null),
  ('snatch', 8, 47.5, 5, 42.5, null),
  ('snatch', 9, 50.0, 8, 40.0, null),
  ('snatch', 10, 52.5, 9, 40.0, null),
  ('snatch', 11, 55.0, 11, 40.0, null),
  ('snatch', 12, 57.0, 4, 52.5, null),
  ('snatch', 13, 59.5, 6, 50.0, null),
  ('snatch', 14, 61.5, 4, 57.5, null),
  ('snatch', 15, 64.0, 5, 57.5, null),
  ('snatch', 16, 66.0, 3, 62.5, null),
  ('snatch', 17, 68.5, 10, 52.5, null),
  ('snatch', 18, 70.5, 8, 57.5, null),
  ('snatch', 19, 73.0, 3, 70.0, null),
  ('snatch', 20, 75.0, 5, 67.5, null),
  ('snatch', 21, 80.0, 7, 67.5, null),
  ('snatch', 22, 85.0, 11, 62.5, null),
  ('snatch', 23, 90.0, 10, 67.5, null),
  ('snatch', 24, 95.0, 6, 82.5, null),
  ('snatch', 25, 100.0, 3, 95.0, null),
  ('snatch', 26, 106.0, 9, 82.5, null),
  ('snatch', 27, 112.0, 8, 90.0, null),
  ('snatch', 28, 118.0, 7, 97.5, null),
  ('snatch', 29, 124.0, 10, 92.5, null),
  ('snatch', 30, 130.0, 7, 107.5, null),
  ('kb-russian-swing', 1, 10, null, null, '16 kg'),
  ('kb-russian-swing', 2, 13, null, null, '16 kg'),
  ('kb-russian-swing', 3, 17, null, null, '16 kg'),
  ('kb-russian-swing', 4, 20, null, null, '16 kg'),
  ('kb-russian-swing', 5, 23, null, null, '16 kg'),
  ('kb-russian-swing', 6, 27, null, null, '16 kg'),
  ('kb-russian-swing', 7, 30, null, null, '16 kg'),
  ('kb-russian-swing', 8, 33, null, null, '16 kg'),
  ('kb-russian-swing', 9, 37, null, null, '16 kg'),
  ('kb-russian-swing', 10, 40, null, null, '16 kg'),
  ('kb-russian-swing', 11, 20, null, null, '24 kg'),
  ('kb-russian-swing', 12, 23, null, null, '24 kg'),
  ('kb-russian-swing', 13, 27, null, null, '24 kg'),
  ('kb-russian-swing', 14, 30, null, null, '24 kg'),
  ('kb-russian-swing', 15, 33, null, null, '24 kg'),
  ('kb-russian-swing', 16, 37, null, null, '24 kg'),
  ('kb-russian-swing', 17, 40, null, null, '24 kg'),
  ('kb-russian-swing', 18, 43, null, null, '24 kg'),
  ('kb-russian-swing', 19, 47, null, null, '24 kg'),
  ('kb-russian-swing', 20, 50, null, null, '24 kg'),
  ('kb-russian-swing', 21, 20, null, null, '32 kg'),
  ('kb-russian-swing', 22, 24, null, null, '32 kg'),
  ('kb-russian-swing', 23, 29, null, null, '32 kg'),
  ('kb-russian-swing', 24, 33, null, null, '32 kg'),
  ('kb-russian-swing', 25, 38, null, null, '32 kg'),
  ('kb-russian-swing', 26, 42, null, null, '32 kg'),
  ('kb-russian-swing', 27, 47, null, null, '32 kg'),
  ('kb-russian-swing', 28, 51, null, null, '32 kg'),
  ('kb-russian-swing', 29, 56, null, null, '32 kg'),
  ('kb-russian-swing', 30, 60, null, null, '32 kg'),
  ('kb-american-swing', 1, 8, null, null, '16 kg'),
  ('kb-american-swing', 2, 10, null, null, '16 kg'),
  ('kb-american-swing', 3, 13, null, null, '16 kg'),
  ('kb-american-swing', 4, 15, null, null, '16 kg'),
  ('kb-american-swing', 5, 18, null, null, '16 kg'),
  ('kb-american-swing', 6, 20, null, null, '16 kg'),
  ('kb-american-swing', 7, 23, null, null, '16 kg'),
  ('kb-american-swing', 8, 25, null, null, '16 kg'),
  ('kb-american-swing', 9, 28, null, null, '16 kg'),
  ('kb-american-swing', 10, 30, null, null, '16 kg'),
  ('kb-american-swing', 11, 15, null, null, '24 kg'),
  ('kb-american-swing', 12, 18, null, null, '24 kg'),
  ('kb-american-swing', 13, 21, null, null, '24 kg'),
  ('kb-american-swing', 14, 23, null, null, '24 kg'),
  ('kb-american-swing', 15, 26, null, null, '24 kg'),
  ('kb-american-swing', 16, 29, null, null, '24 kg'),
  ('kb-american-swing', 17, 32, null, null, '24 kg'),
  ('kb-american-swing', 18, 34, null, null, '24 kg'),
  ('kb-american-swing', 19, 37, null, null, '24 kg'),
  ('kb-american-swing', 20, 40, null, null, '24 kg'),
  ('kb-american-swing', 21, 15, null, null, '32 kg'),
  ('kb-american-swing', 22, 18, null, null, '32 kg'),
  ('kb-american-swing', 23, 21, null, null, '32 kg'),
  ('kb-american-swing', 24, 23, null, null, '32 kg'),
  ('kb-american-swing', 25, 26, null, null, '32 kg'),
  ('kb-american-swing', 26, 29, null, null, '32 kg'),
  ('kb-american-swing', 27, 32, null, null, '32 kg'),
  ('kb-american-swing', 28, 34, null, null, '32 kg'),
  ('kb-american-swing', 29, 37, null, null, '32 kg'),
  ('kb-american-swing', 30, 40, null, null, '32 kg'),
  ('wall-ball', 1, 10, null, null, '6 kg'),
  ('wall-ball', 2, 14, null, null, '6 kg'),
  ('wall-ball', 3, 19, null, null, '6 kg'),
  ('wall-ball', 4, 23, null, null, '6 kg'),
  ('wall-ball', 5, 28, null, null, '6 kg'),
  ('wall-ball', 6, 32, null, null, '6 kg'),
  ('wall-ball', 7, 37, null, null, '6 kg'),
  ('wall-ball', 8, 41, null, null, '6 kg'),
  ('wall-ball', 9, 46, null, null, '6 kg'),
  ('wall-ball', 10, 50, null, null, '6 kg'),
  ('wall-ball', 11, 20, null, null, '9 kg'),
  ('wall-ball', 12, 23, null, null, '9 kg'),
  ('wall-ball', 13, 27, null, null, '9 kg'),
  ('wall-ball', 14, 30, null, null, '9 kg'),
  ('wall-ball', 15, 33, null, null, '9 kg'),
  ('wall-ball', 16, 37, null, null, '9 kg'),
  ('wall-ball', 17, 40, null, null, '9 kg'),
  ('wall-ball', 18, 43, null, null, '9 kg'),
  ('wall-ball', 19, 47, null, null, '9 kg'),
  ('wall-ball', 20, 50, null, null, '9 kg'),
  ('wall-ball', 21, 55, null, null, '9 kg'),
  ('wall-ball', 22, 60, null, null, '9 kg'),
  ('wall-ball', 23, 65, null, null, '9 kg'),
  ('wall-ball', 24, 70, null, null, '9 kg'),
  ('wall-ball', 25, 75, null, null, '9 kg'),
  ('wall-ball', 26, 80, null, null, '9 kg'),
  ('wall-ball', 27, 85, null, null, '9 kg'),
  ('wall-ball', 28, 90, null, null, '9 kg'),
  ('wall-ball', 29, 95, null, null, '9 kg'),
  ('wall-ball', 30, 100, null, null, '9 kg');

-- One PR per skill. Levels validated follow it: see apply_pr.
create table public.skill_prs (
  user_id uuid not null references auth.users (id) on delete cascade,
  skill_id text not null references public.skills (id) on delete cascade,
  variant text,
  value numeric(8, 2) not null check (value > 0),
  updated_at timestamptz not null default now(),
  primary key (user_id, skill_id)
);
alter table public.skill_prs enable row level security;
create policy "Users read their own PRs" on public.skill_prs
  for select to authenticated using ((select auth.uid()) = user_id);
grant select on public.skill_prs to authenticated;

-- A skill stays unlocked once opened, even if the athlete level drops. Only functions touch it.
create table public.skill_unlocks (
  user_id uuid not null references auth.users (id) on delete cascade,
  skill_id text not null references public.skills (id) on delete cascade,
  unlocked_at timestamptz not null default now(),
  primary key (user_id, skill_id)
);
alter table public.skill_unlocks enable row level security;

-- Accounts that already have progress keep it.
insert into public.skill_unlocks (user_id, skill_id)
select a.user_id, s.id
from public.athlete_stats a
join public.skills s on s.entry_level > 1 and s.entry_level <= a.peak_level;

insert into public.skill_prs (user_id, skill_id, variant, value)
select c.user_id, c.skill_id, l.variant, l.target
from (
  select user_id, skill_id, max(level) as level
  from public.level_completions
  group by user_id, skill_id
) c
join public.skill_levels l on l.skill_id = c.skill_id and l.level = c.level;

-- Same rules as before. Skills still locked don't count; once unlocked, the levels below the
-- entry level count as acquired, so an unlock doesn't pull the domain average down.
create or replace function public.athlete_status_for(p_user uuid)
returns jsonb
language plpgsql
stable
set search_path = ''
as $$
declare
  v_xp int;
  v_weakest numeric;
  v_domains jsonb;
  v_unlocked jsonb;
  v_xp_level int;
  v_cap int;
  v_peak int;
begin
  with per_skill as (
    select s.domain_id,
      coalesce(max(c.level), s.entry_level - 1) as last
    from public.skills s
    left join public.level_completions c on c.skill_id = s.id and c.user_id = p_user
    where s.entry_level = 1 or exists (
      select 1 from public.skill_unlocks u where u.user_id = p_user and u.skill_id = s.id
    )
    group by s.id, s.domain_id, s.entry_level
  ),
  per_domain as (
    select d.id, d.name, d.position,
      avg(least(p.last + 1, 30)) as average,
      sum(p.last * (p.last + 1) / 2) / (count(*) * 465.0) as share
    from per_skill p
    join public.domains d on d.id = p.domain_id
    group by d.id, d.name, d.position
  )
  select
    coalesce(round(avg(share) * 46500)::int, 0),
    coalesce(min(average), 1),
    coalesce(
      jsonb_agg(
        jsonb_build_object('id', id, 'name', name, 'average', round(average, 2))
        order by position
      ),
      '[]'::jsonb
    )
  into v_xp, v_weakest, v_domains
  from per_domain;

  v_xp_level := least(30, floor((1 + sqrt(1 + v_xp::double precision * 8 / 100)) / 2)::int);
  v_cap := case when v_weakest < 11 then 10 when v_weakest < 21 then 20 else 30 end;

  select peak_level into v_peak from public.athlete_stats where user_id = p_user;

  select coalesce(jsonb_agg(skill_id), '[]'::jsonb) into v_unlocked
  from public.skill_unlocks where user_id = p_user;

  return jsonb_build_object(
    'xp', v_xp,
    'xp_level', v_xp_level,
    'level', greatest(least(v_xp_level, v_cap), coalesce(v_peak, 1)),
    'domains', v_domains,
    'unlocked', v_unlocked
  );
end;
$$;

-- Opens the skills the athlete has reached and records the level.
-- p_reset recomputes it from scratch, for the changes the athlete chooses (PR edit, restart).
create function public.refresh_athlete(p_user uuid, p_reset boolean)
returns void
language plpgsql
set search_path = ''
as $$
declare
  v_level int;
begin
  if p_reset then
    delete from public.athlete_stats where user_id = p_user;
  end if;

  v_level := (public.athlete_status_for(p_user) ->> 'level')::int;

  insert into public.skill_unlocks (user_id, skill_id)
  select p_user, s.id from public.skills s
  where s.entry_level > 1 and s.entry_level <= v_level
  on conflict do nothing;

  v_level := (public.athlete_status_for(p_user) ->> 'level')::int;

  insert into public.athlete_stats (user_id, peak_level)
  values (p_user, v_level)
  on conflict (user_id) do update
    set peak_level = greatest(public.athlete_stats.peak_level, excluded.peak_level);
end;
$$;

create function public.skill_is_open(p_user uuid, p_skill_id text)
returns boolean
language sql
stable
set search_path = ''
as $$
  select exists (
    select 1 from public.skills s
    where s.id = p_skill_id and (s.entry_level = 1 or exists (
      select 1 from public.skill_unlocks u where u.user_id = p_user and u.skill_id = s.id
    ))
  );
$$;

-- Sets a PR (null clears it) and lines the validated levels up with it.
-- A value below the variant's first target validates up to the end of the previous variant.
create function public.apply_pr(p_user uuid, p_skill_id text, p_variant text, p_value numeric)
returns void
language plpgsql
set search_path = ''
as $$
declare
  v_metric text;
  v_entry int;
  v_best int;
begin
  select metric, entry_level into v_metric, v_entry from public.skills where id = p_skill_id;

  if p_value is null then
    delete from public.skill_prs where user_id = p_user and skill_id = p_skill_id;
    delete from public.level_completions where user_id = p_user and skill_id = p_skill_id;
    return;
  end if;

  if p_value <= 0 or not exists (
    select 1 from public.skill_levels
    where skill_id = p_skill_id and variant is not distinct from p_variant
  ) then
    raise exception 'invalid_pr';
  end if;

  select max(level) into v_best
  from public.skill_levels
  where skill_id = p_skill_id and variant is not distinct from p_variant
    and case when v_metric = 'time' then p_value <= target else p_value >= target end;

  if v_best is null then
    select min(level) - 1 into v_best
    from public.skill_levels
    where skill_id = p_skill_id and variant is not distinct from p_variant;
  end if;

  insert into public.skill_prs (user_id, skill_id, variant, value)
  values (p_user, p_skill_id, p_variant, p_value)
  on conflict (user_id, skill_id) do update
    set variant = excluded.variant, value = excluded.value, updated_at = now();

  delete from public.level_completions
  where user_id = p_user and skill_id = p_skill_id and level > v_best;

  insert into public.level_completions (user_id, skill_id, level)
  select p_user, p_skill_id, l.level
  from public.skill_levels l
  where l.skill_id = p_skill_id and l.level <= v_best
  on conflict do nothing;
end;
$$;

revoke execute on function public.refresh_athlete(uuid, boolean) from public, anon, authenticated;
revoke execute on function public.skill_is_open(uuid, text) from public, anon, authenticated;
revoke execute on function public.apply_pr(uuid, text, text, numeric) from public, anon, authenticated;

-- p_prs: [{ "skill_id": "clean", "variant": null, "value": 92.5 }], value null to clear.
create function public.save_prs(p_prs jsonb)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_user uuid := auth.uid();
  v_item jsonb;
begin
  if v_user is null then
    raise exception 'not_authenticated';
  end if;

  for v_item in select * from jsonb_array_elements(p_prs) loop
    if not public.skill_is_open(v_user, v_item ->> 'skill_id') then
      raise exception 'skill_locked';
    end if;
    perform public.apply_pr(
      v_user, v_item ->> 'skill_id', v_item ->> 'variant', (v_item ->> 'value')::numeric
    );
  end loop;

  perform public.refresh_athlete(v_user, true);
end;
$$;

revoke execute on function public.save_prs(jsonb) from public, anon;
grant execute on function public.save_prs(jsonb) to authenticated;

create or replace function public.validate_level(p_skill_id text, p_level int)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_user uuid := auth.uid();
  v_entry int;
  v_done int;
begin
  if v_user is null then
    raise exception 'not_authenticated';
  end if;
  if not public.skill_is_open(v_user, p_skill_id) then
    raise exception 'skill_locked';
  end if;

  select entry_level into v_entry from public.skills where id = p_skill_id;

  select coalesce(max(level), v_entry - 1) into v_done
  from public.level_completions
  where user_id = v_user and skill_id = p_skill_id;

  if p_level <= v_done then
    return;
  end if;
  if p_level <> v_done + 1 then
    raise exception 'level_locked';
  end if;

  insert into public.level_completions (user_id, skill_id, level)
  values (v_user, p_skill_id, p_level)
  on conflict do nothing;

  -- The PR rises to the level just validated.
  insert into public.skill_prs (user_id, skill_id, variant, value)
  select v_user, l.skill_id, l.variant, l.target
  from public.skill_levels l
  where l.skill_id = p_skill_id and l.level = p_level
  on conflict (user_id, skill_id) do update
    set variant = excluded.variant, value = excluded.value, updated_at = now();

  perform public.refresh_athlete(v_user, false);
end;
$$;

create or replace function public.downgrade_skill(p_skill_id text, p_level int)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_user uuid := auth.uid();
  v_entry int;
begin
  if v_user is null then
    raise exception 'not_authenticated';
  end if;

  select entry_level into v_entry from public.skills where id = p_skill_id;
  if p_level < v_entry then
    raise exception 'below_entry_level';
  end if;

  delete from public.level_completions
  where user_id = v_user and skill_id = p_skill_id and level >= p_level;

  if not found then
    return;
  end if;

  -- The PR follows: the last level still validated, or none.
  if p_level = v_entry then
    delete from public.skill_prs where user_id = v_user and skill_id = p_skill_id;
  else
    update public.skill_prs p
    set variant = l.variant, value = l.target, updated_at = now()
    from public.skill_levels l
    where p.user_id = v_user and p.skill_id = p_skill_id
      and l.skill_id = p_skill_id and l.level = p_level - 1;
  end if;

  perform public.refresh_athlete(v_user, true);
end;
$$;
