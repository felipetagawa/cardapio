import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    // Clear existing data (optional)
    await prisma.orderItemExtra.deleteMany()
    await prisma.orderItem.deleteMany()
    await prisma.extra.deleteMany()
    await prisma.order.deleteMany()
    await prisma.product.deleteMany()
    await prisma.category.deleteMany()

    const catPasteis = await prisma.category.create({
        data: { name: 'Pastéis', order: 1 }
    })

    const catBebidas = await prisma.category.create({
        data: { name: 'Bebidas', order: 2 }
    })

    // Pasteis
    await prisma.product.createMany({
        data: [
            {
                name: 'Pastel de Carne',
                description: 'Carne moída temperada, azeitona e ovo.',
                price: 15.00,
                categoryId: catPasteis.id,
            },
            {
                name: 'Pastel de Queijo',
                description: 'Queijo mussarela derretido.',
                price: 14.00,
                categoryId: catPasteis.id,
            },
            {
                name: 'Pastel de Frango com Catupiry',
                description: 'Frango desfiado com catupiry.',
                price: 16.00,
                categoryId: catPasteis.id,
            },
            {
                name: 'Pastel Pizza',
                description: 'Queijo, presunto, tomate e orégano.',
                price: 15.00,
                categoryId: catPasteis.id,
            },
            {
                name: 'Pastel Especial Japa',
                description: 'Carne, queijo, bacon, milho e ovo.',
                price: 22.00,
                categoryId: catPasteis.id,
            },
            {
                name: 'Pastel Portuguesa',
                description: 'Queijo, presunto, ovo, cebola e ervilha.',
                price: 18.00,
                categoryId: catPasteis.id,
            },
        ]
    })

    // Extras for Pasteis
    await prisma.extra.createMany({
        data: [
            { name: 'Bacon', price: 4.00, categoryId: catPasteis.id },
            { name: 'Queijo', price: 3.00, categoryId: catPasteis.id },
            { name: 'Catupiry', price: 3.00, categoryId: catPasteis.id },
            { name: 'Azeitona', price: 2.00, categoryId: catPasteis.id },
            { name: 'Tomate', price: 2.00, categoryId: catPasteis.id },
        ]
    })

    // Bebidas
    await prisma.product.createMany({
        data: [
            {
                name: 'Coca Cola 2L',
                price: 12.00,
                categoryId: catBebidas.id,
            },
            {
                name: 'Guaraná Antarctica 2L',
                price: 10.00,
                categoryId: catBebidas.id,
            },
            {
                name: 'Coca Cola Lata 350ml',
                price: 6.00,
                categoryId: catBebidas.id,
            },
            {
                name: 'Água Mineral 500ml',
                price: 4.00,
                categoryId: catBebidas.id,
            },
        ]
    })

    console.log('Database seeded!')
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
