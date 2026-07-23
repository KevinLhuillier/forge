import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/prisma/client";

export async function POST(request: NextRequest) {
    try {
        const cookieStore = await cookies();
        const authCookie = cookieStore.get("forge_auth");

        if (!authCookie) {
            return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
        }

        const userId = authCookie.value;
        const { skillId } = await request.json();

        if (!skillId) {
            return NextResponse.json({ error: "skillId manquant" }, { status: 400 });
        }

        // 1. On récupère l'utilisateur et l'état actuel de CE mouvement
        const user = await prisma.user.findUnique({
            where: { id: userId },
            include: {
                skills: {
                    where: { skillId }
                }
            }
        });

        if (!user || user.skills.length === 0) {
            return NextResponse.json({ error: "Utilisateur ou compétence introuvable" }, { status: 404 });
        }

        const currentStage = user.skills[0].stage;

        // Le niveau max dans notre base est 20
        if (currentStage > 20) {
            return NextResponse.json({ error: "Niveau maximum déjà atteint" }, { status: 400 });
        }

        // 2. On regarde combien d'XP rapporte cette étape
        const stageXpData = await prisma.xpStage.findUnique({
            where: { stage: currentStage }
        });

        const xpGained = stageXpData ? stageXpData.xp : 0;
        const newTotalXp = user.xp + xpGained;

        // 3. Calcul de la montée de niveau global du joueur
        // On récupère tous les niveaux pour voir si son nouvel XP lui permet d'en franchir un (ou plusieurs !)
        const allLevels = await prisma.xpLevel.findMany({
            orderBy: { level: 'asc' }
        });

        let newLevel = user.level;
        for (const lvl of allLevels) {
            // Si le niveau est supérieur au sien ET qu'il a assez d'XP pour l'atteindre
            if (lvl.level > user.level && newTotalXp >= lvl.xp) {
                newLevel = lvl.level;
            }
        }

        // 4. Transaction de mise à jour (les deux s'exécutent en même temps de façon sécurisée)
        await prisma.$transaction([
            prisma.userSkill.update({
                where: {
                    userId_skillId: {
                        userId: userId,
                        skillId: skillId
                    }
                },
                data: { stage: currentStage + 1 } // Il passe à l'étape suivante du mouvement
            }),
            prisma.user.update({
                where: { id: userId },
                data: {
                    xp: newTotalXp,       // Nouvel XP total
                    level: newLevel       // Nouveau niveau (s'il a up)
                }
            })
        ]);

        return NextResponse.json({ success: true });

    } catch (error) {
        console.error("Erreur lors de la validation :", error);
        return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
    }
}