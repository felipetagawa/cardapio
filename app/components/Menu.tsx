"use client"

import { Product } from "@prisma/client"
import { useState } from "react"
import { ChevronDown, ChevronUp } from "lucide-react"
import { ProductItem } from "./ProductItem"

interface MenuProps {
    products: Product[]
}

export function Menu({ products }: MenuProps) {
    // Group products by category
    const categories = products.reduce((acc, product) => {
        if (!acc[product.category]) {
            acc[product.category] = []
        }
        acc[product.category].push(product)
        return acc
    }, {} as Record<string, Product[]>)

    return (
        <div id="menu" className="max-w-4xl mx-auto px-4 mb-16">
            <h2 className="text-2xl md:text-3xl font-bold text-center mt-9 mb-6">
                Conheça nosso menu
            </h2>

            {Object.entries(categories).map(([category, items]) => (
                <CategorySection key={category} title={category} items={items} />
            ))}
        </div>
    )
}

function CategorySection({ title, items }: { title: string, items: Product[] }) {
    const [isOpen, setIsOpen] = useState(false) // Default closed as per legacy "hidden" or open? Legacy had "hidden" initially except maybe first? No, default hidden.
    // Actually legacy had toggle logic. Let's strictly follow it.

    // NOTE: User might prefer all open or all closed. Legacy had them starting hidden? 
    // "category-content mt-4 hidden" -> yes, native HTML was hidden.

    return (
        <div className="mb-6 border-b pb-2">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex justify-between items-center text-xl font-bold py-2"
            >
                {title}
                {isOpen ? <ChevronUp /> : <ChevronDown />}
            </button>

            {isOpen && (
                <div className="mt-4 animate-fadeIn">
                    {items.map(product => (
                        <ProductItem key={product.id} product={product} />
                    ))}
                </div>
            )}
        </div>
    )
}
