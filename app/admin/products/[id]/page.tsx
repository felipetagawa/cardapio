import prisma from "@/lib/prisma"
import { ProductForm } from "../components/ProductForm"
import { notFound } from "next/navigation"

export const revalidate = 0

export default async function EditProductPage({ params }: { params: { id: string } }) {
    const id = parseInt(params.id)
    if (isNaN(id)) return notFound()

    const product = await prisma.product.findUnique({
        where: { id }
    })

    if (!product) return notFound()

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-6">Editar Produto: {product.name}</h1>
            <ProductForm product={product} />
        </div>
    )
}
