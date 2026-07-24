import Link from "next/link"
import { Flame } from "lucide-react"

export default function Logo() {
    return (
        <Link href="/" className="flex items-center gap-3 transition-opacity hover:opacity-90 w-fit">
            <div className="bg-slate-900 p-2 rounded-lg flex items-center justify-center">
                <Flame className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold tracking-tight text-slate-900">
        Forge
      </span>
        </Link>
    )
}