import prisma from "@/lib/prisma"
import Link from "next/link"
import { Printer } from "lucide-react"
import DateFilter from "./components/DateFilter"

export const revalidate = 0 // Dynamic

interface AdminDashboardProps {
    searchParams: {
        startDate?: string
        endDate?: string
    }
}

export default async function AdminDashboard({ searchParams }: AdminDashboardProps) {
    // Default to today
    const now = new Date()
    const startOfToday = new Date(now.setHours(0, 0, 0, 0))
    const endOfToday = new Date(now.setHours(23, 59, 59, 999))

    const startDate = searchParams.startDate ? new Date(searchParams.startDate) : startOfToday
    const endDate = searchParams.endDate ? new Date(searchParams.endDate) : endOfToday

    const orders = await prisma.order.findMany({
        orderBy: { createdAt: "desc" },
        where: {
            createdAt: {
                gte: startDate,
                lte: endDate
            }
        },
        include: { items: true },
        // Remove 'take: 50' to allow accurate totals for the period
    })

    const totalRevenue = orders.reduce((acc, order) => acc + order.total, 0)

    return (
        <div>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                <h2 className="text-2xl font-bold">Pedidos Recentes</h2>
                <Link
                    href="/admin/products"
                    className="bg-purple-600 text-white px-4 py-2 rounded text-sm hover:bg-purple-700 w-full md:w-auto text-center"
                >
                    Gerenciar Produtos
                </Link>
            </div>

            <DateFilter />

            {/* Total Indicator */}
            <div className="bg-white p-4 rounded shadow mb-6 border-l-4 border-green-500">
                <p className="text-gray-500 text-sm">Total do Período</p>
                <p className="text-2xl font-bold text-green-700">
                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalRevenue)}
                </p>
                <p className="text-xs text-gray-400">
                    {orders.length} pedidos encontrados
                </p>
            </div>

            <div className="bg-white rounded shadow text-sm md:text-base">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-100 border-b">
                            <tr>
                                <th className="p-3">#</th>
                                <th className="p-3">Data</th>
                                <th className="p-3">Cliente</th>
                                <th className="p-3">Total</th>
                                <th className="p-3">Status</th>
                                <th className="p-3">Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="p-8 text-center text-gray-500">
                                        Nenhum pedido encontrado neste período.
                                    </td>
                                </tr>
                            ) : (
                                orders.map(order => (
                                    <tr key={order.id} className="border-b hover:bg-gray-50">
                                        <td className="p-3 font-bold">{order.id}</td>
                                        <td className="p-3">{order.createdAt.toLocaleTimeString('pt-BR')}</td>
                                        <td className="p-3">
                                            <p className="font-bold">{order.customerName || "Balcão"}</p>
                                            <p className="text-xs text-gray-500">{order.address ? "Entrega" : "Retirada"}</p>
                                        </td>
                                        <td className="p-3 font-bold text-green-600">
                                            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(order.total)}
                                        </td>
                                        <td className="p-3">
                                            <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs">
                                                {order.status}
                                            </span>
                                        </td>
                                        <td className="p-3">
                                            <Link
                                                href={`/admin/orders/${order.id}`}
                                                className="bg-blue-500 text-white px-3 py-1 rounded text-xs flex items-center gap-1 w-fit"
                                            >
                                                <Printer size={14} /> Imprimir
                                            </Link>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}
