import { cookies } from "next/headers"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
    // 1. On attend l'accès aux cookies (requis depuis Next.js 15)
    const cookieStore = await cookies()

    // 2. On supprime le cookie de session
    cookieStore.delete("forge_auth")

    // 3. On ordonne au navigateur de rediriger l'utilisateur vers le login
    return NextResponse.redirect(new URL("/login", request.url), {
        status: 302, // Code HTTP standard pour une redirection
    })
}