import prisma from "@/lib/prisma"
import Link from "next/link"
import { deleteProduct } from "./actions"
import { Pencil, Trash2, Plus } from "lucide-react"

export const revalidate = 0

export default async function ProductListPage() {
    const products = await prisma.product.findMany({
        orderBy: { name: "asc" }
    })

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Gerenciar Produtos</h1>
                <Link
                    href="/admin/products/new"
                    className="bg-green-600 text-white px-4 py-2 rounded flex items-center gap-2 hover:bg-green-700"
                >
                    <Plus size={20} /> Novo Produto
                </Link>
            </div>

            <div className="bg-white rounded shadow overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-gray-100 border-b">
                        <tr>
                            <th className="p-3">Nome</th>
                            <th className="p-3">Categoria</th>
                            <th className="p-3">Preço</th>
                            <th className="p-3 text-right">Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map(product => (
                            <tr key={product.id} className="border-b hover:bg-gray-50">
                                <td className="p-3 font-medium">{product.name}</td>
                                <td className="p-3 text-gray-600">{product.category}</td>
                                <td className="p-3">R$ {product.price.toFixed(2)}</td>
                                <td className="p-3 flex justify-end gap-2">
                                    <Link
                                        href={`/admin/products/${product.id}`}
                                        className="text-blue-600 hover:text-blue-800 p-1"
                                        title="Editar"
                                    >
                                        <Pencil size={18} />
                                    </Link>

                                    <form action={deleteProduct.bind(null, product.id)}>
                                        <button
                                            type="submit"
                                            className="text-red-500 hover:text-red-700 p-1"
                                            title="Excluir"
                                        // Add simple confirmation
                                        // In a real app we'd use a client component for confirm dialog
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </form>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {products.length === 0 && (
                    <div className="p-8 text-center text-gray-500">
                        Nenhum produto cadastrado.
                    </div>
                )}
            </div>
        </div>
    )
}
