import Image from "next/image"

export function Header() {
    return (
        <header className="w-full h-[420px] bg-zinc-900 bg-cover bg-center" style={{ backgroundImage: "url('/assets/bg.png')" }}>
            {/* Note: bg-home custom class not ported yet, using inline style or standard class if possible. 
          The legacy used bg-home which likely had a url in CSS. I'll need to check legacy css or just use a placeholder/color. 
          For now, I'll assume bg-zinc-900 is fine or add a valid image path if known. 
          The legacy HTML had 'bg-home' in class.
      */}
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
