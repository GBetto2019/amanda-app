import Link from "next/link";
import { SunIcon } from "@/components/ui/SunIcon";
import { GoogleButton } from "@/components/ui/GoogleButton";

export default function EntrarPage() {
  return (
    <div className="min-h-[100dvh] bg-creme flex flex-col">
      <header className="px-5 md:px-12 h-14 flex items-center border-b border-[var(--linha-soft)]">
        <Link
          href="/"
          className="flex items-center gap-2.5 font-serif italic text-base text-cafe leading-none"
        >
          <SunIcon size={22} className="text-sol" />
          acordei, virei líder.
        </Link>
      </header>

      <div className="flex-1 flex items-center justify-center px-5 py-12">
        <div className="w-full max-w-[400px]">
          <SunIcon size={36} className="text-sol mb-6" />

          <h1 className="font-serif italic text-[clamp(36px,8vw,56px)] leading-[1] text-cafe mb-3">
            Bom dia.<br />
            <span className="text-sol">Líder.</span>
          </h1>

          <p className="text-[14px] md:text-[15px] text-cafe-2 leading-relaxed mb-8">
            Acesse o mentor com sua conta Google.
            Se for seu primeiro acesso, a conta é criada automaticamente.
          </p>

          <GoogleButton />

          <p className="text-center text-[12px] text-cafe-3 mt-6 leading-relaxed">
            Ao entrar, você concorda com os termos de uso.
            <br />
            Dúvidas?{" "}
            <a
              href="https://wa.me/5511974668867"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sol hover:underline"
            >
              Fale pelo WhatsApp
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
