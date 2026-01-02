import prisma from "@/lib/prisma"
import { notFound } from "next/navigation"
import { OrderEditForm } from "../../../components/OrderEditForm"

interface OrderEditPageProps {
    params: { id: string }
}

export default async function OrderEditPage({ params }: OrderEditPageProps) {
    const id = parseInt(params.id)
    if (isNaN(id)) return notFound()

    const order = await prisma.order.findUnique({
        where: { id },
        include: {
            items: {
                include: {
                    product: true,
                    extras: {
                        include: {
                            extra: true
                        }
                    }
                }
            }
        }
    })

    if (!order) return notFound()

    return (
        <div className="max-w-2xl mx-auto">
            <h1 className="text-2xl font-bold mb-6">Editar Pedido #{order.id}</h1>
            <OrderEditForm order={order} />
        </div>
    )
}
