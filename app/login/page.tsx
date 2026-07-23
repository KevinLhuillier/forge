"use client"

import { useState } from "react"
import { useRouter } from "next/navigation" // Pour la redirection
import { Button } from "@/components/ui/button"
import {
    Card,
    CardAction, // Si tu as bien ce composant personnalisé
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link";

export default function LoginPage() {
    const router = useRouter()

    // États pour les données du formulaire
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    // États pour le retour visuel (erreur et chargement)
    const [error, setError] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError(null) // On réinitialise l'erreur à chaque tentative
        setIsLoading(true)

        try {
            // Appel à l'API
            const res = await fetch("/api/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, password }),
            })

            const data = await res.json()

            if (!res.ok) {
                // Gestion des erreurs (code 400, 401, 500...)
                setError(data.error || "Une erreur est survenue lors de la connexion.")
            } else {
                // Succès : Redirection vers la page principale
                router.push("/")
                router.refresh() // Force Next.js à re-vérifier les cookies sur la page d'accueil
            }
        } catch (err) {
            setError("Impossible de contacter le serveur.")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <main className="flex min-h-screen items-center justify-center p-4 bg-slate-50">
            <Card className="w-full max-w-sm">
                <CardHeader>
                    <CardTitle>Login to your account</CardTitle>
                    <CardDescription>
                        Enter your email below to login to your account
                    </CardDescription>
                    <CardAction>
                        <Link href="/register" passHref>
                            <Button variant="link" type="button">Sign Up</Button>
                        </Link>
                    </CardAction>
                </CardHeader>

                <form onSubmit={handleSubmit}>
                    <CardContent>
                        <div className="flex flex-col gap-6">

                            {/* Bloc d'affichage de l'erreur */}
                            {error && (
                                <div className="p-3 text-sm font-medium text-red-600 bg-red-50 border border-red-200 rounded-md">
                                    {error}
                                </div>
                            )}

                            <div className="grid gap-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="m@example.com"
                                    value={email} // Liaison à l'état
                                    onChange={(e) => setEmail(e.target.value)} // Mise à jour de l'état
                                    required
                                    disabled={isLoading}
                                />
                            </div>
                            <div className="grid gap-2">
                                <div className="flex items-center">
                                    <Label htmlFor="password">Password</Label>
                                    <a
                                        href="#"
                                        className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                                    >
                                        Forgot your password?
                                    </a>
                                </div>
                                <Input
                                    id="password"
                                    type="password"
                                    value={password} // Liaison à l'état
                                    onChange={(e) => setPassword(e.target.value)} // Mise à jour de l'état
                                    required
                                    disabled={isLoading}
                                />
                            </div>
                        </div>
                    </CardContent>
                </form>
                <CardFooter className="flex-col gap-2">
                    {/* Le bouton déclenchera le form grâce à l'attribut form ou au fait d'être englobé */}
                    <Button
                        type="submit"
                        className="w-full"
                        disabled={isLoading}
                        onClick={handleSubmit} // Ajouté par sécurité si le bouton reste hors de la balise HTML <form> selon le rendu de CardFooter
                    >
                        {isLoading ? "Loading..." : "Login"}
                    </Button>
                </CardFooter>
            </Card>
</main>
)
}