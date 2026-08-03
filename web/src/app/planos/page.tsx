import Link from "next/link";
import { SunIcon } from "@/components/ui/SunIcon";
import { getPlanosConteudo } from "@/lib/config";
import type { CardPlano } from "@/lib/planos-conteudo";

// Todos os planos passam pelo /cadastro (captura o lead) antes do Hotmart.
// O texto vem do painel admin (app_config), então a página é renderizada a cada
// visita — uma edição no /admin aparece aqui na hora.
export const dynamic = "force-dynamic";

// O visual de cada card é fixo (só o texto é editável no admin).
const ESTILOS = [
  {
    card: "relative rounded-[1.75rem] border border-[var(--linha)] bg-white p-7 md:p-8 flex flex-col",
    etiqueta: "bg-sol/15 text-brasa",
    nome: "text-cafe-3",
    preco: "text-cafe",
    precoDetalhe: "text-cafe-3",
    descricao: "text-cafe-2",
    item: "text-cafe-2",
    cta: "bg-sol text-creme hover:bg-sol-soft",
    sol: false,
  },
  {
    card: "relative rounded-[1.75rem] border border-[var(--linha)] bg-white p-7 md:p-8 flex flex-col",
    etiqueta: "bg-amanhecer/20 text-amanhecer",
    nome: "text-cafe-3",
    preco: "text-cafe",
    precoDetalhe: "text-cafe-3",
    descricao: "text-cafe-2",
    item: "text-cafe-2",
    cta: "border border-cafe/20 text-cafe hover:bg-cafe/5",
    sol: false,
  },
  {
    card: "relative rounded-[1.75rem] bg-cafe text-creme p-7 md:p-8 flex flex-col overflow-hidden",
    etiqueta: "bg-sol/20 text-amanhecer",
    nome: "text-amanhecer",
    preco: "text-creme",
    precoDetalhe: "text-creme/60",
    descricao: "text-creme/70",
    item: "text-creme/80",
    cta: "bg-sol text-creme hover:bg-sol-soft",
    sol: true,
  },
] as const;

export default async function PlanosPage() {
  const conteudo = await getPlanosConteudo();

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
              {conteudo.chapeu}
            </p>
            <h1 className="font-serif italic text-[clamp(36px,6vw,72px)] leading-[1] text-cafe mb-3">
              {conteudo.tituloLinha1}
              <br />
              <span className="text-sol">{conteudo.tituloLinha2}</span>
            </h1>
            <p className="text-[15px] md:text-[17px] text-cafe-2 leading-relaxed max-w-xl">
              {conteudo.subtitulo}
            </p>
          </div>

          {/* Plans grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5 mb-6">
            {conteudo.cards.map((card, i) => (
              <Card key={card.chave} card={card} estilo={ESTILOS[i]} />
            ))}
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
              <strong className="font-medium">{conteudo.avisoDestaque}</strong>{" "}
              {conteudo.avisoTexto}
            </p>
          </div>

          {/* Support link */}
          <p className="text-center text-[12px] text-cafe-3 mt-6">
            {conteudo.rodapePergunta}{" "}
            <a
              href={conteudo.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sol hover:underline"
            >
              {conteudo.rodapeLink}
            </a>
          </p>
        </div>
      </main>
    </div>
  );
}

function Card({
  card,
  estilo,
}: {
  card: CardPlano;
  estilo: (typeof ESTILOS)[number];
}) {
  return (
    <div className={estilo.card}>
      {estilo.sol && (
        <div className="absolute right-[-50px] top-[-50px] opacity-15">
          <SunIcon size={220} className="text-sol" />
        </div>
      )}
      {card.etiqueta && (
        <div className="absolute top-5 right-5">
          <span
            className={`font-mono text-[9px] uppercase tracking-[0.14em] px-2.5 py-1 rounded-full ${estilo.etiqueta}`}
          >
            {card.etiqueta}
          </span>
        </div>
      )}
      <p
        className={`font-mono text-[10px] uppercase tracking-[0.18em] mb-4 relative ${estilo.nome}`}
      >
        {card.nome}
      </p>
      <div className="mb-4 relative">
        <span
          className={`font-serif italic text-[clamp(36px,5vw,52px)] leading-none ${estilo.preco}`}
        >
          {card.preco}
        </span>
        {card.precoDetalhe && (
          <span className={`block text-[13px] mt-1 ${estilo.precoDetalhe}`}>
            {card.precoDetalhe}
          </span>
        )}
      </div>
      <p className={`text-[13px] leading-snug mb-5 relative ${estilo.descricao}`}>
        {card.descricao}
      </p>
      <ul className="space-y-3 flex-1 mb-7 relative">
        {card.itens.map((item) => (
          <li
            key={item}
            className={`flex gap-2.5 text-[13px] md:text-[14px] leading-snug ${estilo.item}`}
          >
            <span className="text-sol shrink-0 mt-0.5">✱</span>
            {item}
          </li>
        ))}
      </ul>
      <Link
        href={`/cadastro?plano=${card.chave}`}
        className={`relative block text-center font-mono text-[11px] uppercase tracking-[0.18em] py-3.5 rounded-full transition-colors ${estilo.cta}`}
      >
        {card.cta}
      </Link>
    </div>
  );
}
