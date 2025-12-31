import prisma from "@/lib/prisma"
import ProductList from "./ProductList"

export const revalidate = 0

export default async function ProductsPage() {
    const products = await prisma.product.findMany({
        include: { category: true },
        orderBy: { name: "asc" }
    })

    return <ProductList products={products} />
}
