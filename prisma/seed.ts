import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    const products = [
        { name: 'Pastel de Carne Moída', description: 'Carne moída temperada com cebola e salsinha.', price: 10.00, category: 'Carne Moída', image: '/assets/pastel.jpeg' },
        { name: 'Pastel de Frango com Catupiry', description: 'Frango desfiado com catupiry cremoso.', price: 12.00, category: 'Frango', image: '/assets/pastel.jpeg' },
        { name: 'Pastel de Carne Desfiada', description: 'Carne cozida e desfiada com temperos da casa.', price: 13.00, category: 'Carne Desfiada', image: '/assets/pastel.jpeg' },
        { name: 'Pastel de Pernil', description: 'Pernil desfiado e bem temperado.', price: 13.50, category: 'Pernil Desfiado', image: '/assets/pastel.jpeg' },
        { name: 'Pastel de Palmito', description: 'Recheio cremoso de palmito com catupiry.', price: 11.00, category: 'Palmito', image: '/assets/pastel.jpeg' },
        { name: 'Pastel Calabresa', description: 'Delicioso pastel recheado com calabresa', price: 14.00, category: 'Calabresa', image: '/assets/pastel.jpeg' },
        { name: 'Pastel Mussarela', description: 'Delicioso pastel recheado com mussarela derretida.', price: 14.00, category: 'Mussarela', image: '/assets/pastel.jpeg' },
        { name: 'Especial da Casa', description: 'Uma explosão de sabores: carne, queijo, ovo e azeitona.', price: 15.00, category: 'Pastel Especial', image: '/assets/pastel.jpeg' },
        { name: 'Pastel de Chocolate', description: 'Chocolate cremoso com massa crocante.', price: 12.00, category: 'Pastel Doce', image: '/assets/pastel.jpeg' },

        // Bebidas
        { name: 'Coca Cola lata', description: '350ml', price: 6.00, category: 'Refrigerantes', image: '/assets/refri-1.png' },
        { name: 'Guaraná Antártica lata', description: '350ml', price: 6.00, category: 'Refrigerantes', image: '/assets/refri-2.png' },
        { name: 'Coca Cola garrafa 2L', description: '2 Litros', price: 14.00, category: 'Refrigerantes', image: '/assets/traced-coca2l.png' },
        { name: 'Guaraná Antártica garrafa 2L', description: '2 Litros', price: 14.00, category: 'Refrigerantes', image: '/assets/guarana2ll.png' },
        { name: 'Coca Cola lata ZERO', description: '350ml Sem Açúcar', price: 6.00, category: 'Refrigerantes ZERO', image: '/assets/REFRIGERANTE-SEM-ACUCAR-COCA-COLA-LATA-350ML.png' },
        { name: 'Guaraná Antártica lata ZERO', description: '350ml Sem Açúcar', price: 6.00, category: 'Refrigerantes ZERO', image: '/assets/guarana-zero1-c3a6ab3aba47aa685916192134653022-1024-1024.png' },
        { name: 'Coca Cola garrafa 2L ZERO', description: '2 Litros Sem Açúcar', price: 14.00, category: 'Refrigerantes ZERO', image: '/assets/Refrigerante-CocaCola-sem-Acar-Pet-2L.png' },
        { name: 'Guaraná Antártica garrafa 2L ZERO', description: '2 Litros Sem Açúcar', price: 14.00, category: 'Refrigerantes ZERO', image: '/assets/Refrigerante-Zero-Acucar-Guarana-Antarctica--Garrafa-2l.png' },
    ]

    for (const p of products) {
        await prisma.product.create({
            data: p
        })
    }
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })
