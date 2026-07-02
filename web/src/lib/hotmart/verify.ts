import { timingSafeEqual } from "crypto";

export function verifyHottok(hottok: string | null): boolean {
  const expected = process.env.HOTMART_HOTTOK;
  if (!expected || !hottok) return false;
  // Comparação de tempo constante: evita vazar o token por timing.
  const a = Buffer.from(hottok);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

export type HotmartEventType =
  | "PURCHASE_APPROVED"
  | "PURCHASE_COMPLETE"
  | "PURCHASE_REFUNDED"
  | "PURCHASE_CHARGEBACK"
  | "SUBSCRIPTION_CANCELLATION"
  | "PURCHASE_DELAYED";

export interface HotmartWebhookPayload {
  id?: string;
  creation_date?: number;
  event: HotmartEventType;
  version?: string;
  data: {
    buyer: { email: string; name?: string };
    purchase: { transaction: string; status: string };
    subscription?: { subscriber?: { code?: string }; status?: string };
    product?: { id: string; name?: string };
    offer?: { code?: string };
  };
}
