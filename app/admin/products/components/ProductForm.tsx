"use client"

import { Product } from "@prisma/client"
import { createProduct, updateProduct } from "../actions"
import Link from "next/link"

interface ProductFormProps {
    product?: Product
}

export function ProductForm({ product }: ProductFormProps) {
    const isEdit = !!product

    // Simple action wrapper to handle binding if needed, 
    // but here we can just pass the server action to the form 
    // or use a client handler if we want toast notifications/loading states.
    // For simplicity/v1, native form actions.

    const action = isEdit ? updateProduct.bind(null, product.id) : createProduct

    return (
        <form action={action} className="max-w-xl bg-white p-6 rounded shadow">
            <div className="mb-4">
                <label className="block text-sm font-bold mb-2">Nome do Produto</label>
                <input
                    type="text"
                    name="name"
                    defaultValue={product?.name}
                    required
                    className="w-full border p-2 rounded"
                />
            </div>

            <div className="mb-4">
                <label className="block text-sm font-bold mb-2">Descrição</label>
                <textarea
                    name="description"
                    defaultValue={product?.description || ""}
                    className="w-full border p-2 rounded h-20"
                />
            </div>

            <div className="mb-4">
                <label className="block text-sm font-bold mb-2">Preço (R$)</label>
                <input
                    type="number"
                    name="price"
                    step="0.01"
                    defaultValue={product?.price}
                    required
                    className="w-full border p-2 rounded"
                />
            </div>

            <div className="mb-4">
                <label className="block text-sm font-bold mb-2">Categoria</label>
                <select
                    name="category"
                    defaultValue={product?.category || "Pastéis"}
                    className="w-full border p-2 rounded"
                >
                    <option value="Pastéis">Pastéis</option>
                    <option value="Bebidas">Bebidas</option>
                    <option value="Porções">Porções</option>
                    <option value="Lanches">Lanches</option>
                </select>
            </div>

            <div className="mb-4">
                <label className="block text-sm font-bold mb-2">URL da Imagem</label>
                <input
                    type="text"
                    name="image"
                    defaultValue={product?.image || ""}
                    placeholder="/assets/seu-arquivo.png ou URL externa"
                    className="w-full border p-2 rounded"
                />
                <p className="text-xs text-gray-500 mt-1">
                    Dica: Use arquivos em <code>/public/assets/</code>
                </p>
            </div>

            <div className="flex gap-4">
                <button
                    type="submit"
                    className="bg-green-600 text-white px-4 py-2 rounded font-bold hover:bg-green-700"
                >
                    {isEdit ? "Atualizar Produto" : "Criar Produto"}
                </button>
                <Link
                    href="/admin/products"
                    className="bg-gray-200 text-gray-800 px-4 py-2 rounded font-bold hover:bg-gray-300"
                >
                    Cancelar
                </Link>
            </div>
        </form>
    )
}
