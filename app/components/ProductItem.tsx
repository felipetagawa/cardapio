"use client"

import { useCart } from "../context/CartContext"
import { ShoppingCart } from "lucide-react"
import { Product } from "@prisma/client"
import Image from "next/image"
import { toast } from "react-toastify"

interface ProductItemProps {
    product: Product
}

export function ProductItem({ product }: ProductItemProps) {
    const { addToCart } = useCart()

    const handleAddToCart = () => {
        addToCart({
            id: product.id,
            name: product.name,
            price: product.price,
            quantity: 1
        })
        toast.success(`${product.name} adicionado!`, {
            autoClose: 1000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: false,
        })
    }

    return (
        <div className="flex gap-2 mb-4 w-full">
            <Image
                src={product.image || "/assets/pastel.jpeg"}
                alt={product.name}
                width={112}
                height={112}
                className="w-28 h-28 rounded-md object-cover"
            />
            <div className="flex-1 flex flex-col justify-between">
                <div>
                    <p className="font-bold">{product.name}</p>
                    <p className="text-sm text-gray-600 line-clamp-2">{product.description}</p>
                </div>

                <div className="flex justify-between items-center mt-2">
                    <p className="font-bold">
                        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(product.price)}
                    </p>
                    <button
                        onClick={handleAddToCart}
                        className="bg-gray-900 px-5 py-1 rounded hover:bg-gray-800 duration-200"
                    >
                        <ShoppingCart className="text-white" size={20} />
                    </button>
                </div>
            </div>
        </div>
    )
}
