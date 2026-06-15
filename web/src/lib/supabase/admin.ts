import { createClient } from "@supabase/supabase-js";

// Service Role client — ignora RLS, SOMENTE uso server-side (webhook).
// NUNCA importar em Client Components ou expor ao browser.
export function createAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: { autoRefreshToken: false, persistSession: false },
    }
  );
}
