// Regras de vigência do acesso ao Mentor IA (compartilhadas por proxy, API e admin).

export type AcessoInfo = {
  acesso_status?: string | null;
  data_fim?: string | null;
} | null;

// Data de hoje em America/Sao_Paulo (UTC−3, sem horário de verão) no formato
// YYYY-MM-DD, para comparar com o campo `date` do Postgres.
// Não usa Intl/timeZone porque o Edge runtime (middleware) não o suporta bem.
export function hojeLocal(): string {
  const saoPaulo = new Date(Date.now() - 3 * 60 * 60 * 1000);
  return saoPaulo.toISOString().slice(0, 10);
}

// Acesso vigente = status 'ativo' E (sem data_fim OU data_fim >= hoje).
export function acessoAtivo(a: AcessoInfo, hoje: string = hojeLocal()): boolean {
  if (!a || a.acesso_status !== "ativo") return false;
  if (a.data_fim && a.data_fim < hoje) return false;
  return true;
}
