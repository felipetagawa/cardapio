import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function PUT(req: Request, { params }: { params: { id: string } }) {
    try {
        const { name, price, description, categoryId } = await req.json()
        const id = parseInt(params.id)

        const extra = await prisma.extra.update({
            where: { id },
            data: {
                name,
                price: parseFloat(price),
                description,
                categoryId: parseInt(categoryId)
            }
        })

        return NextResponse.json(extra)
    } catch (e) {
        return NextResponse.json({ error: "Error updating extra" }, { status: 500 })
    }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
    try {
        const id = parseInt(params.id)

        await prisma.extra.delete({
            where: { id }
        })

        return NextResponse.json({ success: true })
    } catch (e) {
        return NextResponse.json({ error: "Error deleting extra" }, { status: 500 })
    }
}
