"use client"

import React, { createContext, useContext, useState, useEffect } from "react"
import { toast } from "react-toastify"

export interface CartItem {
    id: number
    internalId?: string // Unique identifier for cart (product ID + extras signature)
    name: string
    price: number
    quantity: number
    extras?: { id: number; name: string; price: number }[]
}

interface CartContextType {
    cart: CartItem[]
    addToCart: (item: CartItem) => void
    removeFromCart: (internalId: string) => void
    updateQuantity: (internalId: string, quantity: number) => void
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
                const parsed = JSON.parse(saved)
                // Migrate old cart items if needed (add internalId if missing)
                const migrated = parsed.map((item: CartItem) => ({
                    ...item,
                    internalId: item.internalId || `${item.id}-${JSON.stringify(item.extras || [])}`
                }))
                setCart(migrated)
            } catch (e) {
                console.error("Failed to parse cart", e)
            }
        }
    }, [])

    useEffect(() => {
        localStorage.setItem("cart", JSON.stringify(cart))
        const t = cart.reduce((acc, item) => {
            const extrasTotal = item.extras?.reduce((sum, ex) => sum + ex.price, 0) || 0
            return acc + (item.price + extrasTotal) * item.quantity
        }, 0)
        setTotal(t)
    }, [cart])

    const addToCart = (item: CartItem) => {
        const extrasSorted = item.extras?.sort((a, b) => a.id - b.id) || []
        const internalId = `${item.id}-${JSON.stringify(extrasSorted)}`
        const itemWithId = { ...item, internalId, extras: extrasSorted }

        setCart(prev => {
            const existing = prev.find(i => i.internalId === internalId)
            if (existing) {
                return prev.map(i => i.internalId === internalId ? { ...i, quantity: i.quantity + item.quantity } : i)
            }
            return [...prev, itemWithId]
        })
        // toast.success(`${item.name} adicionado!`)
    }

    const removeFromCart = (internalId: string) => {
        setCart(prev => prev.filter(i => i.internalId !== internalId))
    }

    const updateQuantity = (internalId: string, quantity: number) => {
        if (quantity <= 0) {
            removeFromCart(internalId)
            return
        }
        setCart(prev => prev.map(i => i.internalId === internalId ? { ...i, quantity } : i))
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
