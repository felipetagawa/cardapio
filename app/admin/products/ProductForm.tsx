"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Category, Product } from "@prisma/client"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

interface ProductFormProps {
    categories: Category[]
    product?: Product
}

export default function ProductForm({ categories, product }: ProductFormProps) {
    const router = useRouter()
    const isEditing = !!product
    const [isLoading, setIsLoading] = useState(false)

    const [formData, setFormData] = useState({
        name: product?.name || "",
        description: product?.description || "",
        price: product?.price?.toString() || "",
        categoryId: product?.categoryId?.toString() || ""
    })

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)

        try {
            const url = isEditing ? `/api/products/${product.id}` : "/api/products"
            const method = isEditing ? "PUT" : "POST"

            const body = {
                ...formData,
                price: parseFloat(formData.price),
                categoryId: parseInt(formData.categoryId)
            }

            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body)
            })

            if (!res.ok) throw new Error("Erro ao salvar")

            router.push("/admin/products")
            router.refresh()
        } catch (error) {
            alert("Erro ao salvar produto")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="max-w-2xl mx-auto">
            <Link href="/admin/products" className="flex items-center gap-2 text-gray-500 mb-6 hover:text-gray-700">
                <ArrowLeft size={20} /> Voltar
            </Link>

            <h2 className="text-2xl font-bold mb-6">{isEditing ? "Editar Produto" : "Novo Produto"}</h2>

            <form onSubmit={handleSubmit} className="bg-white rounded shadow p-6 space-y-4">
                <div>
                    <label className="block mb-1 font-medium">Nome do Produto</label>
                    <input
                        required
                        value={formData.name}
                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                        className="w-full border p-2 rounded"
                        placeholder="Ex: Pastel de Carne"
                    />
                </div>

                <div>
                    <label className="block mb-1 font-medium">Descrição</label>
                    <textarea
                        value={formData.description}
                        onChange={e => setFormData({ ...formData, description: e.target.value })}
                        className="w-full border p-2 rounded h-24"
                        placeholder="Ingredientes, detalhes..."
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block mb-1 font-medium">Preço (R$)</label>
                        <input
                            required
                            type="number"
                            step="0.01"
                            value={formData.price}
                            onChange={e => setFormData({ ...formData, price: e.target.value })}
                            className="w-full border p-2 rounded"
                            placeholder="0.00"
                        />
                    </div>
                    <div>
                        <label className="block mb-1 font-medium">Categoria</label>
                        <select
                            required
                            value={formData.categoryId}
                            onChange={e => setFormData({ ...formData, categoryId: e.target.value })}
                            className="w-full border p-2 rounded"
                        >
                            <option value="">Selecione...</option>
                            {categories.map(cat => (
                                <option key={cat.id} value={cat.id}>
                                    {cat.name}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-green-600 text-white font-bold py-3 rounded hover:bg-green-700 disabled:opacity-50 mt-6"
                >
                    {isEditing ? "Salvar Alterações" : "Criar Produto"}
                </button>
            </form>
        </div>
    )
}
