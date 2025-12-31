"use client"

import { useState, useEffect } from "react"
import { toast } from "react-toastify"
import { Extra, Category } from "@prisma/client"

interface ExtraFormProps {
    initialData?: Extra
    onSuccess: () => void
    onCancel: () => void
}

export function ExtraForm({ initialData, onSuccess, onCancel }: ExtraFormProps) {
    const [name, setName] = useState(initialData?.name || "")
    const [price, setPrice] = useState(initialData?.price.toString() || "")
    const [description, setDescription] = useState(initialData?.description || "")
    const [categoryId, setCategoryId] = useState(initialData?.categoryId.toString() || "")
    const [categories, setCategories] = useState<Category[]>([])

    useEffect(() => {
        // Fetch categories for selection
        fetch("/api/categories") // We might need a GET /api/categories endpoint. 
            // Wait, current categories route is POST only? Let's check.
            // If POST only, I need to fix that or use products to derive categories? 
            // Requirement said: "Ensure Category selection is available".
            // I should check /api/categories route. I did view it earlier and it was POST only.
            // I will need to ADD GET to /api/categories/route.ts or create a new one.
            // For now, let's assume I fix it.
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) setCategories(data)
            })
            .catch(console.error)
    }, [])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        const payload = {
            name,
            price: parseFloat(price),
            description,
            categoryId: parseInt(categoryId)
        }

        try {
            const url = initialData ? `/api/extras/${initialData.id}` : "/api/extras"
            const method = initialData ? "PUT" : "POST"

            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            })

            if (!res.ok) throw new Error("Erro ao salvar")

            toast.success("Salvo com sucesso!")
            onSuccess()
        } catch (e) {
            toast.error("Erro ao salvar")
        }
    }

    return (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md max-w-lg mx-auto">
            <h2 className="text-xl font-bold mb-4">{initialData ? "Editar" : "Novo"} Acréscimo</h2>

            <div className="mb-4">
                <label className="block text-sm font-bold mb-1">Nome</label>
                <input
                    className="w-full border p-2 rounded"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    required
                />
            </div>

            <div className="mb-4">
                <label className="block text-sm font-bold mb-1">Preço (R$)</label>
                <input
                    type="number"
                    step="0.01"
                    className="w-full border p-2 rounded"
                    value={price}
                    onChange={e => setPrice(e.target.value)}
                    required
                />
            </div>

            <div className="mb-4">
                <label className="block text-sm font-bold mb-1">Descrição</label>
                <input
                    className="w-full border p-2 rounded"
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                />
            </div>

            <div className="mb-4">
                <label className="block text-sm font-bold mb-1">Categoria</label>
                <select
                    className="w-full border p-2 rounded"
                    value={categoryId}
                    onChange={e => setCategoryId(e.target.value)}
                    required
                >
                    <option value="">Selecione...</option>
                    {categories.map(cat => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                </select>
            </div>

            <div className="flex gap-2 justify-end">
                <button type="button" onClick={onCancel} className="px-4 py-2 text-gray-600">Cancelar</button>
                <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">Salvar</button>
            </div>
        </form>
    )
}
