"use client"

import { useCart } from "../context/CartContext"
import { ShoppingCart } from "lucide-react"
import Link from "next/link"

export function Footer() {
    const { cart } = useCart()
    const count = cart.reduce((acc, item) => acc + item.quantity, 0)

    if (count === 0) return null

    return (
        <footer className="w-full bg-red-500 py-3 fixed bottom-0 z-40 flex items-center justify-center">
            <Link
                href="/checkout"
                className="flex items-center gap-2 text-white font-bold"
            >
                <span>({count})</span>
                Veja meu carrinho
                <ShoppingCart size={20} />
            </Link>
        </footer>
    )
}
