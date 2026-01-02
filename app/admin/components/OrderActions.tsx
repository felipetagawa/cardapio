"use client"

import { Trash2, Edit } from "lucide-react"
import { useRouter } from "next/navigation"
import { toast } from "react-toastify"
import { useState } from "react"

interface OrderActionsProps {
    orderId: number
}

export function OrderActions({ orderId }: OrderActionsProps) {
    const router = useRouter()
    const [isDeleting, setIsDeleting] = useState(false)

    const handleDelete = async () => {
        if (!confirm("Tem certeza que deseja excluir este pedido?")) return

        setIsDeleting(true)
        try {
            const response = await fetch(`/api/orders/${orderId}`, {
                method: "DELETE"
            })

            if (!response.ok) throw new Error("Erro ao excluir")

            toast.success("Pedido excluído!")
            router.refresh()
        } catch (error) {
            toast.error("Erro ao excluir pedido")
            setIsDeleting(false)
        }
    }

    return (
        <div className="flex gap-2">
            <button
                onClick={() => router.push(`/admin/orders/${orderId}/edit`)}
                className="bg-blue-500 text-white px-3 py-1 rounded text-xs flex items-center gap-1 hover:bg-blue-600"
                title="Editar"
            >
                <Edit size={14} />
            </button>
            <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="bg-red-500 text-white px-3 py-1 rounded text-xs flex items-center gap-1 hover:bg-red-600 disabled:opacity-50"
                title="Excluir"
            >
                <Trash2 size={14} />
            </button>
        </div>
    )
}
