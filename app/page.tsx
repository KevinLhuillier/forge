import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import Link from "next/link"
import {
    Dumbbell,
    LayoutDashboard,
    Settings,
    LogOut,
    Check,
    Flame,
    Trophy
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

export default async function Dashboard() {
    // 1. Vérification de l'authentification
    const cookieStore = await cookies()
    const isAuth = cookieStore.get("forge_auth")

    if (!isAuth) {
        redirect("/login")
    }

    // 2. Fausse donnée (Mock) en attendant la liaison avec Prisma
    const user = {
        name: "Athlète",
        level: 4,
        xp: 2450,
        nextLevelXp: 3000,
    }

    // Calcul du pourcentage pour la barre de progression
    const xpPercentage = Math.round((user.xp / user.nextLevelXp) * 100)

    const pendingMovements = [
        { id: 1, name: "Thrusters", level: 1, objective: "29kg - 5 reps" },
        { id: 2, name: "Double Unders", level: 3, objective: "50 reps unbroken" },
        { id: 3, name: "Muscle-ups (Bar)", level: 2, objective: "3 reps" },
    ]

    return (
        <div className="flex min-h-screen w-full bg-slate-50">

            {/* ========================================== */}
            {/* BARRE DE NAVIGATION LATÉRALE (SIDEBAR)     */}
            {/* ========================================== */}
            <aside className="w-64 flex-col justify-between hidden md:flex border-r bg-white p-4">
                <div>
                    {/* Logo */}
                    <div className="flex items-center gap-3 px-2 mb-8">
                        <div className="bg-slate-900 p-2 rounded-lg">
                            <Flame className="w-6 h-6 text-white" />
                        </div>
                        <span className="text-xl font-bold tracking-tight">Forge</span>
                    </div>

                    {/* Liens */}
                    <nav className="space-y-2">
                        <Button variant="secondary" className="w-full justify-start gap-3">
                            <LayoutDashboard className="w-4 h-4" />
                            Tableau de bord
                        </Button>
                        <Button variant="ghost" className="w-full justify-start gap-3">
                            <Dumbbell className="w-4 h-4" />
                            Mouvements
                        </Button>
                        <Button variant="ghost" className="w-full justify-start gap-3">
                            <Settings className="w-4 h-4" />
                            Paramètres
                        </Button>
                    </nav>
                </div>

                {/* Bouton de déconnexion */}
                <div>
                    <form action="/api/auth/logout" method="POST">
                        <Button
                            type="submit"
                            variant="ghost"
                            className="w-full justify-start gap-3 text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                            <LogOut className="w-4 h-4" />
                            Se déconnecter
                        </Button>
                    </form>
                </div>
            </aside>

            {/* ========================================== */}
            {/* PARTIE CENTRALE (MAIN CONTENT)             */}
            {/* ========================================== */}
            <main className="flex-1 flex flex-col h-screen overflow-y-auto">

                {/* BANDEAU UTILISATEUR */}
                <header className="bg-white border-b px-8 py-6">
                    <div className="flex items-center justify-between max-w-5xl mx-auto">
                        <div className="flex items-center gap-4">
                            <Avatar className="h-16 w-16 border-2 border-slate-100">
                                <AvatarFallback className="bg-slate-900 text-white text-xl">
                                    {user.name.charAt(0)}
                                </AvatarFallback>
                            </Avatar>
                            <div>
                                <h1 className="text-2xl font-bold text-slate-900">
                                    Bonjour, {user.name}
                                </h1>
                                <p className="text-slate-500 flex items-center gap-2">
                                    <Trophy className="w-4 h-4 text-yellow-500" />
                                    Niveau {user.level}
                                </p>
                            </div>
                        </div>

                        {/* Barre d'XP */}
                        <div className="w-64 space-y-2">
                            <div className="flex justify-between text-sm font-medium text-slate-600">
                                <span>Expérience</span>
                                <span>{user.xp} / {user.nextLevelXp} XP</span>
                            </div>
                            <Progress value={xpPercentage} className="h-3" />
                        </div>
                    </div>
                </header>

                {/* CONTENU PRINCIPAL : LISTE DES CARTES */}
                <div className="p-8">
                    <div className="max-w-5xl mx-auto space-y-6">

                        <div className="flex items-center justify-between">
                            <h2 className="text-xl font-semibold text-slate-900">
                                Objectifs du jour
                            </h2>
                        </div>

                        {/* Grille des mouvements */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {pendingMovements.map((movement) => (
                                <Card key={movement.id} className="flex flex-col">
                                    <CardHeader className="pb-3">
                                        <div className="flex justify-between items-start">
                                            <CardTitle className="text-lg">{movement.name}</CardTitle>
                                            <Badge variant="secondary">Lvl {movement.level}</Badge>
                                        </div>
                                        <CardDescription>Objectif à valider</CardDescription>
                                    </CardHeader>
                                    <CardContent className="flex-1">
                                        <div className="bg-slate-50 rounded-md p-3 border text-center font-medium text-slate-700">
                                            {movement.objective}
                                        </div>
                                    </CardContent>
                                    <CardFooter>
                                        <Button className="w-full gap-2">
                                            <Check className="w-4 h-4" />
                                            Valider l&apos;objectif
                                        </Button>
                                    </CardFooter>
                                </Card>
                            ))}
                        </div>

                    </div>
                </div>
            </main>

        </div>
    )
}