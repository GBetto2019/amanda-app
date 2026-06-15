export function verifyHottok(hottok: string | null): boolean {
  const expected = process.env.HOTMART_HOTTOK;
  if (!expected || !hottok) return false;
  return hottok === expected;
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
