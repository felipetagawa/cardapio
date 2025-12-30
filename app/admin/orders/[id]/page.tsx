import prisma from "@/lib/prisma"
import { notFound } from "next/navigation"

interface OrderPageProps {
    params: { id: string }
}

export default async function OrderPrintPage({ params }: OrderPageProps) {
    const id = parseInt(params.id)
    if (isNaN(id)) return notFound()

    const order = await prisma.order.findUnique({
        where: { id },
        include: { items: { include: { product: true } } }
    })

    if (!order) return notFound()

    return (
        <div className="max-w-[80mm] mx-auto bg-white p-2 text-black font-mono text-xs">
            {/* Auto print script */}
            <script dangerouslySetInnerHTML={{ __html: `window.print()` }} />

            <div className="text-center border-b pb-2 mb-2 border-black border-dashed">
                <h1 className="font-bold text-lg">Japa Pastel</h1>
                <p>CNPJ: 00.000.000/0000-00</p>
                <p>Pedido #{order.id}</p>
                <p>{order.createdAt.toLocaleTimeString()}</p>
            </div>

            <div className="mb-2">
                <p>Cliente: {order.customerName || "Consumidor"}</p>
                {order.address && <p>End: {order.address}</p>}
                <p>Tel: {order.customerPhone || "-"}</p>
            </div>

            <table className="w-full mb-2">
                <thead>
                    <tr className="border-b border-black border-dashed">
                        <th className="text-left">Qtd</th>
                        <th className="text-left">Item</th>
                        <th className="text-right">Vl.</th>
                    </tr>
                </thead>
                <tbody>
                    {order.items.map(item => (
                        <tr key={item.id}>
                            <td>{item.quantity}x</td>
                            <td>{item.product.name}</td>
                            <td className="text-right">{item.price.toFixed(2)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <div className="border-t border-black border-dashed pt-2 font-bold text-right text-sm">
                TOTAL: R$ {order.total.toFixed(2)}
            </div>

            <div className="border-t border-black border-dashed pt-2 mt-2 text-center">
                <p className="font-bold">PAGAMENTO: {order.paymentMethod || "Não informado"}</p>
                {order.changeFor && order.paymentMethod === "Dinheiro" && (
                    <div className="mt-1">
                        <p>Dinheiro: R$ {order.changeFor.toFixed(2)}</p>
                        <p>Troco: R$ {(order.changeFor - order.total).toFixed(2)}</p>
                    </div>
                )}
            </div>

            <div className="text-center mt-4 text-[10px]">
                Desenvolvido por JapaSystem
            </div>

            <style>{`
         @page { size: auto; margin: 0; }
         body { margin: 0; }
       `}</style>
        </div>
    )
}
