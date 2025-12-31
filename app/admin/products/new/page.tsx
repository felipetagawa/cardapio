import { ProductForm } from "../components/ProductForm"

export default function NewProductPage() {
    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-6">Novo Produto</h1>
            <ProductForm />
        </div>
    )
}
