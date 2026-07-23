"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Check, Loader2 } from "lucide-react"
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

// Import du type défini dans SkillList
import type { MovementData } from "./SkillList"

export default function MovementCard({ movement }: { movement: MovementData }) {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)

    // Si l'utilisateur a dépassé le stage 20, il a terminé le mouvement
    const isMaxLevel = movement.level > 20

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
                // Rafraîchit les données du Server Component (Dashboard)
                // La barre d'XP et les données de la carte vont se mettre à jour instantanément
                router.refresh()
            } else {
                console.error("Erreur lors de la validation")
            }
        } catch (err) {
            console.error(err)
        } finally {
            // On enlève l'état de chargement
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

            <CardFooter>
                <Button
                    className="w-full gap-2 transition-all"
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
                    {isLoading ? "Validation..." : isMaxLevel ? "Validé" : "Valider l'objectif"}
                </Button>
            </CardFooter>
        </Card>
    )
}