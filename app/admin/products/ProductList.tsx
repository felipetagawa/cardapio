"use client"
import Link from "next/link"
import { Product, Category } from "@prisma/client"
import { Plus, Edit, Trash2 } from "lucide-react"
import { useState } from "react"
import { useRouter } from "next/navigation"

type ProductWithCategory = Product & { category: Category | null }

export default function ProductList({ products }: { products: ProductWithCategory[] }) {
    const router = useRouter()
    const [isDeleting, setIsDeleting] = useState(false)

    const handleDelete = async (id: number) => {
        if (!confirm("Tem certeza que deseja excluir este produto?")) return

        setIsDeleting(true)
        try {
            await fetch(`/api/products/${id}`, { method: "DELETE" })
            router.refresh()
        } catch (error) {
            alert("Erro ao excluir produto")
        } finally {
            setIsDeleting(false)
        }
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Produtos</h2>
                <div className="flex gap-2">
                    <Link
                        href="/admin/categories"
                        className="bg-gray-600 text-white px-4 py-2 rounded text-sm hover:bg-gray-700"
                    >
                        Gerenciar Categorias
                    </Link>
                    <Link
                        href="/admin/products/new"
                        className="bg-green-600 text-white px-4 py-2 rounded text-sm hover:bg-green-700 flex items-center gap-2"
                    >
                        <Plus size={16} /> Novo Produto
                    </Link>
                </div>
            </div>

            <div className="bg-white rounded shadow overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-100 border-b">
                        <tr>
                            <th className="p-3">Nome</th>
                            <th className="p-3">Categoria</th>
                            <th className="p-3">Preço</th>
                            <th className="p-3">Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map(product => (
                            <tr key={product.id} className="border-b hover:bg-gray-50">
                                <td className="p-3 font-medium">{product.name}</td>
                                <td className="p-3 text-sm text-gray-600">{product.category?.name || "-"}</td>
                                <td className="p-3">R$ {product.price.toFixed(2)}</td>
                                <td className="p-3 flex gap-2">
                                    <Link
                                        href={`/admin/products/${product.id}`}
                                        className="bg-blue-100 text-blue-700 p-2 rounded hover:bg-blue-200"
                                    >
                                        <Edit size={16} />
                                    </Link>
                                    <button
                                        onClick={() => handleDelete(product.id)}
                                        disabled={isDeleting}
                                        className="bg-red-100 text-red-700 p-2 rounded hover:bg-red-200"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
