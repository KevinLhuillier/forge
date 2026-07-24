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

        const user = await prisma.user.findUnique({
            where: { id: userId },
            include: { skills: { where: { skillId } } }
        });

        if (!user || user.skills.length === 0) {
            return NextResponse.json({ error: "Utilisateur ou compétence introuvable" }, { status: 404 });
        }

        const currentStage = user.skills[0].stage;

        // On ne peut pas descendre en dessous du niveau 1
        if (currentStage <= 1) {
            return NextResponse.json({ error: "Niveau minimum déjà atteint" }, { status: 400 });
        }

        // 1. On récupère l'XP de l'étape que l'on s'apprête à annuler (donc l'étape précédente)
        const stageXpData = await prisma.xpStage.findUnique({
            where: { stage: currentStage - 1 }
        });

        const xpLost = stageXpData ? stageXpData.xp : 0;

        // On s'assure de ne jamais avoir d'XP négatif
        const newTotalXp = Math.max(0, user.xp - xpLost);

        // 2. Recalcul total du niveau global du joueur en partant de 1
        const allLevels = await prisma.xpLevel.findMany({
            orderBy: { level: 'asc' }
        });

        let newLevel = 1;
        for (const lvl of allLevels) {
            if (newTotalXp >= lvl.xp) {
                newLevel = lvl.level;
            }
        }

        // 3. Recalcul du Rang (Rank)
        let newRank = "Scaled";
        if (newLevel >= 35) {
            newRank = "Rx";
        } else if (newLevel >= 20) {
            newRank = "Inter";
        }

        const hasLeveledDown = newLevel < user.level;
        const hasRankedDown = newRank !== user.rank;

        // 4. Transaction de mise à jour (rollback)
        await prisma.$transaction([
            prisma.userSkill.update({
                where: {
                    userId_skillId: { userId, skillId }
                },
                data: { stage: currentStage - 1 } // On recule d'une étape
            }),
            prisma.user.update({
                where: { id: userId },
                data: {
                    xp: newTotalXp,
                    level: newLevel,
                    rank: newRank
                }
            })
        ]);

        return NextResponse.json({
            success: true,
            leveledDown: hasLeveledDown,
            newLevel: newLevel,
            rankedDown: hasRankedDown,
            newRank: newRank
        });

    } catch (error) {
        console.error("Erreur lors de l'annulation :", error);
        return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
    }
}