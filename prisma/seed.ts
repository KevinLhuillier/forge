import {prisma} from "@/prisma/client";

async function main() {
    console.log('Début du seeding de la table Skills...')

    // createMany permet d'insérer plusieurs lignes d'un coup
    const skills = await prisma.skill.createMany({
        data: [
            { id: 1, name: 'Thruster', type: 'Weightlifting' },
            { id: 2, name: 'Push Press', type: 'Weightlifting' },
            { id: 3, name: 'Snatch', type: 'Weightlifting' },
            { id: 4, name: 'Clean & Jerk', type: 'Weightlifting' },
            { id: 5, name: 'Clean', type: 'Weightlifting' },
            { id: 6, name: 'Deadlift', type: 'Weightlifting' },
            { id: 7, name: 'Front Squat', type: 'Weightlifting' },
            { id: 8, name: 'Back Squat', type: 'Weightlifting' },
            { id: 9, name: 'Overhead Squat', type: 'Weightlifting' },
            { id: 10, name: 'Pull up', type: 'Gym' },
            { id: 11, name: 'Push up', type: 'Gym' },
            { id: 12, name: 'T2B', type: 'Gym' },
            { id: 13, name: 'HSPU', type: 'Gym' },
            { id: 14, name: 'Bar MU', type: 'Gym' },
            { id: 15, name: 'Ring MU', type: 'Gym' },
            { id: 16, name: 'C2B', type: 'Gym' },
            { id: 17, name: 'Pistol Squat', type: 'Gym' },
            { id: 18, name: 'Handstand Walk', type: 'Gym' },
            { id: 19, name: '5km Run', type: 'Cardio' },
            { id: 20, name: 'Row', type: 'Cardio' },
            { id: 21, name: 'Bikerg', type: 'Cardio' },
            { id: 22, name: 'Skierg', type: 'Cardio' },
            { id: 23, name: 'DU', type: 'Cardio' },
            { id: 24, name: 'Burpees', type: 'Cardio' },
            { id: 25, name: 'Box jumps over', type: 'Cardio' }
        ],
        // skipDuplicates permet de relancer le script sans créer d'erreurs
        // si les données existent déjà
        skipDuplicates: true,
    })

    console.log(`${skills.count} mouvements ont été insérés avec succès !`)

    console.log('Début du seeding de la table SkillsStages...')

    const skillStages = await prisma.skillStage.createMany({
        data: [
            // Thruster
            { skillId: 1, stage: 1, stageLabel: '23 kg - 5 reps' }, { skillId: 1, stage: 2, stageLabel: '23 kg - 8 reps' }, { skillId: 1, stage: 3, stageLabel: '29 kg - 4 reps' }, { skillId: 1, stage: 4, stageLabel: '32 kg - 3 reps' },
            { skillId: 1, stage: 5, stageLabel: '28 kg - 10 reps' }, { skillId: 1, stage: 6, stageLabel: '35 kg - 6 reps' }, { skillId: 1, stage: 7, stageLabel: '40 kg - 3 reps' }, { skillId: 1, stage: 8, stageLabel: '38 kg - 7 reps' },
            { skillId: 1, stage: 9, stageLabel: '43 kg - 5 reps' }, { skillId: 1, stage: 10, stageLabel: '40 kg - 9 reps' }, { skillId: 1, stage: 11, stageLabel: '47 kg - 6 reps' }, { skillId: 1, stage: 12, stageLabel: '44 kg - 9 reps' },
            { skillId: 1, stage: 13, stageLabel: '53 kg - 5 reps' }, { skillId: 1, stage: 14, stageLabel: '58 kg - 4 reps' }, { skillId: 1, stage: 15, stageLabel: '48 kg - 11 reps' }, { skillId: 1, stage: 16, stageLabel: '57 kg - 7 reps' },
            { skillId: 1, stage: 17, stageLabel: '65 kg - 4 reps' }, { skillId: 1, stage: 18, stageLabel: '60 kg - 8 reps' }, { skillId: 1, stage: 19, stageLabel: '66 kg - 6 reps' }, { skillId: 1, stage: 20, stageLabel: '60 kg - 10 reps' },

            // Push Press
            { skillId: 2, stage: 1, stageLabel: '23 kg - 5 reps' }, { skillId: 2, stage: 2, stageLabel: '24 kg - 8 reps' }, { skillId: 2, stage: 3, stageLabel: '30 kg - 4 reps' }, { skillId: 2, stage: 4, stageLabel: '34 kg - 3 reps' },
            { skillId: 2, stage: 5, stageLabel: '30 kg - 10 reps' }, { skillId: 2, stage: 6, stageLabel: '38 kg - 6 reps' }, { skillId: 2, stage: 7, stageLabel: '44 kg - 3 reps' }, { skillId: 2, stage: 8, stageLabel: '42 kg - 7 reps' },
            { skillId: 2, stage: 9, stageLabel: '48 kg - 5 reps' }, { skillId: 2, stage: 10, stageLabel: '45 kg - 9 reps' }, { skillId: 2, stage: 11, stageLabel: '53 kg - 6 reps' }, { skillId: 2, stage: 12, stageLabel: '50 kg - 9 reps' },
            { skillId: 2, stage: 13, stageLabel: '61 kg - 5 reps' }, { skillId: 2, stage: 14, stageLabel: '66 kg - 4 reps' }, { skillId: 2, stage: 15, stageLabel: '55 kg - 11 reps' }, { skillId: 2, stage: 16, stageLabel: '65 kg - 7 reps' },
            { skillId: 2, stage: 17, stageLabel: '76 kg - 4 reps' }, { skillId: 2, stage: 18, stageLabel: '69 kg - 8 reps' }, { skillId: 2, stage: 19, stageLabel: '77 kg - 6 reps' }, { skillId: 2, stage: 20, stageLabel: '70 kg - 10 reps' },

            // Snatch
            { skillId: 3, stage: 1, stageLabel: '29 kg - 5 reps' }, { skillId: 3, stage: 2, stageLabel: '29 kg - 8 reps' }, { skillId: 3, stage: 3, stageLabel: '36 kg - 4 reps' }, { skillId: 3, stage: 4, stageLabel: '40 kg - 3 reps' },
            { skillId: 3, stage: 5, stageLabel: '34 kg - 10 reps' }, { skillId: 3, stage: 6, stageLabel: '42 kg - 6 reps' }, { skillId: 3, stage: 7, stageLabel: '49 kg - 3 reps' }, { skillId: 3, stage: 8, stageLabel: '46 kg - 7 reps' },
            { skillId: 3, stage: 9, stageLabel: '52 kg - 5 reps' }, { skillId: 3, stage: 10, stageLabel: '48 kg - 9 reps' }, { skillId: 3, stage: 11, stageLabel: '55 kg - 6 reps' }, { skillId: 3, stage: 12, stageLabel: '53 kg - 9 reps' },
            { skillId: 3, stage: 13, stageLabel: '63 kg - 5 reps' }, { skillId: 3, stage: 14, stageLabel: '68 kg - 4 reps' }, { skillId: 3, stage: 15, stageLabel: '56 kg - 11 reps' }, { skillId: 3, stage: 16, stageLabel: '66 kg - 7 reps' },
            { skillId: 3, stage: 17, stageLabel: '77 kg - 4 reps' }, { skillId: 3, stage: 18, stageLabel: '70 kg - 8 reps' }, { skillId: 3, stage: 19, stageLabel: '77 kg - 6 reps' }, { skillId: 3, stage: 20, stageLabel: '70 kg - 10 reps' },

            // Clean & Jerk
            { skillId: 4, stage: 1, stageLabel: '29 kg - 5 reps' }, { skillId: 4, stage: 2, stageLabel: '30 kg - 8 reps' }, { skillId: 4, stage: 3, stageLabel: '38 kg - 4 reps' }, { skillId: 4, stage: 4, stageLabel: '43 kg - 3 reps' },
            { skillId: 4, stage: 5, stageLabel: '37 kg - 10 reps' }, { skillId: 4, stage: 6, stageLabel: '46 kg - 6 reps' }, { skillId: 4, stage: 7, stageLabel: '55 kg - 3 reps' }, { skillId: 4, stage: 8, stageLabel: '52 kg - 7 reps' },
            { skillId: 4, stage: 9, stageLabel: '59 kg - 5 reps' }, { skillId: 4, stage: 10, stageLabel: '55 kg - 9 reps' }, { skillId: 4, stage: 11, stageLabel: '64 kg - 6 reps' }, { skillId: 4, stage: 12, stageLabel: '62 kg - 9 reps' },
            { skillId: 4, stage: 13, stageLabel: '74 kg - 5 reps' }, { skillId: 4, stage: 14, stageLabel: '81 kg - 4 reps' }, { skillId: 4, stage: 15, stageLabel: '67 kg - 11 reps' }, { skillId: 4, stage: 16, stageLabel: '80 kg - 7 reps' },
            { skillId: 4, stage: 17, stageLabel: '92 kg - 4 reps' }, { skillId: 4, stage: 18, stageLabel: '84 kg - 8 reps' }, { skillId: 4, stage: 19, stageLabel: '93 kg - 6 reps' }, { skillId: 4, stage: 20, stageLabel: '85 kg - 10 reps' },

            // Clean
            { skillId: 5, stage: 1, stageLabel: '35 kg - 5 reps' }, { skillId: 5, stage: 2, stageLabel: '36 kg - 8 reps' }, { skillId: 5, stage: 3, stageLabel: '45 kg - 4 reps' }, { skillId: 5, stage: 4, stageLabel: '51 kg - 3 reps' },
            { skillId: 5, stage: 5, stageLabel: '44 kg - 10 reps' }, { skillId: 5, stage: 6, stageLabel: '55 kg - 6 reps' }, { skillId: 5, stage: 7, stageLabel: '65 kg - 3 reps' }, { skillId: 5, stage: 8, stageLabel: '61 kg - 7 reps' },
            { skillId: 5, stage: 9, stageLabel: '70 kg - 5 reps' }, { skillId: 5, stage: 10, stageLabel: '65 kg - 9 reps' }, { skillId: 5, stage: 11, stageLabel: '76 kg - 6 reps' }, { skillId: 5, stage: 12, stageLabel: '73 kg - 9 reps' },
            { skillId: 5, stage: 13, stageLabel: '88 kg - 5 reps' }, { skillId: 5, stage: 14, stageLabel: '95 kg - 4 reps' }, { skillId: 5, stage: 15, stageLabel: '79 kg - 11 reps' }, { skillId: 5, stage: 16, stageLabel: '94 kg - 7 reps' },
            { skillId: 5, stage: 17, stageLabel: '109 kg - 4 reps' }, { skillId: 5, stage: 18, stageLabel: '100 kg - 8 reps' }, { skillId: 5, stage: 19, stageLabel: '110 kg - 6 reps' }, { skillId: 5, stage: 20, stageLabel: '100 kg - 10 reps' },

            // Deadlift
            { skillId: 6, stage: 1, stageLabel: '59 kg - 5 reps' }, { skillId: 6, stage: 2, stageLabel: '59 kg - 8 reps' }, { skillId: 6, stage: 3, stageLabel: '72 kg - 4 reps' }, { skillId: 6, stage: 4, stageLabel: '80 kg - 3 reps' },
            { skillId: 6, stage: 5, stageLabel: '68 kg - 10 reps' }, { skillId: 6, stage: 6, stageLabel: '84 kg - 6 reps' }, { skillId: 6, stage: 7, stageLabel: '98 kg - 3 reps' }, { skillId: 6, stage: 8, stageLabel: '92 kg - 7 reps' },
            { skillId: 6, stage: 9, stageLabel: '104 kg - 5 reps' }, { skillId: 6, stage: 10, stageLabel: '96 kg - 9 reps' }, { skillId: 6, stage: 11, stageLabel: '111 kg - 6 reps' }, { skillId: 6, stage: 12, stageLabel: '106 kg - 9 reps' },
            { skillId: 6, stage: 13, stageLabel: '126 kg - 5 reps' }, { skillId: 6, stage: 14, stageLabel: '136 kg - 4 reps' }, { skillId: 6, stage: 15, stageLabel: '113 kg - 11 reps' }, { skillId: 6, stage: 16, stageLabel: '133 kg - 7 reps' },
            { skillId: 6, stage: 17, stageLabel: '154 kg - 4 reps' }, { skillId: 6, stage: 18, stageLabel: '140 kg - 8 reps' }, { skillId: 6, stage: 19, stageLabel: '155 kg - 6 reps' }, { skillId: 6, stage: 20, stageLabel: '140 kg - 10 reps' },

            // Front Squat
            { skillId: 7, stage: 1, stageLabel: '35 kg - 5 reps' }, { skillId: 7, stage: 2, stageLabel: '36 kg - 8 reps' }, { skillId: 7, stage: 3, stageLabel: '45 kg - 4 reps' }, { skillId: 7, stage: 4, stageLabel: '51 kg - 3 reps' },
            { skillId: 7, stage: 5, stageLabel: '44 kg - 10 reps' }, { skillId: 7, stage: 6, stageLabel: '55 kg - 6 reps' }, { skillId: 7, stage: 7, stageLabel: '65 kg - 3 reps' }, { skillId: 7, stage: 8, stageLabel: '61 kg - 7 reps' },
            { skillId: 7, stage: 9, stageLabel: '70 kg - 5 reps' }, { skillId: 7, stage: 10, stageLabel: '65 kg - 9 reps' }, { skillId: 7, stage: 11, stageLabel: '76 kg - 6 reps' }, { skillId: 7, stage: 12, stageLabel: '73 kg - 9 reps' },
            { skillId: 7, stage: 13, stageLabel: '88 kg - 5 reps' }, { skillId: 7, stage: 14, stageLabel: '95 kg - 4 reps' }, { skillId: 7, stage: 15, stageLabel: '79 kg - 11 reps' }, { skillId: 7, stage: 16, stageLabel: '94 kg - 7 reps' },
            { skillId: 7, stage: 17, stageLabel: '109 kg - 4 reps' }, { skillId: 7, stage: 18, stageLabel: '100 kg - 8 reps' }, { skillId: 7, stage: 19, stageLabel: '110 kg - 6 reps' }, { skillId: 7, stage: 20, stageLabel: '100 kg - 10 reps' },

            // Back Squat
            { skillId: 8, stage: 1, stageLabel: '47 kg - 5 reps' }, { skillId: 8, stage: 2, stageLabel: '47 kg - 8 reps' }, { skillId: 8, stage: 3, stageLabel: '59 kg - 4 reps' }, { skillId: 8, stage: 4, stageLabel: '65 kg - 3 reps' },
            { skillId: 8, stage: 5, stageLabel: '56 kg - 10 reps' }, { skillId: 8, stage: 6, stageLabel: '70 kg - 6 reps' }, { skillId: 8, stage: 7, stageLabel: '81 kg - 3 reps' }, { skillId: 8, stage: 8, stageLabel: '76 kg - 7 reps' },
            { skillId: 8, stage: 9, stageLabel: '87 kg - 5 reps' }, { skillId: 8, stage: 10, stageLabel: '81 kg - 9 reps' }, { skillId: 8, stage: 11, stageLabel: '94 kg - 6 reps' }, { skillId: 8, stage: 12, stageLabel: '89 kg - 9 reps' },
            { skillId: 8, stage: 13, stageLabel: '107 kg - 5 reps' }, { skillId: 8, stage: 14, stageLabel: '116 kg - 4 reps' }, { skillId: 8, stage: 15, stageLabel: '96 kg - 11 reps' }, { skillId: 8, stage: 16, stageLabel: '114 kg - 7 reps' },
            { skillId: 8, stage: 17, stageLabel: '131 kg - 4 reps' }, { skillId: 8, stage: 18, stageLabel: '120 kg - 8 reps' }, { skillId: 8, stage: 19, stageLabel: '132 kg - 6 reps' }, { skillId: 8, stage: 20, stageLabel: '120 kg - 10 reps' },

            // Overhead Squat
            { skillId: 9, stage: 1, stageLabel: '23 kg - 5 reps' }, { skillId: 9, stage: 2, stageLabel: '24 kg - 8 reps' }, { skillId: 9, stage: 3, stageLabel: '30 kg - 4 reps' }, { skillId: 9, stage: 4, stageLabel: '34 kg - 3 reps' },
            { skillId: 9, stage: 5, stageLabel: '30 kg - 10 reps' }, { skillId: 9, stage: 6, stageLabel: '38 kg - 6 reps' }, { skillId: 9, stage: 7, stageLabel: '44 kg - 3 reps' }, { skillId: 9, stage: 8, stageLabel: '42 kg - 7 reps' },
            { skillId: 9, stage: 9, stageLabel: '48 kg - 5 reps' }, { skillId: 9, stage: 10, stageLabel: '45 kg - 9 reps' }, { skillId: 9, stage: 11, stageLabel: '53 kg - 6 reps' }, { skillId: 9, stage: 12, stageLabel: '50 kg - 9 reps' },
            { skillId: 9, stage: 13, stageLabel: '61 kg - 5 reps' }, { skillId: 9, stage: 14, stageLabel: '66 kg - 4 reps' }, { skillId: 9, stage: 15, stageLabel: '55 kg - 11 reps' }, { skillId: 9, stage: 16, stageLabel: '65 kg - 7 reps' },
            { skillId: 9, stage: 17, stageLabel: '76 kg - 4 reps' }, { skillId: 9, stage: 18, stageLabel: '69 kg - 8 reps' }, { skillId: 9, stage: 19, stageLabel: '77 kg - 6 reps' }, { skillId: 9, stage: 20, stageLabel: '70 kg - 10 reps' },

            // Pull up
            { skillId: 10, stage: 1, stageLabel: '1 reps' }, { skillId: 10, stage: 2, stageLabel: '3 reps' }, { skillId: 10, stage: 3, stageLabel: '5 reps' }, { skillId: 10, stage: 4, stageLabel: '7 reps' },
            { skillId: 10, stage: 5, stageLabel: '9 reps' }, { skillId: 10, stage: 6, stageLabel: '11 reps' }, { skillId: 10, stage: 7, stageLabel: '13 reps' }, { skillId: 10, stage: 8, stageLabel: '15 reps' },
            { skillId: 10, stage: 9, stageLabel: '17 reps' }, { skillId: 10, stage: 10, stageLabel: '19 reps' }, { skillId: 10, stage: 11, stageLabel: '22 reps' }, { skillId: 10, stage: 12, stageLabel: '24 reps' },
            { skillId: 10, stage: 13, stageLabel: '26 reps' }, { skillId: 10, stage: 14, stageLabel: '28 reps' }, { skillId: 10, stage: 15, stageLabel: '30 reps' }, { skillId: 10, stage: 16, stageLabel: '32 reps' },
            { skillId: 10, stage: 17, stageLabel: '34 reps' }, { skillId: 10, stage: 18, stageLabel: '36 reps' }, { skillId: 10, stage: 19, stageLabel: '38 reps' }, { skillId: 10, stage: 20, stageLabel: '40 reps' },

            // Push up
            { skillId: 11, stage: 1, stageLabel: '1 reps' }, { skillId: 11, stage: 2, stageLabel: '3 reps' }, { skillId: 11, stage: 3, stageLabel: '4 reps' }, { skillId: 11, stage: 4, stageLabel: '6 reps' },
            { skillId: 11, stage: 5, stageLabel: '7 reps' }, { skillId: 11, stage: 6, stageLabel: '9 reps' }, { skillId: 11, stage: 7, stageLabel: '10 reps' }, { skillId: 11, stage: 8, stageLabel: '12 reps' },
            { skillId: 11, stage: 9, stageLabel: '13 reps' }, { skillId: 11, stage: 10, stageLabel: '15 reps' }, { skillId: 11, stage: 11, stageLabel: '16 reps' }, { skillId: 11, stage: 12, stageLabel: '18 reps' },
            { skillId: 11, stage: 13, stageLabel: '19 reps' }, { skillId: 11, stage: 14, stageLabel: '21 reps' }, { skillId: 11, stage: 15, stageLabel: '22 reps' }, { skillId: 11, stage: 16, stageLabel: '24 reps' },
            { skillId: 11, stage: 17, stageLabel: '25 reps' }, { skillId: 11, stage: 18, stageLabel: '27 reps' }, { skillId: 11, stage: 19, stageLabel: '28 reps' }, { skillId: 11, stage: 20, stageLabel: '30 reps' },

            // Toes to bar
            { skillId: 12, stage: 1, stageLabel: '1 reps' }, { skillId: 12, stage: 2, stageLabel: '4 reps' }, { skillId: 12, stage: 3, stageLabel: '6 reps' }, { skillId: 12, stage: 4, stageLabel: '9 reps' },
            { skillId: 12, stage: 5, stageLabel: '11 reps' }, { skillId: 12, stage: 6, stageLabel: '14 reps' }, { skillId: 12, stage: 7, stageLabel: '16 reps' }, { skillId: 12, stage: 8, stageLabel: '19 reps' },
            { skillId: 12, stage: 9, stageLabel: '22 reps' }, { skillId: 12, stage: 10, stageLabel: '24 reps' }, { skillId: 12, stage: 11, stageLabel: '27 reps' }, { skillId: 12, stage: 12, stageLabel: '29 reps' },
            { skillId: 12, stage: 13, stageLabel: '32 reps' }, { skillId: 12, stage: 14, stageLabel: '35 reps' }, { skillId: 12, stage: 15, stageLabel: '37 reps' }, { skillId: 12, stage: 16, stageLabel: '40 reps' },
            { skillId: 12, stage: 17, stageLabel: '42 reps' }, { skillId: 12, stage: 18, stageLabel: '45 reps' }, { skillId: 12, stage: 19, stageLabel: '47 reps' }, { skillId: 12, stage: 20, stageLabel: '50 reps' },

            // Handstand Push up
            { skillId: 13, stage: 1, stageLabel: '1 reps' }, { skillId: 13, stage: 2, stageLabel: '4 reps' }, { skillId: 13, stage: 3, stageLabel: '6 reps' }, { skillId: 13, stage: 4, stageLabel: '9 reps' },
            { skillId: 13, stage: 5, stageLabel: '11 reps' }, { skillId: 13, stage: 6, stageLabel: '14 reps' }, { skillId: 13, stage: 7, stageLabel: '16 reps' }, { skillId: 13, stage: 8, stageLabel: '19 reps' },
            { skillId: 13, stage: 9, stageLabel: '22 reps' }, { skillId: 13, stage: 10, stageLabel: '24 reps' }, { skillId: 13, stage: 11, stageLabel: '27 reps' }, { skillId: 13, stage: 12, stageLabel: '29 reps' },
            { skillId: 13, stage: 13, stageLabel: '32 reps' }, { skillId: 13, stage: 14, stageLabel: '35 reps' }, { skillId: 13, stage: 15, stageLabel: '37 reps' }, { skillId: 13, stage: 16, stageLabel: '40 reps' },
            { skillId: 13, stage: 17, stageLabel: '42 reps' }, { skillId: 13, stage: 18, stageLabel: '45 reps' }, { skillId: 13, stage: 19, stageLabel: '47 reps' }, { skillId: 13, stage: 20, stageLabel: '50 reps' },

            // Bar MU
            { skillId: 14, stage: 1, stageLabel: '1 reps' }, { skillId: 14, stage: 2, stageLabel: '2 reps' }, { skillId: 14, stage: 3, stageLabel: '3 reps' }, { skillId: 14, stage: 4, stageLabel: '4 reps' },
            { skillId: 14, stage: 5, stageLabel: '5 reps' }, { skillId: 14, stage: 6, stageLabel: '6 reps' }, { skillId: 14, stage: 7, stageLabel: '7 reps' }, { skillId: 14, stage: 8, stageLabel: '8 reps' },
            { skillId: 14, stage: 9, stageLabel: '9 reps' }, { skillId: 14, stage: 10, stageLabel: '10 reps' }, { skillId: 14, stage: 11, stageLabel: '11 reps' }, { skillId: 14, stage: 12, stageLabel: '12 reps' },
            { skillId: 14, stage: 13, stageLabel: '13 reps' }, { skillId: 14, stage: 14, stageLabel: '14 reps' }, { skillId: 14, stage: 15, stageLabel: '15 reps' }, { skillId: 14, stage: 16, stageLabel: '16 reps' },
            { skillId: 14, stage: 17, stageLabel: '17 reps' }, { skillId: 14, stage: 18, stageLabel: '18 reps' }, { skillId: 14, stage: 19, stageLabel: '19 reps' }, { skillId: 14, stage: 20, stageLabel: '20 reps' },

            // Ring MU
            { skillId: 15, stage: 1, stageLabel: '1 reps' }, { skillId: 15, stage: 2, stageLabel: '2 reps' }, { skillId: 15, stage: 3, stageLabel: '2 reps' }, { skillId: 15, stage: 4, stageLabel: '3 reps' },
            { skillId: 15, stage: 5, stageLabel: '4 reps' }, { skillId: 15, stage: 6, stageLabel: '5 reps' }, { skillId: 15, stage: 7, stageLabel: '5 reps' }, { skillId: 15, stage: 8, stageLabel: '6 reps' },
            { skillId: 15, stage: 9, stageLabel: '7 reps' }, { skillId: 15, stage: 10, stageLabel: '8 reps' }, { skillId: 15, stage: 11, stageLabel: '8 reps' }, { skillId: 15, stage: 12, stageLabel: '9 reps' },
            { skillId: 15, stage: 13, stageLabel: '10 reps' }, { skillId: 15, stage: 14, stageLabel: '11 reps' }, { skillId: 15, stage: 15, stageLabel: '11 reps' }, { skillId: 15, stage: 16, stageLabel: '12 reps' },
            { skillId: 15, stage: 17, stageLabel: '13 reps' }, { skillId: 15, stage: 18, stageLabel: '14 reps' }, { skillId: 15, stage: 19, stageLabel: '14 reps' }, { skillId: 15, stage: 20, stageLabel: '15 reps' },

            // Chest to bar
            { skillId: 16, stage: 1, stageLabel: '1 reps' }, { skillId: 16, stage: 2, stageLabel: '2 reps' }, { skillId: 16, stage: 3, stageLabel: '4 reps' }, { skillId: 16, stage: 4, stageLabel: '5 reps' },
            { skillId: 16, stage: 5, stageLabel: '6 reps' }, { skillId: 16, stage: 6, stageLabel: '7 reps' }, { skillId: 16, stage: 7, stageLabel: '9 reps' }, { skillId: 16, stage: 8, stageLabel: '10 reps' },
            { skillId: 16, stage: 9, stageLabel: '11 reps' }, { skillId: 16, stage: 10, stageLabel: '12 reps' }, { skillId: 16, stage: 11, stageLabel: '14 reps' }, { skillId: 16, stage: 12, stageLabel: '15 reps' },
            { skillId: 16, stage: 13, stageLabel: '16 reps' }, { skillId: 16, stage: 14, stageLabel: '17 reps' }, { skillId: 16, stage: 15, stageLabel: '19 reps' }, { skillId: 16, stage: 16, stageLabel: '20 reps' },
            { skillId: 16, stage: 17, stageLabel: '21 reps' }, { skillId: 16, stage: 18, stageLabel: '22 reps' }, { skillId: 16, stage: 19, stageLabel: '24 reps' }, { skillId: 16, stage: 20, stageLabel: '25 reps' },

            // Pistol Squat
            { skillId: 17, stage: 1, stageLabel: '1 reps' }, { skillId: 17, stage: 2, stageLabel: '3 reps' }, { skillId: 17, stage: 3, stageLabel: '5 reps' }, { skillId: 17, stage: 4, stageLabel: '7 reps' },
            { skillId: 17, stage: 5, stageLabel: '9 reps' }, { skillId: 17, stage: 6, stageLabel: '11 reps' }, { skillId: 17, stage: 7, stageLabel: '13 reps' }, { skillId: 17, stage: 8, stageLabel: '15 reps' },
            { skillId: 17, stage: 9, stageLabel: '17 reps' }, { skillId: 17, stage: 10, stageLabel: '19 reps' }, { skillId: 17, stage: 11, stageLabel: '22 reps' }, { skillId: 17, stage: 12, stageLabel: '24 reps' },
            { skillId: 17, stage: 13, stageLabel: '26 reps' }, { skillId: 17, stage: 14, stageLabel: '28 reps' }, { skillId: 17, stage: 15, stageLabel: '30 reps' }, { skillId: 17, stage: 16, stageLabel: '32 reps' },
            { skillId: 17, stage: 17, stageLabel: '34 reps' }, { skillId: 17, stage: 18, stageLabel: '36 reps' }, { skillId: 17, stage: 19, stageLabel: '38 reps' }, { skillId: 17, stage: 20, stageLabel: '40 reps' },

            // Handstand Walk
            { skillId: 18, stage: 1, stageLabel: '1 meters' }, { skillId: 18, stage: 2, stageLabel: '2 meters' }, { skillId: 18, stage: 3, stageLabel: '3 meters' }, { skillId: 18, stage: 4, stageLabel: '4 meters' },
            { skillId: 18, stage: 5, stageLabel: '5 meters' }, { skillId: 18, stage: 6, stageLabel: '6 meters' }, { skillId: 18, stage: 7, stageLabel: '7 meters' }, { skillId: 18, stage: 8, stageLabel: '8 meters' },
            { skillId: 18, stage: 9, stageLabel: '9 meters' }, { skillId: 18, stage: 10, stageLabel: '10 meters' }, { skillId: 18, stage: 11, stageLabel: '11 meters' }, { skillId: 18, stage: 12, stageLabel: '12 meters' },
            { skillId: 18, stage: 13, stageLabel: '13 meters' }, { skillId: 18, stage: 14, stageLabel: '14 meters' }, { skillId: 18, stage: 15, stageLabel: '15 meters' }, { skillId: 18, stage: 16, stageLabel: '16 meters' },
            { skillId: 18, stage: 17, stageLabel: '17 meters' }, { skillId: 18, stage: 18, stageLabel: '18 meters' }, { skillId: 18, stage: 19, stageLabel: '19 meters' }, { skillId: 18, stage: 20, stageLabel: '20 meters' },

            // 5km Run
            { skillId: 19, stage: 1, stageLabel: '36 minutes' }, { skillId: 19, stage: 2, stageLabel: '35 minutes' }, { skillId: 19, stage: 3, stageLabel: '34 minutes' }, { skillId: 19, stage: 4, stageLabel: '33 minutes' },
            { skillId: 19, stage: 5, stageLabel: '32 minutes' }, { skillId: 19, stage: 6, stageLabel: '31 minutes' }, { skillId: 19, stage: 7, stageLabel: '30 minutes' }, { skillId: 19, stage: 8, stageLabel: '29 minutes' },
            { skillId: 19, stage: 9, stageLabel: '28 minutes' }, { skillId: 19, stage: 10, stageLabel: '27 minutes' }, { skillId: 19, stage: 11, stageLabel: '26 minutes' }, { skillId: 19, stage: 12, stageLabel: '25 minutes' },
            { skillId: 19, stage: 13, stageLabel: '24 minutes' }, { skillId: 19, stage: 14, stageLabel: '23 minutes' }, { skillId: 19, stage: 15, stageLabel: '22 minutes' }, { skillId: 19, stage: 16, stageLabel: '21 minutes' },
            { skillId: 19, stage: 17, stageLabel: '20 minutes' }, { skillId: 19, stage: 18, stageLabel: '19 minutes' }, { skillId: 19, stage: 19, stageLabel: '18 minutes' }, { skillId: 19, stage: 20, stageLabel: '17 minutes' },

            // Row
            { skillId: 20, stage: 1, stageLabel: '2.5 minutes – 500m' }, { skillId: 20, stage: 2, stageLabel: '2.45 minutes – 500m' }, { skillId: 20, stage: 3, stageLabel: '2.39 minutes – 500m' }, { skillId: 20, stage: 4, stageLabel: '2.34 minutes – 500m' },
            { skillId: 20, stage: 5, stageLabel: '2.29 minutes – 500m' }, { skillId: 20, stage: 6, stageLabel: '2.24 minutes – 500m' }, { skillId: 20, stage: 7, stageLabel: '2.18 minutes – 500m' }, { skillId: 20, stage: 8, stageLabel: '2.13 minutes – 500m' },
            { skillId: 20, stage: 9, stageLabel: '2.08 minutes – 500m' }, { skillId: 20, stage: 10, stageLabel: '2.03 minutes – 500m' }, { skillId: 20, stage: 11, stageLabel: '1.97 minutes – 500m' }, { skillId: 20, stage: 12, stageLabel: '1.92 minutes – 500m' },
            { skillId: 20, stage: 13, stageLabel: '1.87 minutes – 500m' }, { skillId: 20, stage: 14, stageLabel: '1.82 minutes – 500m' }, { skillId: 20, stage: 15, stageLabel: '1.76 minutes – 500m' }, { skillId: 20, stage: 16, stageLabel: '1.71 minutes – 500m' },
            { skillId: 20, stage: 17, stageLabel: '1.66 minutes – 500m' }, { skillId: 20, stage: 18, stageLabel: '1.61 minutes – 500m' }, { skillId: 20, stage: 19, stageLabel: '1.55 minutes – 500m' }, { skillId: 20, stage: 20, stageLabel: '1.5 minutes – 500m' },

            // Bikerg
            { skillId: 21, stage: 1, stageLabel: '2.5 minutes – 1km' }, { skillId: 21, stage: 2, stageLabel: '2.45 minutes – 1km' }, { skillId: 21, stage: 3, stageLabel: '2.39 minutes – 1km' }, { skillId: 21, stage: 4, stageLabel: '2.34 minutes – 1km' },
            { skillId: 21, stage: 5, stageLabel: '2.29 minutes – 1km' }, { skillId: 21, stage: 6, stageLabel: '2.24 minutes – 1km' }, { skillId: 21, stage: 7, stageLabel: '2.18 minutes – 1km' }, { skillId: 21, stage: 8, stageLabel: '2.13 minutes – 1km' },
            { skillId: 21, stage: 9, stageLabel: '2.08 minutes – 1km' }, { skillId: 21, stage: 10, stageLabel: '2.03 minutes – 1km' }, { skillId: 21, stage: 11, stageLabel: '1.97 minutes – 1km' }, { skillId: 21, stage: 12, stageLabel: '1.92 minutes – 1km' },
            { skillId: 21, stage: 13, stageLabel: '1.87 minutes – 1km' }, { skillId: 21, stage: 14, stageLabel: '1.82 minutes – 1km' }, { skillId: 21, stage: 15, stageLabel: '1.76 minutes – 1km' }, { skillId: 21, stage: 16, stageLabel: '1.71 minutes – 1km' },
            { skillId: 21, stage: 17, stageLabel: '1.66 minutes – 1km' }, { skillId: 21, stage: 18, stageLabel: '1.61 minutes – 1km' }, { skillId: 21, stage: 19, stageLabel: '1.55 minutes – 1km' }, { skillId: 21, stage: 20, stageLabel: '1.5 minutes – 1km' },

            // Skierg
            { skillId: 22, stage: 1, stageLabel: '2.5 minutes – 500m' }, { skillId: 22, stage: 2, stageLabel: '2.45 minutes – 500m' }, { skillId: 22, stage: 3, stageLabel: '2.39 minutes – 500m' }, { skillId: 22, stage: 4, stageLabel: '2.34 minutes – 500m' },
            { skillId: 22, stage: 5, stageLabel: '2.29 minutes – 500m' }, { skillId: 22, stage: 6, stageLabel: '2.24 minutes – 500m' }, { skillId: 22, stage: 7, stageLabel: '2.18 minutes – 500m' }, { skillId: 22, stage: 8, stageLabel: '2.13 minutes – 500m' },
            { skillId: 22, stage: 9, stageLabel: '2.08 minutes – 500m' }, { skillId: 22, stage: 10, stageLabel: '2.03 minutes – 500m' }, { skillId: 22, stage: 11, stageLabel: '1.97 minutes – 500m' }, { skillId: 22, stage: 12, stageLabel: '1.92 minutes – 500m' },
            { skillId: 22, stage: 13, stageLabel: '1.87 minutes – 500m' }, { skillId: 22, stage: 14, stageLabel: '1.82 minutes – 500m' }, { skillId: 22, stage: 15, stageLabel: '1.76 minutes – 500m' }, { skillId: 22, stage: 16, stageLabel: '1.71 minutes – 500m' },
            { skillId: 22, stage: 17, stageLabel: '1.66 minutes – 500m' }, { skillId: 22, stage: 18, stageLabel: '1.61 minutes – 500m' }, { skillId: 22, stage: 19, stageLabel: '1.55 minutes – 500m' }, { skillId: 22, stage: 20, stageLabel: '1.5 minutes – 500m' },

            // DU
            { skillId: 23, stage: 1, stageLabel: '1 reps in a row' }, { skillId: 23, stage: 2, stageLabel: '6 reps in a row' }, { skillId: 23, stage: 3, stageLabel: '11 reps in a row' }, { skillId: 23, stage: 4, stageLabel: '17 reps in a row' },
            { skillId: 23, stage: 5, stageLabel: '22 reps in a row' }, { skillId: 23, stage: 6, stageLabel: '27 reps in a row' }, { skillId: 23, stage: 7, stageLabel: '32 reps in a row' }, { skillId: 23, stage: 8, stageLabel: '37 reps in a row' },
            { skillId: 23, stage: 9, stageLabel: '43 reps in a row' }, { skillId: 23, stage: 10, stageLabel: '48 reps in a row' }, { skillId: 23, stage: 11, stageLabel: '53 reps in a row' }, { skillId: 23, stage: 12, stageLabel: '58 reps in a row' },
            { skillId: 23, stage: 13, stageLabel: '64 reps in a row' }, { skillId: 23, stage: 14, stageLabel: '69 reps in a row' }, { skillId: 23, stage: 15, stageLabel: '74 reps in a row' }, { skillId: 23, stage: 16, stageLabel: '79 reps in a row' },
            { skillId: 23, stage: 17, stageLabel: '84 reps in a row' }, { skillId: 23, stage: 18, stageLabel: '90 reps in a row' }, { skillId: 23, stage: 19, stageLabel: '95 reps in a row' }, { skillId: 23, stage: 20, stageLabel: '100 reps in a row' },

            // Burpees
            { skillId: 24, stage: 1, stageLabel: '5 reps under 1 minute' }, { skillId: 24, stage: 2, stageLabel: '6 reps under 1 minute' }, { skillId: 24, stage: 3, stageLabel: '8 reps under 1 minute' }, { skillId: 24, stage: 4, stageLabel: '9 reps under 1 minute' },
            { skillId: 24, stage: 5, stageLabel: '10 reps under 1 minute' }, { skillId: 24, stage: 6, stageLabel: '12 reps under 1 minute' }, { skillId: 24, stage: 7, stageLabel: '13 reps under 1 minute' }, { skillId: 24, stage: 8, stageLabel: '14 reps under 1 minute' },
            { skillId: 24, stage: 9, stageLabel: '16 reps under 1 minute' }, { skillId: 24, stage: 10, stageLabel: '17 reps under 1 minute' }, { skillId: 24, stage: 11, stageLabel: '18 reps under 1 minute' }, { skillId: 24, stage: 12, stageLabel: '19 reps under 1 minute' },
            { skillId: 24, stage: 13, stageLabel: '21 reps under 1 minute' }, { skillId: 24, stage: 14, stageLabel: '22 reps under 1 minute' }, { skillId: 24, stage: 15, stageLabel: '23 reps under 1 minute' }, { skillId: 24, stage: 16, stageLabel: '25 reps under 1 minute' },
            { skillId: 24, stage: 17, stageLabel: '26 reps under 1 minute' }, { skillId: 24, stage: 18, stageLabel: '27 reps under 1 minute' }, { skillId: 24, stage: 19, stageLabel: '29 reps under 1 minute' }, { skillId: 24, stage: 20, stageLabel: '30 reps under 1 minute' },

            // Box jumps over
            { skillId: 25, stage: 1, stageLabel: '5 reps under 1 minute' }, { skillId: 25, stage: 2, stageLabel: '7 reps under 1 minute' }, { skillId: 25, stage: 3, stageLabel: '10 reps under 1 minute' }, { skillId: 25, stage: 4, stageLabel: '12 reps under 1 minute' },
            { skillId: 25, stage: 5, stageLabel: '14 reps under 1 minute' }, { skillId: 25, stage: 6, stageLabel: '17 reps under 1 minute' }, { skillId: 25, stage: 7, stageLabel: '19 reps under 1 minute' }, { skillId: 25, stage: 8, stageLabel: '22 reps under 1 minute' },
            { skillId: 25, stage: 9, stageLabel: '24 reps under 1 minute' }, { skillId: 25, stage: 10, stageLabel: '26 reps under 1 minute' }, { skillId: 25, stage: 11, stageLabel: '29 reps under 1 minute' }, { skillId: 25, stage: 12, stageLabel: '31 reps under 1 minute' },
            { skillId: 25, stage: 13, stageLabel: '33 reps under 1 minute' }, { skillId: 25, stage: 14, stageLabel: '36 reps under 1 minute' }, { skillId: 25, stage: 15, stageLabel: '38 reps under 1 minute' }, { skillId: 25, stage: 16, stageLabel: '41 reps under 1 minute' },
            { skillId: 25, stage: 17, stageLabel: '43 reps under 1 minute' }, { skillId: 25, stage: 18, stageLabel: '45 reps under 1 minute' }, { skillId: 25, stage: 19, stageLabel: '48 reps under 1 minute' }, { skillId: 25, stage: 20, stageLabel: '50 reps under 1 minute' }
        ],
        skipDuplicates: true,
    })

    console.log(`${skillStages.count} étapes de mouvements ont été insérées avec succès !`)

    console.log('Début du seeding de la table XpLevels...')

    const xpLevels = await prisma.xpLevel.createMany({
        data: [
            { level: 1, xp: 5 }, { level: 2, xp: 20 }, { level: 3, xp: 49 }, { level: 4, xp: 95 }, { level: 5, xp: 161 },
            { level: 6, xp: 249 }, { level: 7, xp: 361 }, { level: 8, xp: 500 }, { level: 9, xp: 668 }, { level: 10, xp: 867 },
            { level: 11, xp: 1099 }, { level: 12, xp: 1365 }, { level: 13, xp: 1668 }, { level: 14, xp: 2009 }, { level: 15, xp: 2390 },
            { level: 16, xp: 2812 }, { level: 17, xp: 3277 }, { level: 18, xp: 3787 }, { level: 19, xp: 4343 }, { level: 20, xp: 4946 },
            { level: 21, xp: 5598 }, { level: 22, xp: 6301 }, { level: 23, xp: 7056 }, { level: 24, xp: 7864 }, { level: 25, xp: 8726 },
            { level: 26, xp: 9644 }, { level: 27, xp: 10619 }, { level: 28, xp: 11653 }, { level: 29, xp: 12746 }, { level: 30, xp: 13900 },
            { level: 31, xp: 15117 }, { level: 32, xp: 16397 }, { level: 33, xp: 17742 }, { level: 34, xp: 19152 }, { level: 35, xp: 20629 },
            { level: 36, xp: 22174 }, { level: 37, xp: 23789 }, { level: 38, xp: 25474 }, { level: 39, xp: 27231 }, { level: 40, xp: 29060 },
            { level: 41, xp: 30963 }, { level: 42, xp: 32941 }, { level: 43, xp: 34995 }, { level: 44, xp: 37126 }, { level: 45, xp: 39335 },
            { level: 46, xp: 41623 }, { level: 47, xp: 43991 }, { level: 48, xp: 46440 }, { level: 49, xp: 48971 }, { level: 50, xp: 51585 }
        ],
        skipDuplicates: true,
    })

    console.log(`${xpLevels.count} niveaux d'XP ont été insérés avec succès !`)

    console.log('Début du seeding de la table XpStages...')

    const xpStages = await prisma.xpStage.createMany({
        data: [
            { stage: 1, xp: 2 }, { stage: 2, xp: 6 }, { stage: 3, xp: 12 }, { stage: 4, xp: 19 }, { stage: 5, xp: 27 },
            { stage: 6, xp: 36 }, { stage: 7, xp: 46 }, { stage: 8, xp: 58 }, { stage: 9, xp: 70 }, { stage: 10, xp: 83 },
            { stage: 11, xp: 96 }, { stage: 12, xp: 111 }, { stage: 13, xp: 126 }, { stage: 14, xp: 142 }, { stage: 15, xp: 159 },
            { stage: 16, xp: 177 }, { stage: 17, xp: 195 }, { stage: 18, xp: 214 }, { stage: 19, xp: 233 }, { stage: 20, xp: 253 }
        ],
        skipDuplicates: true,
    })

    console.log(`${xpStages.count} gains d'XP par étape ont été insérés avec succès !`)
}



main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })