"use client";

import { useState } from "react";
import { salvarPrompt, restaurarPrompt } from "./actions";

export function PromptEditor({
  valorAtual,
  padrao,
  personalizado,
}: {
  valorAtual: string;
  padrao: string;
  personalizado: boolean;
}) {
  const [aberto, setAberto] = useState(false);
  const [texto, setTexto] = useState(valorAtual);

  return (
    <div className="rounded-2xl border border-[var(--linha)] bg-white mb-8">
      <button
        type="button"
        onClick={() => setAberto((v) => !v)}
        className="w-full flex items-center justify-between px-5 md:px-6 py-4 text-left"
      >
        <span className="flex items-center gap-3">
          <span className="font-serif italic text-lg text-cafe">
            Treinar o Mentor IA
          </span>
          <span
            className={`font-mono text-[9px] uppercase tracking-[0.12em] px-2 py-1 rounded-full ${
              personalizado
                ? "bg-sol/15 text-brasa"
                : "bg-stone-200 text-stone-600"
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
          <p className="text-[13px] text-cafe-2 leading-relaxed mb-3">
            Este é o texto que orienta como a IA responde — identidade, formato,
            e as regras do que ela pode e não pode fazer. Edite para guiar o
            mentor. Alterações valem para as próximas conversas.
          </p>
          <form action={salvarPrompt}>
            <textarea
              name="prompt"
              value={texto}
              onChange={(e) => setTexto(e.target.value)}
              rows={20}
              className="w-full bg-linho border border-[var(--linha)] rounded-xl px-4 py-3 text-[12px] leading-relaxed text-cafe font-mono outline-none focus:border-sol transition-colors resize-y"
            />
            <div className="flex flex-wrap gap-2 mt-3">
              <button
                type="submit"
                className="bg-sol text-creme font-mono text-[10px] uppercase tracking-[0.14em] px-5 py-2.5 rounded-full hover:bg-sol-soft transition-colors"
              >
                Salvar prompt
              </button>
              <button
                type="button"
                onClick={() => setTexto(padrao)}
                className="border border-cafe/20 text-cafe font-mono text-[10px] uppercase tracking-[0.14em] px-5 py-2.5 rounded-full hover:bg-cafe/5 transition-colors"
              >
                Carregar padrão
              </button>
              <button
                formAction={restaurarPrompt}
                className="border border-red-200 text-red-600 font-mono text-[10px] uppercase tracking-[0.14em] px-5 py-2.5 rounded-full hover:bg-red-50 transition-colors"
              >
                Restaurar padrão
              </button>
            </div>
            <p className="text-[11px] text-cafe-3 mt-2 leading-snug">
              &ldquo;Carregar padrão&rdquo; só preenche o campo (você ainda
              precisa salvar). &ldquo;Restaurar padrão&rdquo; apaga a
              personalização e volta ao texto original.
            </p>
          </form>
        </div>
      )}
    </div>
  );
}
