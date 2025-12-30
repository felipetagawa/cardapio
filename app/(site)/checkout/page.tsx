"use client"

import { useCart } from "../../context/CartContext"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "react-toastify"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import AddressAutocomplete from "../../components/AddressAutocomplete"

export default function Checkout() {
    const { cart, total, clearCart } = useCart()
    const [address, setAddress] = useState("")
    const [number, setNumber] = useState("")
    const [complement, setComplement] = useState("")
    const [name, setName] = useState("")
    const [phone, setPhone] = useState("")
    const [paymentMethod, setPaymentMethod] = useState("")
    const [changeFor, setChangeFor] = useState("")
    const router = useRouter()

    const handleFinish = async () => {
        if (cart.length === 0) return
        if (!name || !address) {
            toast.error("Preencha nome e endereço!")
            return
        }
        if (!paymentMethod) {
            toast.error("Selecione a forma de pagamento!")
            return
        }

        try {
            const fullAddress = [address, number, complement].filter(Boolean).join(", ")

            const response = await fetch("/api/orders", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    items: cart,
                    total,
                    customerName: name,
                    customerPhone: phone,
                    address: fullAddress,
                    paymentMethod,
                    changeFor: paymentMethod === "Dinheiro" && changeFor ? parseFloat(changeFor) : undefined,
                    source: "WEB"
                })
            })

            if (!response.ok) throw new Error("Erro ao salvar pedido")

            const order = await response.json()

            // Construct WhatsApp Message
            const cartItems = cart.map((item) => {
                return `* ${item.quantity}x ${item.name} | R$ ${item.price.toFixed(2)}`
            }).join("\n")

            const message = encodeURIComponent(
                `Ola, gostaria de fazer o pedido #${order.id}:\n\n${cartItems}\n\n*Total: R$ ${total.toFixed(2)}*\n\n*Cliente:* ${name}\n*Endereço:* ${fullAddress}`
            )

            // Clear cart locally
            clearCart()

            // Redirect to WhatsApp (Use user phone number or store number?)
            // Requirement: "chegar uma mensagem no WhatsApp informando que está confirmado"
            // Usually "Send to Store". Let's assume store number.
            // User didn't provide store number. I'll use a placeholder or ask.
            // For now: placeholder 5511999999999.
            const phoneDest = "5517992762512" // Placeholder, I should ask user or env var.

            window.location.href = `https://wa.me/${phoneDest}?text=${message}`

        } catch (e) {
            console.error(e)
            toast.error("Erro ao finalizar. Tente novamente.")
        }
    }

    if (cart.length === 0) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center">
                <h2 className="text-2xl font-bold">Seu carrinho está vazio</h2>
                <Link href="/" className="mt-4 bg-red-500 text-white px-4 py-2 rounded">
                    Voltar ao Menu
                </Link>
            </div>
        )
    }

    return (
        <div className="max-w-m mx-auto p-4 min-h-screen">
            <header className="mb-6">
                <Link href="/" className="flex items-center gap-2 font-bold mb-4">
                    <ArrowLeft /> Voltar
                </Link>
                <h1 className="text-2xl font-bold">Confirmar Pedido</h1>
            </header>

            <div className="bg-white p-4 rounded shadow mb-6">
                <h2 className="font-bold text-lg mb-2">Itens</h2>
                {cart.map(item => (
                    <div key={item.id} className="flex justify-between border-b py-2">
                        <div>
                            <p>{item.quantity}x {item.name}</p>
                            <p className="text-sm text-gray-500">R$ {item.price.toFixed(2)}</p>
                        </div>
                        <p>R$ {(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                ))}
                <div className="flex justify-between font-bold text-xl mt-4">
                    <span>Total:</span>
                    <span>R$ {total.toFixed(2)}</span>
                </div>
            </div>

            <div className="bg-white p-4 rounded shadow mb-6">
                <h2 className="font-bold text-lg mb-2">Seus Dados</h2>

                <label className="block mb-2">Nome</label>
                <input
                    type="text"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    className="w-full border p-2 rounded mb-4"
                    placeholder="Seu nome"
                />

                <label className="block mb-2">Telefone (WhatsApp)</label>
                <input
                    type="text"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    className="w-full border p-2 rounded mb-4"
                    placeholder="(11) 99999-9999"
                />

                <label className="block mb-2">Endereço de Entrega</label>
                <AddressAutocomplete
                    value={address}
                    onChange={setAddress}
                    placeholder="Rua/Avenida"
                    className="w-full border p-2 rounded mb-4"
                />

                <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                        <label className="block mb-2">Número</label>
                        <input
                            type="text"
                            value={number}
                            onChange={e => setNumber(e.target.value)}
                            className="w-full border p-2 rounded"
                            placeholder="Nº"
                        />
                    </div>
                    <div>
                        <label className="block mb-2">Complemento</label>
                        <input
                            type="text"
                            value={complement}
                            onChange={e => setComplement(e.target.value)}
                            className="w-full border p-2 rounded"
                            placeholder="Apto, Bloco, etc"
                        />
                    </div>
                </div>
            </div>

            <div className="bg-white p-4 rounded shadow mb-6">
                <h2 className="font-bold text-lg mb-2">Forma de Pagamento</h2>
                <div className="grid grid-cols-2 gap-3">
                    {["Crédito", "Débito", "Dinheiro", "PIX"].map(method => (
                        <button
                            key={method}
                            type="button"
                            onClick={() => setPaymentMethod(method)}
                            className={`p-3 rounded border-2 font-medium transition-all ${paymentMethod === method
                                ? "border-green-500 bg-green-50 text-green-700"
                                : "border-gray-200 hover:border-gray-300"
                                }`}
                        >
                            {method}
                        </button>
                    ))}
                </div>

                {paymentMethod === "Dinheiro" && (
                    <div className="mt-4">
                        <label className="block mb-2 font-medium">Troco para quanto?</label>
                        <input
                            type="number"
                            value={changeFor}
                            onChange={e => setChangeFor(e.target.value)}
                            className="w-full border p-2 rounded"
                            placeholder="Ex: 50.00"
                            step="0.01"
                        />
                        {changeFor && parseFloat(changeFor) > total && (
                            <p className="text-sm text-gray-600 mt-1">
                                Troco: R$ {(parseFloat(changeFor) - total).toFixed(2)}
                            </p>
                        )}
                    </div>
                )}
            </div>

            <button
                onClick={handleFinish}
                className="w-full bg-green-500 text-white font-bold py-3 rounded text-lg"
            >
                Finalizar no WhatsApp
            </button>

        </div>
    )
}
