import type { User } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";

// Retorna o usuário se ele for admin autenticado; caso contrário, null.
// Usado para proteger páginas e server actions do painel.
export async function getAdminUser(): Promise<User | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data } = await supabase
    .from("admins")
    .select("user_id")
    .eq("user_id", user.id)
    .maybeSingle();

  return data ? user : null;
}
