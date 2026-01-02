"use client"

import { Product, Category, Extra } from "@prisma/client"
import { useState } from "react"
import { ChevronDown, ChevronUp } from "lucide-react"
import { ProductItem } from "./ProductItem"

type ProductWithCategory = Product & { category: Category | null }
type ExtraWithCategory = Extra & { category: Category | null }

interface MenuProps {
    products: ProductWithCategory[]
    extras: ExtraWithCategory[]
}

export function Menu({ products, extras }: MenuProps) {
    const [searchTerm, setSearchTerm] = useState("")

    // Filter products based on search term
    const filteredProducts = products.filter(product => {
        if (!searchTerm) return true
        const term = searchTerm.toLowerCase()
        return (
            product.name.toLowerCase().includes(term) ||
            product.description?.toLowerCase().includes(term) ||
            product.category?.name.toLowerCase().includes(term)
        )
    })

    // Group filtered products by category
    const categories = filteredProducts.reduce((acc, product) => {
        // Handle potential missing category relation safely
        const catName = product.category?.name || "Sem Categoria"

        if (!acc[catName]) {
            acc[catName] = []
        }
        acc[catName].push(product)
        return acc
    }, {} as Record<string, ProductWithCategory[]>)

    return (
        <div id="menu" className="max-w-4xl mx-auto px-4 mb-16">
            <h2 className="text-2xl md:text-3xl font-bold text-center mt-9 mb-6 text-stone-200 drop-shadow-sm uppercase tracking-wide">
                Conheça nosso menu
            </h2>

            {/* Search Input */}
            <div className="mb-8 max-w-md mx-auto relative">
                <input
                    type="text"
                    placeholder="Buscar item..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full p-3 rounded-full border border-stone-300 focus:outline-none focus:ring-2 focus:ring-orange-500 text-stone-900 shadow-sm"
                />
            </div>

            {Object.keys(categories).length === 0 && (
                <div className="text-center text-stone-400 py-8">
                    Nenhum produto encontrado.
                </div>
            )}

            {Object.entries(categories).map(([category, items]) => {
                return (
                    <CategorySection
                        key={category}
                        title={category}
                        items={items}
                        extras={extras} // Pass ALL extras to each category
                        forceOpen={!!searchTerm} // Auto open if searching
                    />
                )
            })}
        </div>
    )
}

function CategorySection({ title, items, extras, forceOpen }: { title: string, items: ProductWithCategory[], extras: ExtraWithCategory[], forceOpen?: boolean }) {
    const [isOpen, setIsOpen] = useState(forceOpen || false) // Default closed as per legacy "hidden" or open? Legacy had "hidden" initially except maybe first? No, default hidden.

    // Sync open state if forceOpen changes (e.g. user starts searching)
    if (forceOpen && !isOpen) {
        setIsOpen(true)
    }

    // NOTE: User might prefer all open or all closed. Legacy had them starting hidden? 
    // "category-content mt-4 hidden" -> yes, native HTML was hidden.

    return (
        <div className="mb-6 border-b border-stone-700 pb-2">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex justify-between items-center text-xl font-bold py-2 text-stone-300 hover:text-white transition-colors"
            >
                {title}
                {isOpen ? <ChevronUp /> : <ChevronDown />}
            </button>

            {isOpen && (
                <div className="mt-4 animate-fadeIn">
                    {items.map(product => (
                        <ProductItem key={product.id} product={product} extras={extras} />
                    ))}
                </div>
            )}
        </div>
    )
}
