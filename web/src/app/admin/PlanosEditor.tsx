"use client";

import { useState } from "react";
import {
  PLANOS_CONTEUDO_PADRAO,
  type CardPlano,
  type PlanosConteudo,
} from "@/lib/planos-conteudo";
import { salvarPlanos, restaurarPlanos } from "./actions";

const inputCls =
  "w-full bg-white border border-[var(--linha)] rounded-lg px-3 py-2 text-[13px] text-cafe outline-none focus:border-sol transition-colors";
const labelCls =
  "block font-mono text-[9px] uppercase tracking-[0.14em] text-cafe-3 mb-1";

function Campo({
  label,
  valor,
  onChange,
  dica,
}: {
  label: string;
  valor: string;
  onChange: (v: string) => void;
  dica?: string;
}) {
  return (
    <div>
      <label className={labelCls}>{label}</label>
      <input
        type="text"
        value={valor}
        onChange={(e) => onChange(e.target.value)}
        className={inputCls}
      />
      {dica && <p className="text-[11px] text-cafe-3 mt-1">{dica}</p>}
    </div>
  );
}

function Area({
  label,
  valor,
  onChange,
  linhas = 3,
  dica,
}: {
  label: string;
  valor: string;
  onChange: (v: string) => void;
  linhas?: number;
  dica?: string;
}) {
  return (
    <div>
      <label className={labelCls}>{label}</label>
      <textarea
        value={valor}
        onChange={(e) => onChange(e.target.value)}
        rows={linhas}
        className={`${inputCls} leading-relaxed resize-y`}
      />
      {dica && <p className="text-[11px] text-cafe-3 mt-1">{dica}</p>}
    </div>
  );
}

export function PlanosEditor({
  valorAtual,
  personalizado,
}: {
  valorAtual: PlanosConteudo;
  personalizado: boolean;
}) {
  const [aberto, setAberto] = useState(false);
  const [c, setC] = useState<PlanosConteudo>(valorAtual);

  function set<K extends keyof PlanosConteudo>(campo: K, valor: PlanosConteudo[K]) {
    setC((atual) => ({ ...atual, [campo]: valor }));
  }

  function setCard(i: number, patch: Partial<CardPlano>) {
    setC((atual) => ({
      ...atual,
      cards: atual.cards.map((card, j) => (j === i ? { ...card, ...patch } : card)),
    }));
  }

  return (
    <div className="rounded-2xl border border-[var(--linha)] bg-white mb-8">
      <button
        type="button"
        onClick={() => setAberto((v) => !v)}
        className="w-full flex items-center justify-between px-5 md:px-6 py-4 text-left"
      >
        <span className="flex items-center gap-3">
          <span className="font-serif italic text-lg text-cafe">
            Textos da página de Planos
          </span>
          <span
            className={`font-mono text-[9px] uppercase tracking-[0.12em] px-2 py-1 rounded-full ${
              personalizado ? "bg-sol/15 text-brasa" : "bg-stone-200 text-stone-600"
            }`}
          >
            {personalizado ? "personalizado" : "padrão"}
          </span>
        </span>
        <span className="font-mono text-[11px] text-cafe-3">
          {aberto ? "fechar ▲" : "editar ▼"}
        </span>
      </button>

      {aberto && (
        <div className="px-5 md:px-6 pb-6">
          <p className="text-[13px] text-cafe-2 leading-relaxed mb-5">
            Edite aqui tudo o que aparece em{" "}
            <a
              href="/planos"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sol hover:underline"
            >
              /planos
            </a>
            : título, os três cards, preços e o rodapé. O visual e o botão de cada
            plano continuam iguais — só o texto muda. Salvou, já está no ar.
          </p>

          <form action={salvarPlanos}>
            {/* Todo o conteúdo vai num único campo JSON. */}
            <input type="hidden" name="conteudo" value={JSON.stringify(c)} />

            {/* Topo da página */}
            <fieldset className="rounded-xl border border-[var(--linha)] bg-linho/60 p-4 md:p-5 mb-4">
              <legend className="font-mono text-[10px] uppercase tracking-[0.16em] text-brasa px-2">
                Topo da página
              </legend>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <Campo
                  label="Chapéu"
                  valor={c.chapeu}
                  onChange={(v) => set("chapeu", v)}
                  dica="Linha pequena acima do título."
                />
                <Campo
                  label="Título — 1ª linha"
                  valor={c.tituloLinha1}
                  onChange={(v) => set("tituloLinha1", v)}
                />
                <Campo
                  label="Título — 2ª linha (laranja)"
                  valor={c.tituloLinha2}
                  onChange={(v) => set("tituloLinha2", v)}
                />
              </div>
              <div className="mt-3">
                <Area
                  label="Subtítulo"
                  valor={c.subtitulo}
                  onChange={(v) => set("subtitulo", v)}
                  linhas={2}
                />
              </div>
            </fieldset>

            {/* Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
              {c.cards.map((card, i) => (
                <fieldset
                  key={card.chave}
                  className="rounded-xl border border-[var(--linha)] bg-linho/60 p-4 md:p-5"
                >
                  <legend className="font-mono text-[10px] uppercase tracking-[0.16em] text-brasa px-2">
                    Card {i + 1} · {card.chave}
                  </legend>
                  <div className="space-y-3">
                    <Campo
                      label="Selo (canto superior)"
                      valor={card.etiqueta}
                      onChange={(v) => setCard(i, { etiqueta: v })}
                      dica="Deixe vazio para esconder o selo."
                    />
                    <Campo
                      label="Nome do plano"
                      valor={card.nome}
                      onChange={(v) => setCard(i, { nome: v })}
                    />
                    <Campo
                      label="Preço"
                      valor={card.preco}
                      onChange={(v) => setCard(i, { preco: v })}
                      dica="Ex.: R$99,90"
                    />
                    <Campo
                      label="Abaixo do preço"
                      valor={card.precoDetalhe}
                      onChange={(v) => setCard(i, { precoDetalhe: v })}
                      dica="Opcional. Ex.: por mês · cancele quando quiser"
                    />
                    <Area
                      label="Descrição"
                      valor={card.descricao}
                      onChange={(v) => setCard(i, { descricao: v })}
                      linhas={3}
                    />
                    <Area
                      label="Itens da lista"
                      valor={card.itens.join("\n")}
                      onChange={(v) => setCard(i, { itens: v.split("\n") })}
                      linhas={5}
                      dica="Um item por linha."
                    />
                    <Campo
                      label="Texto do botão"
                      valor={card.cta}
                      onChange={(v) => setCard(i, { cta: v })}
                    />
                  </div>
                </fieldset>
              ))}
            </div>

            {/* Rodapé */}
            <fieldset className="rounded-xl border border-[var(--linha)] bg-linho/60 p-4 md:p-5 mb-5">
              <legend className="font-mono text-[10px] uppercase tracking-[0.16em] text-brasa px-2">
                Aviso e rodapé
              </legend>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <Area
                  label="Aviso — frase em negrito"
                  valor={c.avisoDestaque}
                  onChange={(v) => set("avisoDestaque", v)}
                  linhas={2}
                />
                <Area
                  label="Aviso — complemento"
                  valor={c.avisoTexto}
                  onChange={(v) => set("avisoTexto", v)}
                  linhas={2}
                />
                <Campo
                  label="Rodapé — pergunta"
                  valor={c.rodapePergunta}
                  onChange={(v) => set("rodapePergunta", v)}
                />
                <Campo
                  label="Rodapé — texto do link"
                  valor={c.rodapeLink}
                  onChange={(v) => set("rodapeLink", v)}
                />
                <div className="md:col-span-2">
                  <Campo
                    label="Link do WhatsApp"
                    valor={c.whatsapp}
                    onChange={(v) => set("whatsapp", v)}
                    dica="Ex.: https://wa.me/5511974668867"
                  />
                </div>
              </div>
            </fieldset>

            <div className="flex flex-wrap gap-2">
              <button
                type="submit"
                className="bg-sol text-creme font-mono text-[10px] uppercase tracking-[0.14em] px-5 py-2.5 rounded-full hover:bg-sol-soft transition-colors"
              >
                Salvar textos
              </button>
              <button
                type="button"
                onClick={() => setC(PLANOS_CONTEUDO_PADRAO)}
                className="border border-cafe/20 text-cafe font-mono text-[10px] uppercase tracking-[0.14em] px-5 py-2.5 rounded-full hover:bg-cafe/5 transition-colors"
              >
                Carregar padrão
              </button>
              <button
                formAction={restaurarPlanos}
                className="border border-red-200 text-red-600 font-mono text-[10px] uppercase tracking-[0.14em] px-5 py-2.5 rounded-full hover:bg-red-50 transition-colors"
              >
                Restaurar padrão
              </button>
            </div>
            <p className="text-[11px] text-cafe-3 mt-2 leading-snug">
              &ldquo;Carregar padrão&rdquo; só preenche os campos (você ainda
              precisa salvar). &ldquo;Restaurar padrão&rdquo; apaga a
              personalização e volta aos textos originais.
            </p>
          </form>
        </div>
      )}
    </div>
  );
}
