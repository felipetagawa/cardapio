import Image from "next/image"

export function Header() {
    return (
        <header className="w-full h-[420px] bg-zinc-900 bg-cover bg-center">
            <div className="w-full h-full flex flex-col justify-center items-center bg-black/50">
                <Image
                    src="/assets/pastelLogo.jpg"
                    alt="Logo Japa Pastel"
                    width={128}
                    height={128}
                    className="w-32 h-32 rounded-full shadow-lg hover:scale-110 duration-200 object-cover"
                />
                <h1 className="text-4xl mt-4 mb-2 font-bold text-white">
                    Japa Pastel
                </h1>

                <span className="text-white font-medium">José Bonifácio - SP</span>

                <div className="bg-green-600 px-4 py-1 rounded-lg mt-5">
                    <span className="text-white font-medium">Quinta á Domingo - 18:00 as 23:00</span>
                </div>

            </div>
        </header>
    )
}
