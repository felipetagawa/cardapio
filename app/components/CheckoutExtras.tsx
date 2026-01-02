"use client"

import { useState } from "react"
import { ChevronDown, ChevronUp, Plus } from "lucide-react"
import { CartItem } from "../../context/CartContext"

interface CheckoutExtrasProps {
    cartItem: CartItem
    availableExtras: { id: number; name: string; price: number; description?: string | null }[]
    onUpdateExtras: (internalId: string, extras: { id: number; name: string; price: number }[]) => void
}

export function CheckoutExtras({ cartItem, availableExtras, onUpdateExtras }: CheckoutExtrasProps) {
    const [isOpen, setIsOpen] = useState(false)
    const [selectedExtras, setSelectedExtras] = useState<{ id: number; name: string; price: number }[]>(
        cartItem.extras || []
    )

    const toggleExtra = (extra: { id: number; name: string; price: number }) => {
        const newExtras = selectedExtras.find(e => e.id === extra.id)
            ? selectedExtras.filter(e => e.id !== extra.id)
            : [...selectedExtras, extra]

        setSelectedExtras(newExtras)
        onUpdateExtras(cartItem.internalId!, newExtras)
    }

    return (
        <div className="border-t pt-2 mt-2">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800"
            >
                {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                {selectedExtras.length > 0
                    ? `${selectedExtras.length} acréscimo(s) adicionado(s)`
                    : "Adicionar acréscimos"}
            </button>

            {isOpen && (
                <div className="mt-2 space-y-2 pl-4">
                    {availableExtras.map(extra => {
                        const isSelected = !!selectedExtras.find(e => e.id === extra.id)
                        return (
                            <div
                                key={extra.id}
                                onClick={() => toggleExtra(extra)}
                                className={`flex justify-between items-center border p-2 rounded cursor-pointer transition-colors text-sm ${isSelected ? 'border-green-500 bg-green-50' : 'border-gray-200 hover:border-gray-300'
                                    }`}
                            >
                                <div>
                                    <p className="font-medium text-gray-900">{extra.name}</p>
                                    <p className="text-xs text-gray-600">
                                        + R$ {extra.price.toFixed(2)}
                                    </p>
                                </div>
                                <div className={`w-5 h-5 rounded border flex items-center justify-center ${isSelected ? 'bg-green-500 border-green-500' : 'border-gray-400'
                                    }`}>
                                    {isSelected && <Plus size={14} className="text-white" />}
                                </div>
                            </div>
                        )
                    })}
                </div>
            )}
        </div>
    )
}
