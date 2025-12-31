"use server"

import prisma from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

export async function createProduct(formData: FormData) {
    const name = formData.get("name") as string
    const description = formData.get("description") as string
    const price = parseFloat(formData.get("price") as string)
    const category = formData.get("category") as string
    const image = formData.get("image") as string

    await prisma.product.create({
        data: {
            name,
            description,
            price,
            category,
            image,
        },
    })

    revalidatePath("/admin/products")
    revalidatePath("/")
    redirect("/admin/products")
}

export async function updateProduct(id: number, formData: FormData) {
    const name = formData.get("name") as string
    const description = formData.get("description") as string
    const price = parseFloat(formData.get("price") as string)
    const category = formData.get("category") as string
    const image = formData.get("image") as string

    await prisma.product.update({
        where: { id },
        data: {
            name,
            description,
            price,
            category,
            image,
        },
    })

    revalidatePath("/admin/products")
    revalidatePath("/")
    redirect("/admin/products")
}

export async function deleteProduct(id: number) {
    await prisma.product.delete({
        where: { id },
    })

    revalidatePath("/admin/products")
    revalidatePath("/")
}
