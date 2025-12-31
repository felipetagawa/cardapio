"use client"

import { useEffect } from "react"
import { Printer } from "lucide-react"

export function PrintControl() {
    useEffect(() => {
        // Auto-print on mount with a small delay to ensure rendering
        const timer = setTimeout(() => {
            window.print()
        }, 500)

        return () => clearTimeout(timer)
    }, [])

    return (
        <div className="print:hidden mb-4 flex justify-between items-center bg-gray-100 p-2 rounded border border-gray-200">
            <button
                onClick={() => window.print()}
                className="bg-blue-600 text-white px-4 py-2 rounded flex items-center gap-2 hover:bg-blue-700 transition-colors shadow-sm font-sans text-sm font-medium"
            >
                <Printer size={16} />
                Imprimir Novamente
            </button>
            <span className="text-xs text-gray-500 font-sans">
                Para ajustar margens, configure a escala de impressão.
            </span>
        </div>
    )
}
