import prisma from "@/lib/prisma"
import CategoryManager from "./CategoryManager"

export const revalidate = 0

export default async function CategoriesPage() {
    const categories = await prisma.category.findMany({
        orderBy: { order: "asc" }
    })

    return <CategoryManager categories={categories} />
}
