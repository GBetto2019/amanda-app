// Link de checkout da Hotmart. Por ora todos os planos usam o mesmo produto.
// Quando o Premium tiver produto próprio, mapear por plano aqui.
export const HOTMART_CHECKOUT = "https://pay.hotmart.com/F106532691P";

export type Plano = "basico" | "complementar" | "premium";

// Planos que dão acesso ao Mentor IA (exigem cadastro + liberação do admin).
export const PLANOS_COM_MENTOR: Plano[] = ["complementar", "premium"];

export function checkoutUrl(plano?: Plano): string {
  // plano reservado para quando cada oferta tiver produto/URL própria na Hotmart.
  void plano;
  return HOTMART_CHECKOUT;
}
