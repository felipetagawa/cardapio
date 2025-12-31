import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function POST(req: Request) {
    try {
        const body = await req.json()
        const { name, description, price, categoryId } = body

        const product = await prisma.product.create({
            data: {
                name,
                description,
                price,
                categoryId
            }
        })
        return NextResponse.json(product)
    } catch (e) {
        console.error(e)
        return NextResponse.json({ error: "Error" }, { status: 500 })
    }
}
