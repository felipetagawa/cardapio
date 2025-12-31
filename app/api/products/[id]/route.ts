import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function PUT(req: Request, { params }: { params: { id: string } }) {
    try {
        const body = await req.json()
        const { name, description, price, categoryId } = body

        const product = await prisma.product.update({
            where: { id: parseInt(params.id) },
            data: {
                name,
                description,
                price,
                categoryId
            }
        })
        return NextResponse.json(product)
    } catch {
        return NextResponse.json({ error: "Error" }, { status: 500 })
    }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
    try {
        await prisma.product.delete({
            where: { id: parseInt(params.id) }
        })
        return NextResponse.json({ success: true })
    } catch {
        return NextResponse.json({ error: "Error" }, { status: 500 })
    }
}
