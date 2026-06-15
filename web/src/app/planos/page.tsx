import Link from "next/link";
import { SunIcon } from "@/components/ui/SunIcon";

// Substitua pelas URLs reais dos produtos na Hotmart após criação
const HOTMART_BASICO = "#em-breve";
const HOTMART_CLUBE = "#em-breve";
const HOTMART_PREMIUM = "#em-breve";

const WHATSAPP = "https://wa.me/5511974668867";

export default function PlanosPage() {
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

      <main className="flex-1 px-5 md:px-12 py-12 md:py-20">
        <div className="max-w-[1100px] mx-auto">
          {/* Header */}
          <div className="mb-10 md:mb-14">
            <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-brasa mb-4">
              Escolha seu plano
            </p>
            <h1 className="font-serif italic text-[clamp(36px,6vw,72px)] leading-[1] text-cafe mb-3">
              Quanto você quer<br />
              <span className="text-sol">evoluir como líder?</span>
            </h1>
            <p className="text-[15px] md:text-[17px] text-cafe-2 leading-relaxed max-w-xl">
              Escolha o plano, finalize o pagamento na Hotmart e o acesso é liberado automaticamente.
            </p>
          </div>

          {/* Plans grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5 mb-6">

            {/* Plano Básico */}
            <div className="relative rounded-[1.75rem] border border-[var(--linha)] bg-white p-7 md:p-8 flex flex-col">
              <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-cafe-3 mb-4">
                Plano Básico
              </p>
              <div className="mb-5">
                <span className="font-serif italic text-[clamp(36px,5vw,52px)] leading-none text-cafe">
                  R$197
                </span>
                <span className="block text-[13px] text-cafe-3 mt-1">
                  ou 6× de R$39,90
                </span>
              </div>
              <ul className="space-y-3 flex-1 mb-7">
                {[
                  "Videoaulas completas para os 6 primeiros meses como Líder",
                  "30 scripts prontos para conversas difíceis",
                  "Mentor de Bolso IA 24h por 6 meses",
                ].map((item) => (
                  <li key={item} className="flex gap-2.5 text-[13px] md:text-[14px] text-cafe-2 leading-snug">
                    <span className="text-sol shrink-0 mt-0.5">✱</span>
                    {item}
                  </li>
                ))}
              </ul>
              <a
                href={HOTMART_BASICO}
                target="_blank"
                rel="noopener noreferrer"
                className="block text-center bg-sol text-creme font-mono text-[11px] uppercase tracking-[0.18em] py-3.5 rounded-full hover:bg-sol-soft transition-colors"
              >
                Escolher Básico →
              </a>
            </div>

            {/* Oferta Complementar */}
            <div className="relative rounded-[1.75rem] border border-[var(--linha)] bg-white p-7 md:p-8 flex flex-col">
              <div className="absolute top-5 right-5">
                <span className="font-mono text-[9px] uppercase tracking-[0.14em] bg-amanhecer/20 text-amanhecer px-2.5 py-1 rounded-full">
                  Complementar
                </span>
              </div>
              <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-cafe-3 mb-4">
                Clube do Novo Líder
              </p>
              <div className="mb-5">
                <span className="font-serif italic text-[clamp(36px,5vw,52px)] leading-none text-cafe">
                  R$39,90
                </span>
                <span className="block text-[13px] text-cafe-3 mt-1">
                  por mês · cancele quando quiser
                </span>
              </div>
              <ul className="space-y-3 flex-1 mb-7">
                {[
                  "Tudo do Plano Básico",
                  "Mentor IA após os 6 meses iniciais",
                  "Novos materiais e atualizações mensais",
                  "Sem fidelidade — cancela sem custo",
                ].map((item) => (
                  <li key={item} className="flex gap-2.5 text-[13px] md:text-[14px] text-cafe-2 leading-snug">
                    <span className="text-sol shrink-0 mt-0.5">✱</span>
                    {item}
                  </li>
                ))}
              </ul>
              <a
                href={HOTMART_CLUBE}
                target="_blank"
                rel="noopener noreferrer"
                className="block text-center border border-cafe/20 text-cafe font-mono text-[11px] uppercase tracking-[0.18em] py-3.5 rounded-full hover:bg-cafe/5 transition-colors"
              >
                Escolher Clube →
              </a>
            </div>

            {/* Premium */}
            <div className="relative rounded-[1.75rem] bg-cafe text-creme p-7 md:p-8 flex flex-col overflow-hidden">
              <div className="absolute right-[-50px] top-[-50px] opacity-15">
                <SunIcon size={220} className="text-sol" />
              </div>
              <div className="absolute top-5 right-5">
                <span className="font-mono text-[9px] uppercase tracking-[0.14em] bg-sol/20 text-amanhecer px-2.5 py-1 rounded-full">
                  Premium
                </span>
              </div>
              <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-amanhecer mb-4 relative">
                Clube Premium
              </p>
              <div className="mb-5 relative">
                <span className="font-serif italic text-[clamp(36px,5vw,52px)] leading-none text-creme">
                  R$139,90
                </span>
                <span className="block text-[13px] text-creme/50 mt-1">
                  por mês · cancele quando quiser
                </span>
              </div>
              <ul className="space-y-3 flex-1 mb-7 relative">
                {[
                  "Tudo do Clube do Novo Líder",
                  "Mentoria ao vivo em grupo — 2h/mês",
                  "1× por mês, com pauta real dos membros",
                  "Sem fidelidade — cancela sem custo",
                ].map((item) => (
                  <li key={item} className="flex gap-2.5 text-[13px] md:text-[14px] text-creme/80 leading-snug">
                    <span className="text-sol shrink-0 mt-0.5">✱</span>
                    {item}
                  </li>
                ))}
              </ul>
              <a
                href={HOTMART_PREMIUM}
                target="_blank"
                rel="noopener noreferrer"
                className="relative block text-center bg-sol text-creme font-mono text-[11px] uppercase tracking-[0.18em] py-3.5 rounded-full hover:bg-sol-soft transition-colors"
              >
                Escolher Premium →
              </a>
            </div>
          </div>

          {/* E-mail instruction */}
          <div className="rounded-[1.75rem] border border-sol/25 bg-sol/5 p-6 md:p-7 flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="shrink-0 w-9 h-9 rounded-full bg-sol/15 flex items-center justify-center">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#E8552D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
            </div>
            <p className="text-[14px] text-cafe leading-relaxed">
              <strong className="font-medium">Use o mesmo e-mail da sua conta Google no checkout da Hotmart.</strong>{" "}
              É ele que vincula o pagamento ao seu acesso — o mentor é liberado automaticamente após a confirmação.
            </p>
          </div>

          {/* Support link */}
          <p className="text-center text-[12px] text-cafe-3 mt-6">
            E-mails diferentes ou dúvidas no pagamento?{" "}
            <a
              href={WHATSAPP}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sol hover:underline"
            >
              Fale pelo WhatsApp
            </a>
          </p>
        </div>
      </main>
    </div>
  );
}
