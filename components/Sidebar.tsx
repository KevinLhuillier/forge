"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
    Dumbbell,
    LayoutDashboard,
    Settings,
    LogOut,
    Flame
} from "lucide-react"

import { Button, buttonVariants } from "@/components/ui/button"

export default function Sidebar() {
    // usePathname permet de savoir quelle est l'URL actuelle (ex: "/" ou "/settings")
    const pathname = usePathname()

    return (
        <aside className="w-64 flex-col justify-between hidden md:flex border-r bg-white p-4">
            <div>
                {/* Logo */}
                <div className="flex items-center gap-3 px-2 mb-8">
                    <div className="bg-slate-900 p-2 rounded-lg">
                        <Flame className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-xl font-bold tracking-tight">Forge</span>
                </div>

                {/* Navigation */}
                <nav className="space-y-2">

                    <Link
                        href="/"
                        className={buttonVariants({
                            // Si on est sur "/", le bouton est en style "secondary" (actif), sinon "ghost"
                            variant: pathname === "/" ? "secondary" : "ghost",
                            className: "w-full justify-start gap-3"
                        })}
                    >
                        <LayoutDashboard className="w-4 h-4" />
                        Tableau de bord
                    </Link>

                    {/* Ce bouton ne pointe nulle part pour l'instant */}
                    <Button variant="ghost" className="w-full justify-start gap-3">
                        <Dumbbell className="w-4 h-4" />
                        Mouvements
                    </Button>

                    <Link
                        href="/settings"
                        className={buttonVariants({
                            variant: pathname === "/settings" ? "secondary" : "ghost",
                            className: "w-full justify-start gap-3"
                        })}
                    >
                        <Settings className="w-4 h-4" />
                        Paramètres
                    </Link>

                </nav>
            </div>

            {/* Déconnexion */}
            <div>
                <form action="/api/auth/logout" method="POST">
                    <Button type="submit" variant="ghost" className="w-full justify-start gap-3 text-red-600 hover:text-red-700 hover:bg-red-50">
                        <LogOut className="w-4 h-4" />
                        Se déconnecter
                    </Button>
                </form>
            </div>
        </aside>
    )
}