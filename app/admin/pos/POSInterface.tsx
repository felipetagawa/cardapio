"use client"

import { Product } from "@prisma/client"
import { useState } from "react"
import { toast } from "react-toastify"
import { Trash2 } from "lucide-react"
import AddressAutocomplete from "../../components/AddressAutocomplete"

export default function POSInterface({ products }: { products: Product[] }) {
    const [cart, setCart] = useState<{ product: Product, quantity: number }[]>([])
    const [customerName, setCustomerName] = useState("")
    const [customerPhone, setCustomerPhone] = useState("")
    const [address, setAddress] = useState("")
    const [number, setNumber] = useState("")
    const [complement, setComplement] = useState("")
    const [paymentMethod, setPaymentMethod] = useState("")
    const [changeFor, setChangeFor] = useState("")
    const [searchTerm, setSearchTerm] = useState("")

    const filteredProducts = products.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.category.toLowerCase().includes(searchTerm.toLowerCase())
    )

    const addToCart = (product: Product) => {
        setCart(prev => {
            const existing = prev.find(i => i.product.id === product.id)
            if (existing) {
                return prev.map(i => i.product.id === product.id ? { ...i, quantity: i.quantity + 1 } : i)
            }
            return [...prev, { product, quantity: 1 }]
        })
    }

    const removeFromCart = (id: number) => {
        setCart(prev => prev.filter(i => i.product.id !== id))
    }

    const total = cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0)

    const handleFinish = async () => {
        if (cart.length === 0) return

        try {
            const fullAddress = [address, number, complement].filter(Boolean).join(", ")

            const response = await fetch("/api/orders", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    items: cart.map(i => ({ id: i.product.id, name: i.product.name, price: i.product.price, quantity: i.quantity })),
                    total,
                    customerName: customerName || "Balcão (POS)",
                    customerPhone,
                    address: fullAddress,
                    paymentMethod: paymentMethod || "Não informado",
                    changeFor: paymentMethod === "Dinheiro" && changeFor ? parseFloat(changeFor) : undefined,
                    source: "POS"
                })
            })

            if (!response.ok) throw new Error("Failed")

            toast.success("Pedido Salvo!")
            setCart([])
            setCustomerName("")
            setCustomerPhone("")
            setAddress("")
            setNumber("")
            setComplement("")
            setPaymentMethod("")
            setChangeFor("")
        } catch (error) {
            toast.error("Erro ao salvar")
        }
    }

    return (
        <div className="flex flex-col md:flex-row gap-4 h-[calc(100vh-100px)]">
            {/* Product Grid */}
            <div className="flex-1 overflow-y-auto pr-2">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="font-bold">Produtos ({filteredProducts.length})</h2>
                    <input
                        type="text"
                        placeholder="Buscar produto..."
                        className="border p-2 rounded w-1/2"
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        autoFocus
                    />
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                    {filteredProducts.map(p => (
                        <button
                            key={p.id}
                            onClick={() => addToCart(p)}
                            className="bg-white p-3 rounded shadow hover:bg-green-50 text-left border border-gray-100"
                        >
                            <div className="font-bold text-sm truncate">{p.name}</div>
                            <div className="text-xs text-gray-500">{p.category}</div>
                            <div className="font-bold text-green-600 mt-1">R$ {p.price.toFixed(2)}</div>
                        </button>
                    ))}
                    {filteredProducts.length === 0 && (
                        <p className="col-span-full text-gray-500 text-center py-4">Nenhum produto encontrado.</p>
                    )}
                </div>
            </div>

            {/* Cart Sidebar */}
            <div className="w-full md:w-96 bg-white rounded shadow p-4 flex flex-col">
                <h2 className="font-bold text-xl mb-4 border-b pb-2">Novo Pedido</h2>

                <div className="space-y-2 mb-4">
                    <input
                        className="w-full border p-2 rounded text-sm"
                        placeholder="Nome do Cliente (Opcional)"
                        value={customerName}
                        onChange={e => setCustomerName(e.target.value)}
                    />
                    <input
                        className="w-full border p-2 rounded text-sm"
                        placeholder="Telefone do Cliente"
                        value={customerPhone}
                        onChange={e => setCustomerPhone(e.target.value)}
                    />
                    <AddressAutocomplete
                        value={address}
                        onChange={setAddress}
                        placeholder="Rua/Avenida"
                        className="w-full border p-2 rounded text-sm"
                    />
                    <input
                        className="w-full border p-2 rounded text-sm"
                        placeholder="Número"
                        value={number}
                        onChange={e => setNumber(e.target.value)}
                    />
                    <input
                        className="w-full border p-2 rounded text-sm"
                        placeholder="Complemento (Apto, Bloco, etc)"
                        value={complement}
                        onChange={e => setComplement(e.target.value)}
                    />
                </div>

                <div className="mb-4">
                    <label className="block mb-2 text-sm font-medium">Forma de Pagamento</label>
                    <div className="grid grid-cols-2 gap-2">
                        {["Crédito", "Débito", "Dinheiro", "PIX"].map(method => (
                            <button
                                key={method}
                                type="button"
                                onClick={() => setPaymentMethod(method)}
                                className={`p-2 rounded border text-xs font-medium ${paymentMethod === method
                                    ? "border-green-500 bg-green-50 text-green-700"
                                    : "border-gray-200 hover:border-gray-300"
                                    }`}
                            >
                                {method}
                            </button>
                        ))}
                    </div>

                    {paymentMethod === "Dinheiro" && (
                        <div className="mt-2">
                            <label className="block mb-1 text-xs font-medium">Troco para quanto?</label>
                            <input
                                type="number"
                                value={changeFor}
                                onChange={e => setChangeFor(e.target.value)}
                                className="w-full border p-2 rounded text-sm"
                                placeholder="Ex: 50.00"
                                step="0.01"
                            />
                            {changeFor && parseFloat(changeFor) > total && (
                                <p className="text-xs text-gray-600 mt-1">
                                    Troco: R$ {(parseFloat(changeFor) - total).toFixed(2)}
                                </p>
                            )}
                        </div>
                    )}
                </div>

                <div className="flex-1 overflow-y-auto mb-4">
                    {cart.map((item, idx) => (
                        <div key={idx} className="flex justify-between items-center mb-2 text-sm">
                            <div>
                                <span className="font-bold">{item.quantity}x</span> {item.product.name}
                                <div className="text-gray-500">R$ {item.product.price.toFixed(2)}</div>
                            </div>
                            <button onClick={() => removeFromCart(item.product.id)} className="text-red-500">
                                <Trash2 size={16} />
                            </button>
                        </div>
                    ))}
                </div>

                <div className="border-t pt-4">
                    <div className="flex justify-between text-xl font-bold mb-4">
                        <span>Total</span>
                        <span>R$ {total.toFixed(2)}</span>
                    </div>
                    <button
                        onClick={handleFinish}
                        disabled={cart.length === 0}
                        className="w-full bg-green-600 text-white font-bold py-3 rounded disabled:bg-gray-300"
                    >
                        Confirmar Pedido
                    </button>
                </div>
            </div>
        </div>
    )
}
