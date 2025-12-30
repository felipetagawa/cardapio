import prisma from "@/lib/prisma"
import POSInterface from "./POSInterface"

export default async function POSPage() {
    const products = await prisma.product.findMany()
    return <POSInterface products={products} />
}
