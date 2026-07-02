import Link from "next/link";
import { SunIcon } from "@/components/ui/SunIcon";

export default function ObrigadoPage() {
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
        <div className="w-full max-w-[460px] text-center">
          <SunIcon size={44} className="text-sol mx-auto mb-6" />

          <h1 className="font-serif italic text-[clamp(34px,7vw,56px)] leading-[1] text-cafe mb-4">
            Recebemos seu<br />
            <span className="text-sol">cadastro.</span>
          </h1>

          <p className="text-[15px] text-cafe-2 leading-relaxed mb-6">
            Assim que seu pagamento for confirmado, liberamos seu acesso ao
            Mentor IA e enviamos um e-mail com o link para você{" "}
            <strong className="text-cafe font-medium">definir sua senha</strong>.
            Isso costuma levar poucas horas.
          </p>

          <div className="rounded-2xl border border-sol/25 bg-sol/5 p-5 text-[13px] text-cafe leading-relaxed mb-8">
            Use sempre o <strong className="font-medium">mesmo e-mail</strong> do
            cadastro e do checkout da Hotmart — é ele que vincula o pagamento ao
            seu acesso.
          </div>

          <p className="text-[13px] text-cafe-3 leading-relaxed">
            Já recebeu o e-mail?{" "}
            <Link href="/login" className="text-sol hover:underline">
              Entrar no mentor
            </Link>
            <br />
            Alguma dúvida?{" "}
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
