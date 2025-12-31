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
    // Group products by category
    const categories = products.reduce((acc, product) => {
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
            <h2 className="text-2xl md:text-3xl font-bold text-center mt-9 mb-6 text-white drop-shadow-md">
                Conheça nosso menu
            </h2>

            {Object.entries(categories).map(([category, items]) => {
                // Find extras for this category (assuming match by Name or ID? logic is by Category relation)
                // The extras have categoryId. We are grouping products by category Name.
                // Best to filter extras that match the category of these products.
                // All items in 'items' have same category ID (usually).
                const categoryId = items[0]?.categoryId;
                const categoryExtras = extras.filter(e => e.categoryId === categoryId);

                return (
                    <CategorySection
                        key={category}
                        title={category}
                        items={items}
                        extras={categoryExtras}
                    />
                )
            })}
        </div>
    )
}

function CategorySection({ title, items, extras }: { title: string, items: ProductWithCategory[], extras: ExtraWithCategory[] }) {
    const [isOpen, setIsOpen] = useState(false) // Default closed as per legacy "hidden" or open? Legacy had "hidden" initially except maybe first? No, default hidden.
    // Actually legacy had toggle logic. Let's strictly follow it.

    // NOTE: User might prefer all open or all closed. Legacy had them starting hidden? 
    // "category-content mt-4 hidden" -> yes, native HTML was hidden.

    return (
        <div className="mb-6 border-b pb-2">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex justify-between items-center text-xl font-bold py-2 text-orange-400 hover:text-orange-300 transition-colors"
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
