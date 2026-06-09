import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { SunIcon } from "@/components/ui/SunIcon";
import { Card } from "@/components/ui/Card";

const personalityCards = [
  { num: "01", title: "Direta.", text: "Vai no ponto. Frase curta. Quem lê precisa entender de primeira — porque tem reunião em 10 minutos.", variant: "default" as const },
  { num: "02", title: "Leve.", text: "Liderança já pesa. A gente não pesa em cima. Conversa de café, não palestra de domingo.", variant: "default" as const },
  { num: "03", title: "Prática.", text: 'Termina cada orientação com "faz assim". Roteiro, exemplo, frase pronta. Aplicável na próxima 1:1.', variant: "default" as const },
  { num: "04", title: "Humana.", text: "A gente também travou na primeira 1:1. Ninguém aqui é coach perfeito. Erra junto e arruma junto.", variant: "cafe" as const },
  { num: "05", title: "Vida real corporativa.", text: "Open space barulhento. Slack travando. Chefe pedindo na sexta às 18h. Esse é o mundo. E aqui a gente fala dele.", variant: "sol" as const },
  { num: "06", title: "Sem papo de consultor.", text: "Sinergia, mindset, empoderar — fora. Combinado, feedback, clareza — dentro.", variant: "amber" as const },
];

const howItWorksSteps = [
  { num: "01", title: "Descreve a situação", text: "Fala como você falaria pra um amigo. O mentor faz 1–3 perguntas pra entender o contexto." },
  { num: "02", title: "Recebe o roteiro", text: "Cenário, causa, o que fazer, script pronto e o que evitar. Tudo na estrutura que funciona." },
  { num: "03", title: "Copia e usa", text: "O script fica em destaque, pronto pra copiar. Aplica na próxima reunião — é agora, não semana que vem." },
];

const bordoes = [
  { num: "01", text: '"O combinado salva o líder."', variant: "sol" as const },
  { num: "02", text: '"Liderança é conversa difícil bem feita."', variant: "amber" as const },
  { num: "03", text: '"Você não precisa improvisar liderança."', variant: "default" as const },
  { num: "04", text: '"Se você travou na conversa, você tá no lugar certo."', variant: "brasa" as const },
];

export default function Home() {
  return (
    <>
      <Header />

      <main>
        {/* ── HERO ── */}
        <section className="bg-creme pt-12 pb-16 md:pt-20 md:pb-28 lg:pt-24 lg:pb-32 px-5 md:px-12 overflow-hidden">
          <div className="max-w-[1320px] mx-auto">
            <div className="flex items-start justify-between mb-8 md:mb-14">
              <span className="font-mono text-[10px] md:text-[11px] uppercase tracking-[0.22em] text-brasa flex items-center gap-2.5 before:content-[''] before:w-4 md:before:w-6 before:h-px before:bg-current">
                Mentor do Novo Líder
              </span>
              <span className="font-mono text-[10px] md:text-[11px] uppercase tracking-[0.16em] text-cafe-3">v1.0 · 2026</span>
            </div>

            <h1 className="font-serif italic font-normal text-[clamp(52px,14vw,220px)] leading-[0.88] tracking-[-0.035em] text-cafe mb-6 md:mb-8">
              Acordei,<br />
              virei <span className="text-sol">líder</span>.
            </h1>

            <p className="font-serif italic text-[clamp(18px,3.5vw,40px)] text-cafe-2 leading-[1.2] max-w-2xl mb-10 md:mb-20">
              Liderança na prática<br />pra quem virou líder ontem.
            </p>

            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 md:gap-10">
              <div className="grid sm:grid-cols-2 gap-6 md:gap-10 max-w-2xl">
                <div>
                  <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-cafe-3">01 — Promessa</span>
                  <p className="text-sm text-cafe-2 leading-relaxed mt-2">
                    Te ajudar a liderar com segurança nos primeiros meses, com roteiro pronto e prática real.
                  </p>
                </div>
                <div>
                  <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-cafe-3">02 — Arquétipo</span>
                  <p className="text-sm text-cafe-2 leading-relaxed mt-2">
                    Mentora &amp; amiga experiente. Autoridade, mas sem ser distante. Sabe do que tá falando — e fala como gente.
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                <Link
                  href="/chat"
                  className="inline-flex items-center justify-center bg-sol text-creme font-mono text-[11px] uppercase tracking-[0.18em] px-6 py-4 rounded-full hover:bg-sol-soft transition-colors min-h-[48px]"
                >
                  Fala com o mentor →
                </Link>
                <a
                  href="#programa"
                  className="inline-flex items-center justify-center border border-cafe/20 text-cafe font-mono text-[11px] uppercase tracking-[0.18em] px-6 py-4 rounded-full hover:bg-cafe/5 transition-colors min-h-[48px]"
                >
                  Ver programa
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* ── MARQUEE ── */}
        <div className="border-t border-b border-[var(--linha)] py-5 md:py-7 bg-creme overflow-hidden">
          <div className="flex gap-10 md:gap-14 whitespace-nowrap animate-[marquee_32s_linear_infinite]">
            {[1, 2].map((i) => (
              <div key={i} className="flex gap-10 md:gap-14 shrink-0">
                {['"O combinado salva o líder."', '"Liderança é conversa difícil bem feita."', '"Você não precisa improvisar liderança."'].map((text) => (
                  <span key={text} className="font-serif italic text-[clamp(28px,5vw,72px)] text-cafe inline-flex items-center gap-10 md:gap-14">
                    {text}
                    <span className="text-sol not-italic text-xl md:text-2xl">✱</span>
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* ── MANIFESTO ── */}
        <section id="manifesto" className="py-16 md:py-28 lg:py-40 px-5 md:px-12">
          <div className="max-w-[1320px] mx-auto">
            <p className="font-mono text-[10px] md:text-[11px] uppercase tracking-[0.22em] text-brasa mb-8 md:mb-14">01 — Manifesto</p>
            <div className="grid md:grid-cols-2 gap-10 md:gap-20 items-start">
              <h2 className="font-serif italic text-[clamp(32px,5.5vw,80px)] leading-[1] tracking-[-0.02em] text-cafe m-0">
                Ninguém te avisou que liderar é{" "}
                <span className="text-sol not-italic">conversa difícil bem feita</span>{" "}
                — e mais um monte de pequenos combinados.
              </h2>
              <div className="space-y-5 md:space-y-6">
                <p className="text-[17px] md:text-[22px] leading-[1.55] text-cafe-2 font-light">
                  A gente acredita que liderança não é vocação, nem dom, nem talento de quem nasceu com carisma. É{" "}
                  <strong className="text-cafe font-medium">prática</strong>. É repetir conversa, ajustar combinado, dar feedback, sustentar postura.
                </p>
                <p className="text-[17px] md:text-[22px] leading-[1.55] text-cafe-2 font-light">
                  A gente fala com quem virou líder na sexta passada e tem reunião 1:1 na segunda. Sem teoria demais. Sem mindset disruptivo. Sem palestra motivacional.
                </p>
                <p className="text-[17px] md:text-[22px] leading-[1.55] text-cafe-2 font-light">
                  Roteiro pronto. Exemplo do dia a dia. Frase pra usar.{" "}
                  <em className="font-serif text-sol">Faz assim:</em>
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ── PERSONALIDADE ── */}
        <section className="bg-linho py-16 md:py-28 lg:py-40 px-5 md:px-12">
          <div className="max-w-[1320px] mx-auto">
            <p className="font-mono text-[10px] md:text-[11px] uppercase tracking-[0.22em] text-brasa mb-8 md:mb-14">02 — Personalidade</p>
            <h2 className="font-serif italic text-[clamp(32px,5.5vw,80px)] leading-[1] tracking-[-0.02em] text-cafe mb-10 md:mb-16">
              Como o mentor <span className="text-sol">é</span>.
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
              {personalityCards.map((card) => (
                <Card key={card.num} variant={card.variant} className="hover:-translate-y-1 transition-transform duration-300">
                  <p className="font-mono text-[11px] tracking-[0.16em] opacity-40 mb-3 md:mb-4">{card.num}</p>
                  <h3 className="font-serif italic text-[clamp(24px,3vw,40px)] leading-[1.05] mb-2 md:mb-3">{card.title}</h3>
                  <p className="text-[14px] md:text-[15px] leading-[1.55] opacity-75">{card.text}</p>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* ── COMO FUNCIONA ── */}
        <section id="como-funciona" className="py-16 md:py-28 lg:py-40 px-5 md:px-12">
          <div className="max-w-[1320px] mx-auto">
            <p className="font-mono text-[10px] md:text-[11px] uppercase tracking-[0.22em] text-brasa mb-8 md:mb-14">03 — Como funciona</p>
            <h2 className="font-serif italic text-[clamp(32px,5.5vw,80px)] leading-[1] tracking-[-0.02em] text-cafe mb-10 md:mb-16">
              Três passos.<br />
              <span className="text-sol">Resultado agora.</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-6 md:mb-16">
              {howItWorksSteps.map((step) => (
                <div key={step.num} className="p-6 md:p-10 rounded-[1.75rem] border border-[var(--linha)]">
                  <p className="font-mono text-[11px] tracking-[0.16em] text-cafe-3 mb-4 md:mb-6">{step.num}</p>
                  <h3 className="font-serif italic text-2xl md:text-3xl leading-[1.05] text-cafe mb-2 md:mb-3">{step.title}</h3>
                  <p className="text-[14px] md:text-[15px] leading-[1.6] text-cafe-2">{step.text}</p>
                </div>
              ))}
            </div>

            <div className="p-7 md:p-10 lg:p-16 rounded-[1.75rem] bg-cafe text-creme">
              <p className="font-mono text-[10px] md:text-[11px] uppercase tracking-[0.16em] text-amanhecer mb-5 md:mb-6">Exemplo de resposta</p>
              <div className="grid md:grid-cols-2 gap-7 md:gap-12">
                <div>
                  <p className="font-mono text-[10px] md:text-[11px] uppercase tracking-[0.14em] text-amanhecer/70 mb-2 md:mb-3">Cenário</p>
                  <p className="text-[14px] md:text-[15px] text-creme/80 leading-relaxed">Liderado entrega bem, mas reclama com frequência.</p>
                </div>
                <div>
                  <p className="font-mono text-[10px] md:text-[11px] uppercase tracking-[0.14em] text-amanhecer/70 mb-2 md:mb-3">Script pronto</p>
                  <p className="font-serif italic text-[14px] md:text-[15px] text-creme/80 leading-relaxed">
                    &ldquo;Quero conversar sobre um ponto delicado com respeito e clareza. Tenho percebido que, quando trazemos uma nova demanda, costuma vir uma reclamação. Você percebe isso também?&rdquo;
                  </p>
                </div>
              </div>
              <div className="mt-8 md:mt-10 pt-6 md:pt-8 border-t border-creme/10">
                <Link
                  href="/chat"
                  className="inline-flex items-center bg-sol text-creme font-mono text-[10px] md:text-[11px] uppercase tracking-[0.18em] px-5 md:px-7 py-3.5 md:py-4 rounded-full hover:bg-sol-soft transition-colors min-h-[44px]"
                >
                  Quero um roteiro pro meu problema →
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ── BORDÕES ── */}
        <section className="bg-linho py-16 md:py-28 lg:py-40 px-5 md:px-12">
          <div className="max-w-[1320px] mx-auto">
            <p className="font-mono text-[10px] md:text-[11px] uppercase tracking-[0.22em] text-brasa mb-8 md:mb-14">04 — Bordões</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
              {bordoes.map((b) => (
                <Card key={b.num} variant={b.variant} className="min-h-[160px] md:min-h-[200px] flex flex-col justify-between">
                  <p className="font-mono text-[11px] tracking-[0.16em] opacity-40">{b.num}</p>
                  <p className="font-serif italic text-[clamp(24px,3vw,48px)] leading-[1.05] mt-8 md:mt-12">{b.text}</p>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* ── PROGRAMA ── */}
        <section id="programa" className="py-16 md:py-28 lg:py-40 px-5 md:px-12">
          <div className="max-w-[1320px] mx-auto">
            <p className="font-mono text-[10px] md:text-[11px] uppercase tracking-[0.22em] text-brasa mb-8 md:mb-14">05 — Programa</p>
            <div className="grid md:grid-cols-2 gap-4 md:gap-6">
              <div className="relative rounded-[1.75rem] bg-cafe text-creme p-8 md:p-12 lg:p-16 flex flex-col justify-between min-h-[320px] md:min-h-[480px] overflow-hidden">
                <div className="absolute right-[-60px] top-[-60px] opacity-90">
                  <SunIcon size={280} className="text-sol md:hidden" />
                  <SunIcon size={320} className="text-sol hidden md:block" />
                </div>
                <div className="relative">
                  <span className="font-mono text-[10px] md:text-[11px] uppercase tracking-[0.16em] text-amanhecer">Programa · 6 semanas</span>
                </div>
                <div className="relative">
                  <h3 className="font-serif italic text-[clamp(40px,5.5vw,80px)] leading-[0.95] mb-3 md:mb-4">
                    Primeiros<br />90 dias<br />de líder.
                  </h3>
                  <p className="text-[14px] md:text-[15px] text-creme/70 max-w-sm mb-6 md:mb-8">
                    Roteiros prontos pras 12 conversas que você vai precisar fazer — e ninguém te ensinou.
                  </p>
                  <Link
                    href="/chat"
                    className="inline-flex items-center bg-sol text-creme font-mono text-[10px] md:text-[11px] uppercase tracking-[0.16em] px-5 md:px-6 py-3.5 rounded-full hover:bg-sol-soft transition-colors min-h-[44px]"
                  >
                    Quero entrar →
                  </Link>
                </div>
              </div>

              <div className="flex flex-col gap-3 md:gap-4">
                {[
                  { title: "Feedback SCI", text: "Situação → Comportamento → Impacto. O roteiro que funciona." },
                  { title: "1:1 que não é terapia", text: "Como conduzir reuniões individuais com foco e resultado." },
                  { title: "Cobrança sem drama", text: "Cobrar prazos sem virar o chefe chato. Com script pronto." },
                  { title: "Conversa difícil bem feita", text: "Quando a conversa não pode esperar mais. Faz assim." },
                ].map((item, i) => (
                  <div key={i} className="flex gap-4 md:gap-5 p-5 md:p-6 rounded-2xl border border-[var(--linha)] hover:border-sol/30 transition-colors">
                    <span className="font-mono text-[11px] tracking-[0.16em] text-cafe-3 shrink-0 mt-0.5">0{i + 1}</span>
                    <div>
                      <h4 className="font-serif italic text-lg md:text-xl text-cafe mb-1">{item.title}</h4>
                      <p className="text-[13px] md:text-[14px] text-cafe-2 leading-relaxed">{item.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── CTA FINAL ── */}
        <section className="bg-cafe py-16 md:py-28 lg:py-40 px-5 md:px-12">
          <div className="max-w-[1320px] mx-auto text-center">
            <SunIcon size={56} className="text-sol mx-auto mb-6 md:mb-8 md:w-20 md:h-20" />
            <h2 className="font-serif italic text-[clamp(40px,10vw,140px)] leading-[0.9] text-creme mb-5 md:mb-6">
              Bom <span className="text-sol">dia.</span><br />
              Líder.
            </h2>
            <p className="text-[17px] md:text-[22px] font-light text-creme/70 max-w-xl mx-auto mb-8 md:mb-12">
              Descreve o seu problema. O mentor responde com o roteiro pronto — é agora, não semana que vem.
            </p>
            <Link
              href="/chat"
              className="inline-flex items-center bg-sol text-creme font-mono text-[11px] md:text-[13px] uppercase tracking-[0.2em] px-7 py-4 md:px-10 md:py-5 rounded-full hover:bg-sol-soft transition-colors min-h-[48px]"
            >
              Começar agora →
            </Link>
          </div>
        </section>
      </main>

      <footer className="bg-cafe text-creme px-5 md:px-12 py-10 md:py-12 border-t border-creme/10">
        <div className="max-w-[1320px] mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-amanhecer mb-2 md:mb-3">Produto</p>
            <p className="text-[12px] md:text-[13px] text-creme/60 leading-relaxed">Versão 1.0 — 2026</p>
          </div>
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-amanhecer mb-2 md:mb-3">Sobre</p>
            <p className="text-[12px] md:text-[13px] text-creme/60 leading-relaxed">Consultoria Acordei,<br />virei Líder.</p>
          </div>
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-amanhecer mb-2 md:mb-3">Tipografia</p>
            <p className="text-[12px] md:text-[13px] text-creme/60">Instrument Serif</p>
            <p className="text-[12px] md:text-[13px] text-creme/60">Geist · JetBrains Mono</p>
          </div>
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-amanhecer mb-2 md:mb-3">Contato</p>
            <p className="text-[12px] md:text-[13px] text-creme/60">@acordeivireilider</p>
          </div>
        </div>
      </footer>

      <style>{`
        @keyframes marquee {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
      `}</style>
    </>
  );
}
