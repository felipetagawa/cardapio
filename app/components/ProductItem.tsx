import { useCart } from "../context/CartContext"
import { ShoppingCart, Plus, Minus, X } from "lucide-react"
import { Product, Extra, Category } from "@prisma/client"
import Image from "next/image"
import { toast } from "react-toastify"
import { useState } from "react"

type ExtraWithCategory = Extra & { category: Category | null }

interface ProductItemProps {
    product: Product
    extras?: ExtraWithCategory[]
}

export function ProductItem({ product, extras = [] }: ProductItemProps) {
    const { addToCart } = useCart()
    const [showModal, setShowModal] = useState(false)
    const [selectedExtras, setSelectedExtras] = useState<Extra[]>([])

    const hasExtras = extras.length > 0

    const handleAddToCart = () => {
        // If has extras, open modal first? Or just add if user wants?
        // Requirement: "claro em qual pastel sera adicionado o acrescimo"
        // Best UX: If extras available, show "Adicionar" -> Opens modal -> Select extras -> "Adicionar ao carrinho"
        // Or "Adicionar" -> Add default. "Personalizar" -> Open modal.
        // Let's go with: If extras exist, ALWAYS open modal to upsell/offer.
        // Or simpler: Button just adds to cart if no extras.
        // If has extras, maybe a small "Personalizar" button?
        // Let's try: "Adicionar" opens modal ONLY IF extras exist.

        if (hasExtras) {
            setShowModal(true)
        } else {
            addToCart({
                id: product.id,
                name: product.name,
                price: product.price,
                quantity: 1,
                extras: []
            })
            toast.success(`${product.name} adicionado!`, {
                autoClose: 500,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: false,
            })
        }
    }

    const confirmWithExtras = () => {
        addToCart({
            id: product.id,
            name: product.name,
            price: product.price,
            quantity: 1,
            extras: selectedExtras
        })
        toast.success(`${product.name} adicionado com extras!`, {
            autoClose: 1000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: false,
        })
        setShowModal(false)
        setSelectedExtras([])
    }

    const toggleExtra = (extra: Extra) => {
        setSelectedExtras(prev => {
            const exists = prev.find(e => e.id === extra.id)
            if (exists) {
                return prev.filter(e => e.id !== extra.id)
            }
            return [...prev, extra]
        })
    }

    const totalWithExtras = product.price + selectedExtras.reduce((acc, e) => acc + e.price, 0)

    return (
        <>
            <div className="flex gap-2 mb-4 w-full bg-white p-3 rounded-lg shadow-sm border border-stone-200 hover:border-orange-500 transition-all hover:shadow-md">
                <Image
                    src={product.image || "/assets/pastel.jpeg"}
                    alt={product.name}
                    width={112}
                    height={112}
                    className="w-28 h-28 rounded-md object-cover"
                />
                <div className="flex-1 flex flex-col justify-between">
                    <div>
                        <p className="font-bold text-stone-900 text-lg">{product.name}</p>
                        <p className="text-sm text-stone-600 line-clamp-2">{product.description}</p>
                    </div>

                    <div className="flex justify-between items-center mt-2">
                        <p className="font-bold text-orange-600 text-lg">
                            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(product.price)}
                        </p>
                        <button
                            onClick={handleAddToCart}
                            className="bg-orange-600 px-5 py-2 rounded hover:bg-orange-700 duration-200 shadow-md"
                        >
                            <ShoppingCart className="text-white" size={20} />
                        </button>
                    </div>
                </div>
            </div>

            {/* Modal for Extras */}
            {showModal && (
                <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-lg w-full max-w-md p-4 animate-fadeIn max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="font-bold text-lg">Adicionar acréscimos?</h3>
                            <button onClick={() => setShowModal(false)}>
                                <X size={24} />
                            </button>
                        </div>

                        <div className="mb-4">
                            <p className="font-bold mb-2">{product.name}</p>
                            <p className="text-gray-600 text-sm mb-4">{product.description}</p>

                            <p className="font-bold mb-2">Com esse pastel combina:</p>
                            <div className="space-y-2">
                                {extras.map(extra => {
                                    const isSelected = !!selectedExtras.find(e => e.id === extra.id)
                                    return (
                                        <div
                                            key={extra.id}
                                            onClick={() => toggleExtra(extra)}
                                            className={`flex justify-between items-center border p-3 rounded cursor-pointer transition-colors ${isSelected ? 'border-green-500 bg-green-50' : 'border-gray-200'}`}
                                        >
                                            <div>
                                                <p className="font-medium">{extra.name}</p>
                                                <p className="text-sm text-gray-500">
                                                    + {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(extra.price)}
                                                </p>
                                            </div>
                                            <div className={`w-5 h-5 rounded border flex items-center justify-center ${isSelected ? 'bg-green-500 border-green-500' : 'border-gray-400'}`}>
                                                {isSelected && <Plus size={14} className="text-white" />}
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>

                        <button
                            onClick={confirmWithExtras}
                            className="w-full bg-green-500 text-white font-bold py-3 rounded flex justify-between px-4 hover:bg-green-600"
                        >
                            <span>Adicionar ao carrinho</span>
                            <span>{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalWithExtras)}</span>
                        </button>
                    </div>
                </div>
            )}
        </>
    )
}
