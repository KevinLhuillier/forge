import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import Link from "next/link"
import {
    Dumbbell,
    LayoutDashboard,
    Settings,
    LogOut,
    Flame
} from "lucide-react"

import { Button, buttonVariants } from "@/components/ui/button"
import ResetProfileButton from "@/components/ResetProfileButton"

export default async function SettingsPage() {
    const cookieStore = await cookies()
    const authCookie = cookieStore.get("forge_auth")

    if (!authCookie) {
        redirect("/login")
    }

    return (
        <div className="flex min-h-screen w-full bg-slate-50">

            {/* SIDEBAR */}
            <aside className="w-64 flex-col justify-between hidden md:flex border-r bg-white p-4">
                <div>
                    <div className="flex items-center gap-3 px-2 mb-8">
                        <div className="bg-slate-900 p-2 rounded-lg">
                            <Flame className="w-6 h-6 text-white" />
                        </div>
                        <span className="text-xl font-bold tracking-tight">Forge</span>
                    </div>

                    <nav className="space-y-2">
                        {/* Lien vers le Tableau de bord */}
                        <Link
                            href="/"
                            className={buttonVariants({ variant: "ghost", className: "w-full justify-start gap-3" })}
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
                            className={buttonVariants({ variant: "secondary", className: "w-full justify-start gap-3" })}
                        >
                            <Settings className="w-4 h-4" />
                            Paramètres
                        </Link>
                    </nav>
                </div>

                <div>
                    <form action="/api/auth/logout" method="POST">
                        <Button type="submit" variant="ghost" className="w-full justify-start gap-3 text-red-600 hover:text-red-700 hover:bg-red-50">
                            <LogOut className="w-4 h-4" />
                            Se déconnecter
                        </Button>
                    </form>
                </div>
            </aside>

            {/* MAIN CONTENT */}
            <main className="flex-1 flex flex-col h-screen overflow-y-auto p-8">
                <div className="max-w-3xl mx-auto w-full space-y-8">

                    <div>
                        <h1 className="text-3xl font-bold text-slate-900">Paramètres</h1>
                        <p className="text-slate-500 mt-2">Gérez les préférences de votre compte.</p>
                    </div>

                    {/* ZONE DE DANGER */}
                    <div className="border border-red-200 bg-red-50 rounded-xl p-6 space-y-4 mt-8">
                        <div>
                            <h3 className="text-lg font-semibold text-red-900">Zone de danger</h3>
                            <p className="text-sm text-red-700 mt-1">
                                Les actions ci-dessous sont définitives. Assurez-vous de savoir ce que vous faites.
                            </p>
                        </div>

                        <div className="pt-2">
                            <ResetProfileButton />
                        </div>
                    </div>

                </div>
            </main>

        </div>
    )
}