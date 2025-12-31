import { Header } from "../components/Header"
import { Footer } from "../components/Footer"

export default function SiteLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen pb-20 relative bg-zinc-900 text-gray-100">
            {/* pb-20 to make space for fixed footer */}
            <Header />
            {children}
            <Footer />

            {/* Admin Access Link */}
            <a
                href="/login"
                className="fixed bottom-2 right-2 text-xs text-gray-400 hover:text-gray-600 bg-white px-2 py-1 rounded shadow-sm z-50"
            >
                Admin
            </a>
        </div>
    )
}
