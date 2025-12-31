"use client"
import { useState } from "react"
import { Category } from "@prisma/client"
import { Plus, Trash2, Save, X, Edit } from "lucide-react"
import { useRouter } from "next/navigation"

export default function CategoryManager({ categories }: { categories: Category[] }) {
    const router = useRouter()
    const [isCreating, setIsCreating] = useState(false)
    const [editingId, setEditingId] = useState<number | null>(null)
    const [newCategoryName, setNewCategoryName] = useState("")
    const [editName, setEditName] = useState("")
    const [isLoading, setIsLoading] = useState(false)

    const handleCreate = async () => {
        if (!newCategoryName.trim()) return
        setIsLoading(true)
        try {
            await fetch("/api/categories", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name: newCategoryName })
            })
            setNewCategoryName("")
            setIsCreating(false)
            router.refresh()
        } catch {
            alert("Erro ao criar categoria")
        } finally {
            setIsLoading(false)
        }
    }

    const handleDelete = async (id: number) => {
        if (!confirm("Excluir categoria? Produtos nela podem ficar sem categoria.")) return
        try {
            await fetch(`/api/categories/${id}`, { method: "DELETE" })
            router.refresh()
        } catch {
            alert("Erro ao excluir")
        }
    }

    const startEdit = (cat: Category) => {
        setEditingId(cat.id)
        setEditName(cat.name)
    }

    const handleUpdate = async () => {
        if (!editingId || !editName.trim()) return
        setIsLoading(true)
        try {
            await fetch(`/api/categories/${editingId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name: editName })
            })
            setEditingId(null)
            router.refresh()
        } catch {
            alert("Erro ao atualizar")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold mb-6">Gerenciar Categorias</h2>

            <div className="bg-white rounded shadow p-4 mb-6">
                <div className="flex gap-2">
                    <input
                        value={newCategoryName}
                        onChange={e => setNewCategoryName(e.target.value)}
                        placeholder="Nome da nova categoria..."
                        className="flex-1 border p-2 rounded"
                    />
                    <button
                        onClick={handleCreate}
                        disabled={isLoading || !newCategoryName.trim()}
                        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50"
                    >
                        <Plus size={20} />
                    </button>
                </div>
            </div>

            <div className="bg-white rounded shadow divide-y">
                {categories.map(cat => (
                    <div key={cat.id} className="p-4 flex justify-between items-center hover:bg-gray-50">
                        {editingId === cat.id ? (
                            <div className="flex gap-2 flex-1 mr-4">
                                <input
                                    value={editName}
                                    onChange={e => setEditName(e.target.value)}
                                    className="flex-1 border p-1 rounded"
                                    autoFocus
                                />
                                <button onClick={handleUpdate} disabled={isLoading} className="text-green-600"><Save size={20} /></button>
                                <button onClick={() => setEditingId(null)} className="text-gray-500"><X size={20} /></button>
                            </div>
                        ) : (
                            <span className="font-medium">{cat.name}</span>
                        )}

                        {editingId !== cat.id && (
                            <div className="flex gap-2">
                                <button onClick={() => startEdit(cat)} className="text-blue-600 p-1 hover:bg-blue-50 rounded">
                                    <Edit size={18} />
                                </button>
                                <button
                                    onClick={() => handleDelete(cat.id)}
                                    className="text-red-600 p-1 hover:bg-red-50 rounded"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    )
}
