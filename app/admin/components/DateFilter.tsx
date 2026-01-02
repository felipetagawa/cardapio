"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { useState, useEffect } from "react"
import { Calendar, Filter } from "lucide-react"

export default function DateFilter() {
    const router = useRouter()
    const searchParams = useSearchParams()

    const [type, setType] = useState("today") // today | period
    const [startDate, setStartDate] = useState("")
    const [endDate, setEndDate] = useState("")

    useEffect(() => {
        const start = searchParams.get("startDate")
        const end = searchParams.get("endDate")
        if (start && end) {
            setType("period")
            setStartDate(start.split("T")[0])
            setEndDate(end.split("T")[0])
        }
    }, [searchParams])

    const handleFilter = () => {
        const params = new URLSearchParams()

        let startIso, endIso

        if (type === "today") {
            const today = new Date()
            today.setHours(0, 0, 0, 0)
            startIso = today.toISOString()

            const tomorrow = new Date(today)
            tomorrow.setDate(tomorrow.getDate() + 1)
            endIso = tomorrow.toISOString()
        } else {
            if (!startDate || !endDate) return
            startIso = new Date(startDate).toISOString()
            const end = new Date(endDate)
            end.setHours(23, 59, 59, 999)
            endIso = end.toISOString()
        }

        params.set("startDate", startIso)
        params.set("endDate", endIso)

        router.push(`?${params.toString()}`)
    }

    return (
        <div className="bg-white p-4 rounded shadow mb-6">
            <div className="flex flex-col gap-4">
                {/* Header Row */}
                <div className="flex gap-2 items-center">
                    <Filter size={20} className="text-gray-500" />
                    <span className="font-bold">Filtros:</span>
                </div>

                {/* Filter Controls */}
                <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
                    <select
                        value={type}
                        onChange={(e) => setType(e.target.value)}
                        className="border p-2 rounded w-full sm:w-auto"
                    >
                        <option value="today">Hoje</option>
                        <option value="period">Período</option>
                    </select>

                    {type === "period" && (
                        <div className="flex flex-col sm:flex-row gap-2 items-stretch sm:items-center w-full sm:w-auto">
                            <input
                                type="date"
                                value={startDate}
                                onChange={e => setStartDate(e.target.value)}
                                className="border p-2 rounded w-full sm:w-auto"
                            />
                            <span className="hidden sm:inline text-gray-500">até</span>
                            <input
                                type="date"
                                value={endDate}
                                onChange={e => setEndDate(e.target.value)}
                                className="border p-2 rounded w-full sm:w-auto"
                            />
                        </div>
                    )}

                    <button
                        onClick={handleFilter}
                        className="bg-blue-600 text-white px-4 py-2 rounded flex items-center justify-center gap-2 hover:bg-blue-700 w-full sm:w-auto"
                    >
                        <Calendar size={16} /> Aplicar
                    </button>
                </div>
            </div>
        </div>
    )
}
