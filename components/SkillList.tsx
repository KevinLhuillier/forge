"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import MovementCard from "./MovementCard"

// On définit le type exact d'un mouvement tel qu'il sortira de notre base
export type MovementData = {
    id: number
    name: string
    type: string
    level: number
    objective: string
}

export default function SkillList({ movements }: { movements: MovementData[] }) {
    // Par défaut, on affiche tout. Les catégories sont : Weightlifting, Gym, Cardio
    const [activeFilter, setActiveFilter] = useState<string>("All")

    // On filtre la liste en fonction du bouton cliqué
    const filteredMovements = activeFilter === "All"
        ? movements
        : movements.filter((m) => m.type === activeFilter)

    return (
        <div className="space-y-6">

            {/* Boutons de filtres */}
            <div className="flex flex-wrap gap-3">
                <Button
                    variant={activeFilter === "All" ? "default" : "outline"}
                    onClick={() => setActiveFilter("All")}
                >
                    Tous
                </Button>
                <Button
                    variant={activeFilter === "Weightlifting" ? "default" : "outline"}
                    onClick={() => setActiveFilter("Weightlifting")}
                >
                    Weightlifting
                </Button>
                <Button
                    variant={activeFilter === "Gym" ? "default" : "outline"}
                    onClick={() => setActiveFilter("Gym")}
                >
                    Gym
                </Button>
                <Button
                    variant={activeFilter === "Cardio" ? "default" : "outline"}
                    onClick={() => setActiveFilter("Cardio")}
                >
                    Cardio
                </Button>
            </div>

            {/* Grille des cartes */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredMovements.map((movement) => (
                    <MovementCard key={movement.id} movement={movement} />
                ))}
            </div>

            {/* Message si aucun mouvement (cas rare) */}
            {filteredMovements.length === 0 && (
                <p className="text-slate-500 text-center py-8">
                    Aucun mouvement trouvé pour cette catégorie.
                </p>
            )}
        </div>
    )
}