// Cada plano tem seu próprio produto/oferta na Hotmart. Estes são os links
// PADRÃO: o admin pode trocá-los em /admin (app_config.planos_conteudo) sem
// deploy — ver `checkoutDoPlano` em src/lib/planos-conteudo.ts.
export const HOTMART_CHECKOUT = {
  basico: "https://go.hotmart.com/F106532691P?dp=1",
  complementar: "https://go.hotmart.com/L106442832I?dp=1",
  premium: "https://pay.hotmart.com/W106968683F",
} as const;

export type Plano = "basico" | "complementar" | "premium";

// Todos os planos passam pelo /cadastro antes do checkout (captura o lead).
export const PLANOS: Plano[] = ["basico", "complementar", "premium"];

// Planos que dão acesso ao Mentor IA (exigem liberação do admin).
export const PLANOS_COM_MENTOR: Plano[] = ["complementar", "premium"];

export function checkoutUrl(plano: Plano = "complementar"): string {
  // Sem plano: é a renovação do Mentor IA (/aguardando), ou seja, o complementar.
  return HOTMART_CHECKOUT[plano];
}
