"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "react-toastify"

export default function LoginPage() {
    const [password, setPassword] = useState("")
    const router = useRouter()

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault()

        // Senha padrão (você pode trocar depois ou usar variável de ambiente)
        const correctPassword = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || "admin123"

        if (password === correctPassword) {
            localStorage.setItem("admin_authenticated", "true")
            toast.success("Login realizado!")
            router.push("/admin")
        } else {
            toast.error("Senha incorreta!")
            setPassword("")
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">Japa Pastel</h1>
                    <p className="text-gray-600">Área Administrativa</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-6">
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                            Senha de Acesso
                        </label>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full border border-gray-300 rounded-lg p-3 text-gray-900 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                            placeholder="Digite a senha"
                            autoFocus
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-green-600 text-white font-bold py-3 rounded-lg hover:bg-green-700 transition-colors"
                    >
                        Entrar
                    </button>
                </form>

                <div className="mt-6 text-center">
                    <a href="/" className="text-sm text-gray-500 hover:text-gray-700">
                        ← Voltar para o cardápio
                    </a>
                </div>
            </div>
        </div>
    )
}
