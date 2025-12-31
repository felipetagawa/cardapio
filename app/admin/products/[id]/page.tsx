import prisma from "@/lib/prisma"
import ProductForm from "../ProductForm"
import { notFound } from "next/navigation"

export const revalidate = 0

interface EditProductPageProps {
    params: { id: string }
}

export default async function EditProductPage({ params }: EditProductPageProps) {
    const id = parseInt(params.id)
    if (isNaN(id)) notFound()

    const [product, categories] = await Promise.all([
        prisma.product.findUnique({ where: { id } }),
        prisma.category.findMany({ orderBy: { order: "asc" } })
    ])

    if (!product) notFound()

    return <ProductForm categories={categories} product={product} />
}
