import {NextRequest, NextResponse} from "next/server";
import { z } from "zod";
import {prisma} from "@/prisma/client";
import bcrypt from "bcrypt";

const schema = z.object({
    name: z.string().min(2, { message: "Le nom doit contenir au moins 2 caractères" }),
    email: z.string().email(),
    password: z.string().min(4),
});

export async function POST(request: NextRequest) {
    const body = await request.json();

    const validation = schema.safeParse(body);

    if (!validation.success) {
        return NextResponse.json(validation.error.issues, { status: 400 });
    }

    const user = await prisma.user.findUnique({
        where: {
            email: body.email,
        }
    });

    if (user) {
        return NextResponse.json({ error: "User already exists" }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(body.password, 10);

    // 1. On récupère TOUS les mouvements (skills) disponibles dans la base
    const allSkills = await prisma.skill.findMany({
        select: { id: true } // On ne prend que l'ID pour optimiser la requête
    });

    // 2. On prépare le tableau de liaison (le stage de départ est 1)
    const userSkillsData = allSkills.map((skill) => ({
        skillId: skill.id,
        stage: 1,
    }));

    const newUser = await prisma.user.create({
        data: {
            name: body.name,
            email: body.email,
            hashedPassword,
            skills: {
                create: userSkillsData
            }
        }
    });

    return NextResponse.json({ email: newUser.email}, { status: 201 });


}