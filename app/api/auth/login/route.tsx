import {NextRequest, NextResponse} from "next/server"
import {prisma} from "@/prisma/client";
import bcrypt from "bcrypt";
import { cookies } from "next/headers"

export async function POST(request: NextRequest) {
    try {
        // 1. Récupération du JSON envoyé par le client
        const body = await request.json()
        const { email, password } = body

        if (!email || !password) {
            return NextResponse.json(
                { error: "Veuillez remplir tous les champs." },
                { status: 400 }
            )
        }

        // 2. Chercher l'utilisateur dans la base MySQL
        const user = await prisma.user.findUnique({
            where: { email },
        })

        if (!user) {
            return NextResponse.json(
                { error: "Identifiants incorrects." },
                { status: 401 }
            )
        }

        // 3. Vérifier le mot de passe
        const isPasswordValid = await bcrypt.compare(password, user.hashedPassword!)

        if (!isPasswordValid) {
            return NextResponse.json(
                { error: "Identifiants incorrects." },
                { status: 401 }
            )
        }

        // 4. Créer le cookie de session (valable 7 jours)
        const cookieStore = await cookies();
        cookieStore.set("forge_auth", user.id, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 60 * 60 * 24 * 7,
            path: "/",
        })

        // 5. Renvoyer un succès
        return NextResponse.json({ success: true }, { status: 200 })

    } catch (error) {
        console.error("Erreur de connexion:", error)
        return NextResponse.json(
            { error: "Une erreur serveur est survenue." },
            { status: 500 }
        )
    }
}