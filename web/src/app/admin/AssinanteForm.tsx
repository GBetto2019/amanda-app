"use client";

import { useState } from "react";
import {
  liberarMentor,
  atualizarAssinante,
  inativarAssinante,
  gerarLinkAcesso,
} from "./actions";

export type Assinante = {
  id: string;
  nome: string | null;
  email: string;
  telefone: string | null;
  plano_escolhido: string | null;
  valor: number | null;
  pagamento_status: string;
  acesso_status: string;
  data_inicio: string | null;
  data_fim: string | null;
  user_id: string | null;
  created_at: string;
};

const statusCor: Record<string, string> = {
  ativo: "bg-green-100 text-green-800",
  pendente: "bg-amber-100 text-amber-800",
  inativo: "bg-red-100 text-red-700",
};
const pagamentoCor: Record<string, string> = {
  recebido: "bg-green-100 text-green-800",
  aguardando: "bg-stone-200 text-stone-600",
};

export function AssinanteForm({ a }: { a: Assinante }) {
  const [plano, setPlano] = useState(a.plano_escolhido ?? "");
  const ehBasico = plano === "basico";
  const [link, setLink] = useState<string | null>(null);
  const [gerando, setGerando] = useState(false);
  const [erroLink, setErroLink] = useState<string | null>(null);
  const [copiado, setCopiado] = useState(false);

  async function handleGerarLink() {
    setGerando(true);
    setErroLink(null);
    setCopiado(false);
    const res = await gerarLinkAcesso(a.id);
    setGerando(false);
    if (res.link) setLink(res.link);
    else setErroLink(res.erro ?? "Erro ao gerar o link.");
  }

  async function handleCopiar() {
    if (!link) return;
    try {
      await navigator.clipboard.writeText(link);
      setCopiado(true);
      setTimeout(() => setCopiado(false), 2000);
    } catch {
      setErroLink("Copie o link manualmente.");
    }
  }

  const inputCls =
    "w-full bg-white border border-[var(--linha)] rounded-lg px-3 py-2 text-[13px] text-cafe outline-none focus:border-sol transition-colors";
  const labelCls =
    "block font-mono text-[9px] uppercase tracking-[0.14em] text-cafe-3 mb-1";

  return (
    <div className="rounded-2xl border border-[var(--linha)] bg-white p-5 md:p-6">
      <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
        <div>
          <p className="font-serif italic text-lg text-cafe leading-tight">
            {a.nome ?? "—"}
          </p>
          <p className="text-[13px] text-cafe-2">{a.email}</p>
          {a.telefone && (
            <p className="text-[12px] text-cafe-3">{a.telefone}</p>
          )}
        </div>
        <div className="flex flex-col items-end gap-1.5">
          <span
            className={`font-mono text-[9px] uppercase tracking-[0.12em] px-2 py-1 rounded-full ${
              statusCor[a.acesso_status] ?? "bg-stone-200 text-stone-600"
            }`}
          >
            {a.acesso_status}
          </span>
          <span
            className={`font-mono text-[9px] uppercase tracking-[0.12em] px-2 py-1 rounded-full ${
              pagamentoCor[a.pagamento_status] ?? "bg-stone-200 text-stone-600"
            }`}
          >
            pgto: {a.pagamento_status}
          </span>
        </div>
      </div>

      <form className="grid grid-cols-2 md:grid-cols-4 gap-3 items-end">
        <input type="hidden" name="id" value={a.id} />

        <div>
          <label className={labelCls}>Plano</label>
          <select
            name="plano_escolhido"
            value={plano}
            onChange={(e) => setPlano(e.target.value)}
            className={inputCls}
          >
            <option value="">—</option>
            <option value="basico">Básico</option>
            <option value="complementar">Complementar</option>
            <option value="premium">Premium</option>
          </select>
        </div>

        <div>
          <label className={labelCls}>Valor (R$)</label>
          <input
            type="number"
            step="0.01"
            name="valor"
            defaultValue={a.valor ?? ""}
            className={inputCls}
            placeholder="0,00"
          />
        </div>

        <div>
          <label className={labelCls}>Início</label>
          <input
            type="date"
            name="data_inicio"
            defaultValue={a.data_inicio ?? ""}
            className={inputCls}
          />
        </div>

        <div>
          <label className={labelCls}>Fim</label>
          <input
            type="date"
            name="data_fim"
            defaultValue={a.data_fim ?? ""}
            className={inputCls}
          />
        </div>

        <div className="col-span-2 md:col-span-1">
          <label className={labelCls}>Status do acesso</label>
          <select
            name="acesso_status"
            defaultValue={a.acesso_status}
            className={inputCls}
          >
            <option value="pendente">pendente</option>
            <option value="ativo">ativo</option>
            <option value="inativo">inativo</option>
          </select>
        </div>

        <div className="col-span-2 md:col-span-3 flex flex-wrap gap-2 justify-end">
          {a.acesso_status !== "ativo" &&
            (ehBasico ? (
              <span className="self-center font-mono text-[9px] uppercase tracking-[0.12em] text-cafe-3">
                Básico não inclui Mentor IA
              </span>
            ) : (
              <button
                formAction={liberarMentor}
                className="bg-sol text-creme font-mono text-[10px] uppercase tracking-[0.14em] px-4 py-2.5 rounded-full hover:bg-sol-soft transition-colors"
              >
                Liberar Mentor IA →
              </button>
            ))}
          <button
            formAction={atualizarAssinante}
            className="border border-cafe/20 text-cafe font-mono text-[10px] uppercase tracking-[0.14em] px-4 py-2.5 rounded-full hover:bg-cafe/5 transition-colors"
          >
            Salvar
          </button>
          {!ehBasico && (a.user_id || a.acesso_status === "ativo") && (
            <button
              type="button"
              onClick={handleGerarLink}
              disabled={gerando}
              className="border border-sol/40 text-brasa font-mono text-[10px] uppercase tracking-[0.14em] px-4 py-2.5 rounded-full hover:bg-sol/5 transition-colors disabled:opacity-50"
            >
              {gerando ? "Gerando…" : "Link de acesso"}
            </button>
          )}
          {a.acesso_status === "ativo" && (
            <button
              formAction={inativarAssinante}
              className="border border-red-200 text-red-600 font-mono text-[10px] uppercase tracking-[0.14em] px-4 py-2.5 rounded-full hover:bg-red-50 transition-colors"
            >
              Inativar
            </button>
          )}
        </div>
      </form>

      {(link || erroLink) && (
        <div className="mt-4 pt-4 border-t border-[var(--linha-soft)]">
          {erroLink && (
            <p className="text-[12px] text-red-600 leading-snug">{erroLink}</p>
          )}
          {link && (
            <>
              <p className="font-mono text-[9px] uppercase tracking-[0.14em] text-cafe-3 mb-2">
                Link de acesso — envie ao aluno (ex.: WhatsApp)
              </p>
              <div className="flex gap-2">
                <input
                  readOnly
                  value={link}
                  onFocus={(e) => e.currentTarget.select()}
                  className="flex-1 bg-linho border border-[var(--linha)] rounded-lg px-3 py-2 text-[12px] text-cafe outline-none"
                />
                <button
                  type="button"
                  onClick={handleCopiar}
                  className="shrink-0 bg-sol text-creme font-mono text-[10px] uppercase tracking-[0.14em] px-4 py-2 rounded-lg hover:bg-sol-soft transition-colors"
                >
                  {copiado ? "Copiado ✓" : "Copiar"}
                </button>
              </div>
              <p className="text-[11px] text-cafe-3 mt-2 leading-snug">
                O aluno abre o link, define a senha e acessa o Mentor IA. O link
                expira em algumas horas — gere um novo se necessário.
              </p>
            </>
          )}
        </div>
      )}
    </div>
  );
}
