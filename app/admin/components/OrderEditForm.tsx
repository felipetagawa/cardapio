"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "react-toastify"

interface OrderEditFormProps {
    order: any
}

export function OrderEditForm({ order }: OrderEditFormProps) {
    const router = useRouter()
    const [customerName, setCustomerName] = useState(order.customerName || "")
    const [customerPhone, setCustomerPhone] = useState(order.customerPhone || "")
    const [address, setAddress] = useState(order.address || "")
    const [status, setStatus] = useState(order.status)
    const [paymentMethod, setPaymentMethod] = useState(order.paymentMethod || "")
    const [isSaving, setIsSaving] = useState(false)

    const handleSave = async () => {
        setIsSaving(true)
        try {
            const response = await fetch(`/api/orders/${order.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    customerName,
                    customerPhone,
                    address,
                    status,
                    paymentMethod
                })
            })

            if (!response.ok) throw new Error("Erro ao salvar")

            toast.success("Pedido atualizado!")
            router.push("/admin")
            router.refresh()
        } catch (error) {
            toast.error("Erro ao salvar pedido")
            setIsSaving(false)
        }
    }

    return (
        <div className="bg-white p-6 rounded shadow">
            <div className="space-y-4">
                <div>
                    <label className="block font-bold mb-2">Cliente</label>
                    <input
                        type="text"
                        value={customerName}
                        onChange={e => setCustomerName(e.target.value)}
                        className="w-full border p-2 rounded"
                    />
                </div>

                <div>
                    <label className="block font-bold mb-2">Telefone</label>
                    <input
                        type="text"
                        value={customerPhone}
                        onChange={e => setCustomerPhone(e.target.value)}
                        className="w-full border p-2 rounded"
                    />
                </div>

                <div>
                    <label className="block font-bold mb-2">Endereço</label>
                    <input
                        type="text"
                        value={address}
                        onChange={e => setAddress(e.target.value)}
                        className="w-full border p-2 rounded"
                    />
                </div>

                <div>
                    <label className="block font-bold mb-2">Forma de Pagamento</label>
                    <select
                        value={paymentMethod}
                        onChange={e => setPaymentMethod(e.target.value)}
                        className="w-full border p-2 rounded"
                    >
                        <option value="">Selecione...</option>
                        <option value="Dinheiro">Dinheiro</option>
                        <option value="Débito">Débito</option>
                        <option value="Crédito">Crédito</option>
                        <option value="PIX">PIX</option>
                    </select>
                </div>

                <div>
                    <label className="block font-bold mb-2">Status</label>
                    <select
                        value={status}
                        onChange={e => setStatus(e.target.value)}
                        className="w-full border p-2 rounded"
                    >
                        <option value="PENDING">Pendente</option>
                        <option value="CONFIRMED">Confirmado</option>
                        <option value="MADE">Em Produção</option>
                        <option value="DELIVERED">Entregue</option>
                        <option value="CANCELED">Cancelado</option>
                    </select>
                </div>

                <div className="bg-gray-50 p-4 rounded">
                    <h3 className="font-bold mb-2">Itens do Pedido</h3>
                    {order.items.map((item: any) => (
                        <div key={item.id} className="mb-2">
                            <p>{item.quantity}x {item.product.name} - R$ {item.price.toFixed(2)}</p>
                            {item.extras.length > 0 && (
                                <p className="text-sm text-gray-600 ml-4">
                                    + {item.extras.map((e: any) => e.extra.name).join(", ")}
                                </p>
                            )}
                        </div>
                    ))}
                    <p className="font-bold mt-2">Total: R$ {order.total.toFixed(2)}</p>
                </div>

                <div className="flex gap-4">
                    <button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600 disabled:opacity-50"
                    >
                        {isSaving ? "Salvando..." : "Salvar"}
                    </button>
                    <button
                        onClick={() => router.back()}
                        className="bg-gray-300 text-gray-700 px-6 py-2 rounded hover:bg-gray-400"
                    >
                        Cancelar
                    </button>
                </div>
            </div>
        </div>
    )
}
