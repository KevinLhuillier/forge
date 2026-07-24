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

        // Transaction : on reset tout d'un coup
        await prisma.$transaction([
            // 1. Tous les mouvements redescendent au stage 1
            prisma.userSkill.updateMany({
                where: { userId: userId },
                data: { stage: 1 }
            }),
            // 2. L'utilisateur retombe à 0 XP, Lvl 1, Scaled
            prisma.user.update({
                where: { id: userId },
                data: {
                    xp: 0,
                    level: 1,
                    rank: "Scaled"
                }
            })
        ]);

        return NextResponse.json({ success: true });

    } catch (error) {
        console.error("Erreur lors de la réinitialisation :", error);
        return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
    }
}