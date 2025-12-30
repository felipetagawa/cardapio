import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function POST(req: Request) {
    try {
        const body = await req.json()
        const { items, customerName, customerPhone, address, paymentMethod, changeFor, total, source } = body

        if (!items || items.length === 0) {
            return NextResponse.json({ error: "Cart is empty" }, { status: 400 })
        }

        const order = await prisma.order.create({
            data: {
                customerName,
                customerPhone,
                address,
                paymentMethod,
                changeFor,
                total,
                source: source || "WEB",
                items: {
                    create: items.map((item: any) => ({
                        productId: item.id,
                        quantity: item.quantity,
                        price: item.price
                    }))
                }
            }
        })

        return NextResponse.json(order)
    } catch (error) {
        console.error(error)
        return NextResponse.json({ error: "Failed to create order" }, { status: 500 })
    }
}
