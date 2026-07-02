// Regras de vigência do acesso ao Mentor IA (compartilhadas por proxy, API e admin).

export type AcessoInfo = {
  acesso_status?: string | null;
  data_fim?: string | null;
} | null;

// Data de hoje em America/Sao_Paulo no formato YYYY-MM-DD, para comparar com o
// campo `date` do Postgres (que vem como string 'YYYY-MM-DD').
export function hojeLocal(): string {
  const agora = new Date(
    new Date().toLocaleString("en-US", { timeZone: "America/Sao_Paulo" })
  );
  const y = agora.getFullYear();
  const m = String(agora.getMonth() + 1).padStart(2, "0");
  const d = String(agora.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

// Acesso vigente = status 'ativo' E (sem data_fim OU data_fim >= hoje).
export function acessoAtivo(a: AcessoInfo, hoje: string = hojeLocal()): boolean {
  if (!a || a.acesso_status !== "ativo") return false;
  if (a.data_fim && a.data_fim < hoje) return false;
  return true;
}
