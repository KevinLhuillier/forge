"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
    Dumbbell,
    LayoutDashboard,
    Settings,
    LogOut,
    Flame,
    Menu
} from "lucide-react"

import { Button, buttonVariants } from "@/components/ui/button"
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import Logo from "@/components/Logo";

// 1. CORRECTION : On sort NavContent du composant principal
// On lui passe pathname et une fonction optionnelle pour fermer le menu
function NavContent({
                        pathname,
                        closeMenu
                    }: {
    pathname: string;
    closeMenu?: () => void
}) {
    return (
        <div className="flex flex-col h-full justify-between">
            <div className="space-y-6">

                <div className="mb-8">
                    <Logo />
                </div>

                <nav className="space-y-2">
                    <Link
                        href="/"
                        onClick={closeMenu}
                        className={buttonVariants({
                            variant: pathname === "/" ? "secondary" : "ghost",
                            className: "w-full justify-start gap-3"
                        })}
                    >
                        <LayoutDashboard className="w-4 h-4" />
                        Tableau de bord
                    </Link>

                    <Button variant="ghost" className="w-full justify-start gap-3">
                        <Dumbbell className="w-4 h-4" />
                        Mouvements
                    </Button>

                    <Link
                        href="/settings"
                        onClick={closeMenu}
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

            <div className="pb-4 md:pb-0 mt-8">
                <form action="/api/auth/logout" method="POST">
                    <Button type="submit" variant="ghost" className="w-full justify-start gap-3 text-red-600 hover:text-red-700 hover:bg-red-50">
                        <LogOut className="w-4 h-4" />
                        Se déconnecter
                    </Button>
                </form>
            </div>
        </div>
    )
}

export default function Sidebar() {
    const pathname = usePathname()
    const [isOpen, setIsOpen] = useState(false)

    return (
        <>
            {/* VERSION PC : Barre latérale classique */}
            <aside className="w-64 flex-col hidden md:flex border-r bg-white p-4 shrink-0">
                <NavContent pathname={pathname} />
            </aside>

            {/* VERSION MOBILE : Barre supérieure avec Hamburger */}
            <div className="flex md:hidden items-center justify-between p-4 bg-white border-b shrink-0">
                <div className="flex items-center gap-3">
                    <div className="bg-slate-900 p-1.5 rounded-lg">
                        <Flame className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-lg font-bold tracking-tight">Forge</span>
                </div>

                <Sheet open={isOpen} onOpenChange={setIsOpen}>

                    {/* 2. CORRECTION : On utilise buttonVariants et on retire asChild */}
                    <SheetTrigger
                        className={buttonVariants({ variant: "ghost", size: "icon" })}
                    >
                        <Menu className="w-6 h-6" />
                    </SheetTrigger>

                    <SheetContent side="left" className="w-64 p-4 pt-12">
                        <SheetHeader className="sr-only">
                            <SheetTitle>Menu de navigation</SheetTitle>
                        </SheetHeader>
                        <NavContent pathname={pathname} closeMenu={() => setIsOpen(false)} />
                    </SheetContent>
                </Sheet>
            </div>
        </>
    )
}