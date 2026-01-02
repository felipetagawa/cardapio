import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function DELETE(
    req: Request,
    { params }: { params: { id: string } }
) {
    try {
        const id = parseInt(params.id)
        if (isNaN(id)) {
            return NextResponse.json({ error: "Invalid ID" }, { status: 400 })
        }

        await prisma.order.delete({
            where: { id }
        })

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error(error)
        return NextResponse.json({ error: "Failed to delete order" }, { status: 500 })
    }
}

export async function PUT(
    req: Request,
    { params }: { params: { id: string } }
) {
    try {
        const id = parseInt(params.id)
        if (isNaN(id)) {
            return NextResponse.json({ error: "Invalid ID" }, { status: 400 })
        }

        const body = await req.json()
        const { status, customerName, customerPhone, address, paymentMethod } = body

        const order = await prisma.order.update({
            where: { id },
            data: {
                status,
                customerName,
                customerPhone,
                address,
                paymentMethod
            }
        })

        return NextResponse.json(order)
    } catch (error) {
        console.error(error)
        return NextResponse.json({ error: "Failed to update order" }, { status: 500 })
    }
}
