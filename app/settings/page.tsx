import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import ResetProfileButton from "@/components/ResetProfileButton"
import Sidebar from "@/components/Sidebar";

export default async function SettingsPage() {
    const cookieStore = await cookies()
    const authCookie = cookieStore.get("forge_auth")

    if (!authCookie) {
        redirect("/login")
    }

    return (
        // On passe en flex-col sur mobile
        <div className="flex flex-col md:flex-row min-h-screen w-full bg-slate-50">

            <Sidebar />

            {/* On ajuste le padding (p-4 sur mobile, p-8 sur PC) */}
            <main className="flex-1 flex flex-col h-screen overflow-y-auto p-4 md:p-8">
                <div className="max-w-3xl mx-auto w-full space-y-8">

                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold text-slate-900">Paramètres</h1>
                        <p className="text-slate-500 mt-2">Gérez les préférences de votre compte.</p>
                    </div>

                    <div className="border border-red-200 bg-red-50 rounded-xl p-4 md:p-6 space-y-4 mt-8">
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