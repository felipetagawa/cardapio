import prisma from "@/lib/prisma"
import { CheckoutClient } from "../../components/CheckoutClient"

export default async function Checkout() {
    // Fetch all extras for checkout selection
    const extras = await prisma.extra.findMany({
        select: {
            id: true,
            name: true,
            price: true,
            description: true
        }
    })

    return <CheckoutClient availableExtras={extras} />
}
