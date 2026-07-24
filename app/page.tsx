import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import {
    Dumbbell,
    LayoutDashboard,
    Settings,
    LogOut,
    Check,
    Flame,
    Trophy
} from "lucide-react"

import { Button, buttonVariants } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

import { prisma } from "@/prisma/client"
import MovementCard from "@/components/MovementCard";
import SkillList from "@/components/SkillList"
import Link from "next/link";

export default async function Dashboard() {
    // 1. Vérification de l'authentification
    const cookieStore = await cookies()
    const authCookie = cookieStore.get("forge_auth")

    if (!authCookie) {
        redirect("/login")
    }

    // L'ID dans le cookie est une string, on le transforme en nombre entier
    const userId = authCookie.value;



    // Récupération de l'utilisateur ET de tous ses mouvements en une seule requête
    const user = await prisma.user.findUnique({
        where: { id: userId },
        include: {
            skills: {
                include: {
                    skill: {
                        include: {
                            stages: true // On inclut les paliers pour trouver le texte de l'objectif
                        }
                    }
                }
            }
        }
    })

    // Si l'utilisateur n'est pas trouvé en base (compte supprimé ou erreur)
    if (!user) {
        redirect("/login")
    }

    //  On récupère le palier d'XP du niveau actuel de l'utilisateur
    // (S'il est niveau 1, son palier de base est 0)
    const currentLevelData = user.level === 1
        ? { xp: 0 }
        : await prisma.xpLevel.findUnique({ where: { level: user.level } })

    //  On récupère l'objectif d'XP (le niveau suivant)
    const nextLevelData = await prisma.xpLevel.findUnique({
        where: { level: user.level + 1 },
    })

    //  Calcul des valeurs de base
    const baseLevelXp = currentLevelData ? currentLevelData.xp : 0
    const nextLevelXp = nextLevelData ? nextLevelData.xp : user.xp

    //  Calcul de l'XP "relatif" (progression uniquement dans le niveau en cours)
    const xpGainedInCurrentLevel = user.xp - baseLevelXp
    const xpNeededForNextLevel = nextLevelXp - baseLevelXp

    // Calcul du pourcentage (limité entre 0 et 100%)
    const rawPercentage = nextLevelData
        ? Math.round((xpGainedInCurrentLevel / xpNeededForNextLevel) * 100)
        : 100
    const xpPercentage = Math.max(0, Math.min(rawPercentage, 100))

    // Le nom à afficher (on utilise une valeur par défaut au cas où il n'y ait pas de nom)
    const displayName = user.name || "Athlète"

    // Formatage des données pour le composant client
    const movements = user.skills.map((userSkill) => {
        // On cherche l'étape exacte qui correspond au niveau actuel du joueur
        const currentStageInfo = userSkill.skill.stages.find(
            (s) => s.stage === userSkill.stage
        )

        return {
            id: userSkill.skillId,
            name: userSkill.skill.name,
            type: userSkill.skill.type, // Weightlifting, Gym ou Cardio
            level: userSkill.stage,
            // Si l'étape existe on affiche le label, sinon c'est qu'il a tout fini !
            objective: currentStageInfo ? currentStageInfo.stageLabel : "Niveau Maximum atteint 🎉",
        }
    })

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
                        {/* Lien vers le Tableau de bord */}
                        <Link
                            href="/"
                            className={buttonVariants({ variant: "secondary", className: "w-full justify-start gap-3" })}
                        >
                            <LayoutDashboard className="w-4 h-4" />
                            Tableau de bord
                        </Link>
                        {/* Bouton Mouvements (sans lien pour l'instant) */}
                        <Button variant="ghost" className="w-full justify-start gap-3">
                            <Dumbbell className="w-4 h-4" />
                            Mouvements
                        </Button>
                        {/* Lien vers les Paramètres */}
                        <Link
                            href="/settings"
                            className={buttonVariants({ variant: "ghost", className: "w-full justify-start gap-3" })}
                        >
                            <Settings className="w-4 h-4" />
                            Paramètres
                        </Link>
                    </nav>
                </div>

                {/* Bouton de déconnexion */}
                <div>
                    <form action="/api/auth/logout" method="POST">
                        <Button type="submit" variant="ghost" className="w-full justify-start gap-3 text-red-600 hover:text-red-700 hover:bg-red-50">
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
                                    {displayName.charAt(0).toUpperCase()}
                                </AvatarFallback>
                            </Avatar>
                            <div>
                                <h1 className="text-2xl font-bold text-slate-900">
                                    Bonjour, {displayName}
                                </h1>
                                <p className="text-slate-500 flex items-center gap-2">
                                    <Trophy className="w-4 h-4 text-yellow-500" />
                                    Niveau {user.level} • {user.rank}
                                </p>
                            </div>
                        </div>

                        {/* Barre d'XP */}
                        <div className="w-64 space-y-2">
                            <div className="flex justify-between text-sm font-medium text-slate-600">
                                <span>Progression Niv. {user.level}</span>
                                {/* On affiche l'XP relatif au lieu de l'XP total */}
                                <span>{xpGainedInCurrentLevel} / {xpNeededForNextLevel} XP</span>
                            </div>
                            <Progress value={xpPercentage} className="h-3" />
                        </div>
                    </div>
                </header>

                {/* CONTENU PRINCIPAL : LISTE DES CARTES */}
                <div className="p-8">
                    <div className="max-w-5xl mx-auto space-y-6">
                        {/* LISTE DES COMPÉTENCES */}
                        <div className="p-8">
                            <div className="max-w-5xl mx-auto space-y-6">

                                <h2 className="text-xl font-semibold text-slate-900">
                                    Objectifs du jour
                                </h2>

                                {/* On délègue l'affichage et les filtres à notre composant Client */}
                                <SkillList movements={movements} />

                            </div>
                        </div>
                    </div>
                </div>
            </main>

        </div>
    )
}