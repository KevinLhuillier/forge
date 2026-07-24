"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Logo from "@/components/Logo";

export default function RegisterPage() {
    const router = useRouter()

    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    const [error, setError] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError(null)
        setIsLoading(true)

        try {
            const res = await fetch("/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, email, password }),
            })

            const data = await res.json()

            if (!res.ok) {
                // Si l'erreur vient de { error: "User already exists" }
                if (data.error) {
                    setError(data.error)
                }
                // Si l'erreur vient de Zod (validation.error.issues est un tableau)
                else if (Array.isArray(data)) {
                    // On combine tous les messages d'erreur de Zod
                    setError(data.map((issue) => issue.message).join(" | "))
                } else {
                    setError("Une erreur est survenue lors de l'inscription.")
                }
            } else {
                // Inscription réussie ! On redirige vers la page de login
                router.push("/login")
            }
        } catch (err) {
            setError("Impossible de contacter le serveur.")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <main className="flex min-h-screen flex-col items-center justify-center bg-slate-50 p-4">

            <div className="mb-8">
                <Logo />
            </div>

            <Card className="w-full max-w-sm">
                <CardHeader>
                    <CardTitle>Créer un compte</CardTitle>
                    <CardDescription>
                        Entrez vos informations pour rejoindre Forge
                    </CardDescription>
                </CardHeader>

                <form onSubmit={handleSubmit}>
                    <CardContent>
                        <div className="flex flex-col gap-6">

                            {error && (
                                <div className="p-3 text-sm font-medium text-red-600 bg-red-50 border border-red-200 rounded-md">
                                    {error}
                                </div>
                            )}
                            <div className="grid gap-2">
                                <Label htmlFor="name">Nom</Label>
                                <Input
                                    id="name"
                                    type="text"
                                    placeholder="Rich Froning"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                    disabled={isLoading}
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="athlete@forge.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    disabled={isLoading}
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="password">Mot de passe</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    placeholder="Minimum 4 caractères"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    disabled={isLoading}
                                />
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter className="flex-col gap-4 mt-2">
                        <Button type="submit" className="w-full" disabled={isLoading}>
                            {isLoading ? "Création en cours..." : "S'inscrire"}
                        </Button>

                        <div className="text-sm text-center text-slate-500">
                            Déjà un compte ?{" "}
                            <Link href="/login" className="underline hover:text-slate-900">
                                Connectez-vous
                            </Link>
                        </div>
                    </CardFooter>
                </form>
            </Card>
        </main>
    )
}