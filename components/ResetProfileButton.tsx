"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Loader2, TriangleAlert } from "lucide-react"
import { toast } from "sonner"
import { Button, buttonVariants } from "@/components/ui/button"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

export default function ResetProfileButton() {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)

    const handleReset = async () => {
        setIsLoading(true)

        try {
            const res = await fetch("/api/user/reset", {
                method: "POST",
            })

            if (res.ok) {
                toast.success("Profil réinitialisé avec succès.")
                // On redirige vers la page d'accueil pour voir la barre vide
                router.push("/")
                router.refresh()
            } else {
                toast.error("Erreur lors de la réinitialisation.")
                setIsLoading(false)
            }
        } catch (error) {
            toast.error("Erreur de connexion au serveur.")
            setIsLoading(false)
        }
    }

    return (
        <AlertDialog>
            <AlertDialogTrigger
                className={buttonVariants({ variant: "destructive", className: "gap-2" })}
            >
                <TriangleAlert className="w-4 h-4" />
                Réinitialiser ma progression
            </AlertDialogTrigger>

            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Êtes-vous absolument sûr ?</AlertDialogTitle>
                    <AlertDialogDescription>
                        Cette action est irréversible. Elle remettra à zéro toute votre expérience (XP),
                        votre niveau global, et ramènera la totalité de vos mouvements au niveau 1.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel disabled={isLoading}>Annuler</AlertDialogCancel>
                    <AlertDialogAction
                        onClick={(e) => {
                            e.preventDefault() // Empêche la fermeture immédiate si on charge
                            handleReset()
                        }}
                        disabled={isLoading}
                        className="bg-red-600 hover:bg-red-700 text-white"
                    >
                        {isLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                        Oui, tout effacer
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}