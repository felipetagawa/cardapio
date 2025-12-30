"use client"

import React, { createContext, useContext, useState, useEffect } from "react"
import { toast } from "react-toastify"

export interface CartItem {
    id: number
    name: string
    price: number
    quantity: number
}

interface CartContextType {
    cart: CartItem[]
    addToCart: (item: CartItem) => void
    removeFromCart: (id: number) => void
    updateQuantity: (id: number, quantity: number) => void
    clearCart: () => void
    total: number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: React.ReactNode }) {
    const [cart, setCart] = useState<CartItem[]>([])
    const [total, setTotal] = useState(0)

    // Load from local storage on mount (optional, good for persistence)
    useEffect(() => {
        const saved = localStorage.getItem("cart")
        if (saved) {
            try {
                setCart(JSON.parse(saved))
            } catch (e) {
                console.error("Failed to parse cart", e)
            }
        }
    }, [])

    useEffect(() => {
        localStorage.setItem("cart", JSON.stringify(cart))
        const t = cart.reduce((acc, item) => acc + item.price * item.quantity, 0)
        setTotal(t)
    }, [cart])

    const addToCart = (item: CartItem) => {
        setCart(prev => {
            const existing = prev.find(i => i.id === item.id)
            if (existing) {
                return prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + item.quantity } : i)
            }
            return [...prev, item]
        })
        // toast.success(`${item.name} adicionado!`)
    }

    const removeFromCart = (id: number) => {
        setCart(prev => prev.filter(i => i.id !== id))
    }

    const updateQuantity = (id: number, quantity: number) => {
        if (quantity <= 0) {
            removeFromCart(id)
            return
        }
        setCart(prev => prev.map(i => i.id === id ? { ...i, quantity } : i))
    }

    const clearCart = () => {
        setCart([])
    }

    return (
        <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart, total }}>
            {children}
        </CartContext.Provider>
    )
}

export function useCart() {
    const context = useContext(CartContext)
    if (!context) {
        throw new Error("useCart must be used within a CartProvider")
    }
    return context
}
