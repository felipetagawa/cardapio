import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function PUT(req: Request, { params }: { params: { id: string } }) {
    try {
        const { name } = await req.json()
        const category = await prisma.category.update({
            where: { id: parseInt(params.id) },
            data: { name }
        })
        return NextResponse.json(category)
    } catch {
        return NextResponse.json({ error: "Error" }, { status: 500 })
    }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
    try {
        await prisma.category.delete({
            where: { id: parseInt(params.id) }
        })
        return NextResponse.json({ success: true })
    } catch {
        return NextResponse.json({ error: "Error" }, { status: 500 })
    }
}
