"use client"

import { useState, useEffect } from "react"
import { ExtraForm } from "./ExtraForm"
import { Extra, Category } from "@prisma/client"
import { Trash, Edit } from "lucide-react"
import { toast } from "react-toastify"

type ExtraWithCategory = Extra & { category: Category | null }

export default function ExtrasPage() {
    const [extras, setExtras] = useState<ExtraWithCategory[]>([])
    const [isFormOpen, setIsFormOpen] = useState(false)
    const [editingExtra, setEditingExtra] = useState<Extra | undefined>(undefined)

    const fetchExtras = async () => {
        try {
            const res = await fetch("/api/extras")
            const data = await res.json()
            if (Array.isArray(data)) setExtras(data)
        } catch (e) {
            console.error("Failed to fetch extras")
        }
    }

    useEffect(() => {
        fetchExtras()
    }, [])

    const handleCreate = () => {
        setEditingExtra(undefined)
        setIsFormOpen(true)
    }

    const handleEdit = (extra: Extra) => {
        setEditingExtra(extra)
        setIsFormOpen(true)
    }

    const handleDelete = async (id: number) => {
        if (!confirm("Tem certeza que deseja excluir?")) return

        try {
            const res = await fetch(`/api/extras/${id}`, { method: "DELETE" })
            if (!res.ok) throw new Error("Erro ao excluir")
            toast.success("Excluído com sucesso")
            fetchExtras()
        } catch (e) {
            toast.error("Erro ao excluir")
        }
    }

    const handleFormSuccess = () => {
        setIsFormOpen(false)
        fetchExtras()
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Gerenciar Acréscimos</h2>
                <button
                    onClick={handleCreate}
                    className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                >
                    Novo Acréscimo
                </button>
            </div>

            {isFormOpen ? (
                <ExtraForm
                    initialData={editingExtra}
                    onSuccess={handleFormSuccess}
                    onCancel={() => setIsFormOpen(false)}
                />
            ) : (
                <div className="bg-white rounded shadow overflow-hidden">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 border-b">
                            <tr>
                                <th className="p-4 font-bold">Nome</th>
                                <th className="p-4 font-bold">Preço</th>
                                <th className="p-4 font-bold">Categoria</th>
                                <th className="p-4 font-bold text-right">Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {extras.map(extra => (
                                <tr key={extra.id} className="border-b last:border-0 hover:bg-gray-50">
                                    <td className="p-4">{extra.name}</td>
                                    <td className="p-4">R$ {extra.price.toFixed(2)}</td>
                                    <td className="p-4">
                                        <span className="bg-gray-200 px-2 py-1 rounded text-sm">
                                            {extra.category?.name || "Sem Categoria"}
                                        </span>
                                    </td>
                                    <td className="p-4 flex gap-2 justify-end">
                                        <button
                                            onClick={() => handleEdit(extra)}
                                            className="text-blue-600 hover:text-blue-800 p-1"
                                        >
                                            <Edit size={18} />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(extra.id)}
                                            className="text-red-600 hover:text-red-800 p-1"
                                        >
                                            <Trash size={18} />
                                        </button>
                                    </td>
                                </tr>
                            ))}

                            {extras.length === 0 && (
                                <tr>
                                    <td colSpan={4} className="p-8 text-center text-gray-500">
                                        Nenhum acréscimo cadastrado.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    )
}
