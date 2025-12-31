import prisma from "@/lib/prisma"
import ProductForm from "../ProductForm"

export const revalidate = 0

export default async function NewProductPage() {
    const categories = await prisma.category.findMany({ orderBy: { order: "asc" } })
    return <ProductForm categories={categories} />
}
