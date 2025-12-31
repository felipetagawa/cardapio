import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function GET() {
    try {
        const extras = await prisma.extra.findMany({
            include: { category: true },
            orderBy: { id: 'asc' }
        })
        return NextResponse.json(extras)
    } catch (e) {
        return NextResponse.json({ error: "Error fetching extras" }, { status: 500 })
    }
}

export async function POST(req: Request) {
    try {
        const { name, price, description, categoryId } = await req.json()

        const extra = await prisma.extra.create({
            data: {
                name,
                price: parseFloat(price),
                description,
                categoryId: parseInt(categoryId)
            }
        })

        return NextResponse.json(extra)
    } catch (e) {
        return NextResponse.json({ error: "Error creating extra" }, { status: 500 })
    }
}
