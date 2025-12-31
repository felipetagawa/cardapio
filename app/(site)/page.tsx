import prisma from "@/lib/prisma"
import { Menu } from "../components/Menu"
import { Footer } from "../components/Footer"

// Revalidate every 60 seconds (SSG with ISR) or use dynamic rendering?
// Since prices change rarely, 60s is fine. Or 0 for dev.
export const revalidate = 0

export default async function Home() {
  const products = await prisma.product.findMany({
    include: { category: true }
  })

  const extras = await prisma.extra.findMany({
    include: { category: true }
  })

  return (
    <main className="min-h-screen">
      <Menu products={products} extras={extras} />
      <Footer />
    </main>
  )
}
