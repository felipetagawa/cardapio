"use client"

import Link from "next/link"
import { ClipboardList, PlusCircle, LogOut } from "lucide-react"
import { useRouter } from "next/navigation"
import { toast } from "react-toastify"
import AuthGuard from "../components/AuthGuard"

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const router = useRouter()

    const handleLogout = () => {
        localStorage.removeItem("admin_authenticated")
        toast.success("Logout realizado!")
        router.push("/login")
    }

    return (
        <AuthGuard>
            <div className="min-h-screen bg-gray-100 text-gray-900 pb-10">
                <nav className="bg-zinc-900 text-white p-4">
                    <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
                        <h1 className="text-xl font-bold">Japa ERP</h1>
                        <div className="flex flex-wrap justify-center gap-4 items-center">
                            <Link href="/admin" className="flex items-center gap-2 hover:text-green-400">
                                <ClipboardList size={20} /> <span>Pedidos</span>
                            </Link>
                            <Link href="/admin/pos" className="flex items-center gap-2 hover:text-green-400">
                                <PlusCircle size={20} /> <span>Novo</span>
                            </Link>
                            <Link href="/admin/extras" className="flex items-center gap-2 hover:text-green-400">
                                <PlusCircle size={20} /> <span>Acréscimos</span>
                            </Link>
                            <button
                                onClick={handleLogout}
                                className="flex items-center gap-2 hover:text-red-400 border-l border-gray-700 pl-4"
                            >
                                <LogOut size={20} /> <span>Sair</span>
                            </button>
                        </div>
                    </div>
                </nav>
                <div className="max-w-6xl mx-auto p-4 mt-4">
                    {children}
                </div>
            </div>
        </AuthGuard>
    )
}
