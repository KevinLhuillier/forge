"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Check, Loader2, Undo2 } from "lucide-react" // <-- Ajout de Undo2
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"

import type { MovementData } from "./SkillList"

export default function MovementCard({ movement }: { movement: MovementData }) {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)

    const isMaxLevel = movement.level > 20
    const isMinLevel = movement.level <= 1 // On détecte si on est au tout premier niveau

    // --- FONCTION POUR MONTER DE NIVEAU ---
    const handleValidate = async () => {
        if (isMaxLevel) return
        setIsLoading(true)

        try {
            const res = await fetch("/api/skills/validate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ skillId: movement.id }),
            })

            if (res.ok) {
                const data = await res.json()

                if (data.leveledUp) {
                    let toastMessage = `🎉 LEVEL UP ! Tu as atteint le niveau ${data.newLevel} !`
                    if (data.rankedUp) {
                        toastMessage = `🔥 PROMOTION ! Niveau ${data.newLevel} atteint. Tu deviens un athlète ${data.newRank} !`
                    }
                    toast.success(toastMessage, {
                        style: {
                            background: data.rankedUp ? '#f59e0b' : '#000000',
                            color: 'white', border: 'none'
                        },
                        duration: data.rankedUp ? 8000 : 5000
                    })
                }
                router.refresh()
            } else {
                toast.error("Erreur lors de la validation")
            }
        } catch (err) {
            toast.error("Erreur de connexion au serveur")
        } finally {
            setIsLoading(false)
        }
    }

    // --- FONCTION POUR DESCENDRE DE NIVEAU ---
    const handleDowngrade = async () => {
        if (isMinLevel) return
        setIsLoading(true)

        try {
            const res = await fetch("/api/skills/downgrade", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ skillId: movement.id }),
            })

            if (res.ok) {
                const data = await res.json()

                // Notifications de perte de niveau/rang
                if (data.rankedDown) {
                    toast.error(`Rétrogradation... Tu repasses au rang ${data.newRank}.`, {
                        duration: 5000
                    })
                } else if (data.leveledDown) {
                    toast(`Tu es redescendu au niveau ${data.newLevel}.`, {
                        style: { background: '#ef4444', color: 'white', border: 'none' }, // Rouge
                        duration: 4000
                    })
                }

                router.refresh()
            } else {
                toast.error("Erreur lors de l'annulation")
            }
        } catch (err) {
            toast.error("Erreur de connexion au serveur")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Card className={`flex flex-col transition-all ${isMaxLevel ? 'border-green-200 shadow-sm' : ''}`}>
            <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">{movement.name}</CardTitle>
                    <Badge variant={isMaxLevel ? "default" : "secondary"} className={isMaxLevel ? "bg-green-600 hover:bg-green-700" : ""}>
                        {isMaxLevel ? "MAX" : `Lvl ${movement.level}`}
                    </Badge>
                </div>
                <CardDescription>
                    {isMaxLevel ? "Compétence maîtrisée" : "Objectif à valider"}
                </CardDescription>
            </CardHeader>

            <CardContent className="flex-1">
                <div className={`rounded-md p-3 border text-center font-medium ${
                    isMaxLevel
                        ? 'bg-green-50 text-green-700 border-green-100'
                        : 'bg-slate-50 text-slate-700'
                }`}>
                    {movement.objective}
                </div>
            </CardContent>

            {/* On utilise un flex gap-2 pour aligner les deux boutons */}
            <CardFooter className="flex gap-2">
                {/* Bouton d'annulation (Rétrograder) */}
                <Button
                    variant="outline"
                    size="icon"
                    onClick={handleDowngrade}
                    disabled={isLoading || isMinLevel}
                    title="Annuler le dernier niveau"
                >
                    <Undo2 className="w-4 h-4 text-slate-600" />
                </Button>

                {/* Bouton de validation (Avancer) */}
                <Button
                    className="flex-1 gap-2 transition-all"
                    onClick={handleValidate}
                    disabled={isLoading || isMaxLevel}
                    variant={isMaxLevel ? "outline" : "default"}
                >
                    {isLoading ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                    ) : isMaxLevel ? (
                        <Check className="w-4 h-4 text-green-600" />
                    ) : (
                        <Check className="w-4 h-4" />
                    )}
                    {isLoading ? "Chargement..." : isMaxLevel ? "Validé" : "Valider l'objectif"}
                </Button>
            </CardFooter>
        </Card>
    )
}