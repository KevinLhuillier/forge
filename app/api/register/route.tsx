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

    const newUser = await prisma.user.create({
        data: {
            name: body.name,
            email: body.email,
            hashedPassword,
        }
    });

    return NextResponse.json({ email: newUser.email}, { status: 201 });


}