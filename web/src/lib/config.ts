import { createAdminClient } from "@/lib/supabase/admin";
import { DEFAULT_SYSTEM_PROMPT } from "@/lib/mentor-prompt";
import {
  PLANOS_CONTEUDO_KEY,
  PLANOS_CONTEUDO_PADRAO,
  mesclaPlanosConteudo,
  type PlanosConteudo,
} from "@/lib/planos-conteudo";

export const PROMPT_KEY = "system_prompt";

// Lê o prompt do Mentor IA definido pelo admin; cai no padrão se vazio/ausente.
export async function getSystemPrompt(): Promise<string> {
  try {
    const sb = createAdminClient();
    const { data } = await sb
      .from("app_config")
      .select("value")
      .eq("key", PROMPT_KEY)
      .maybeSingle();
    const v = data?.value?.trim();
    return v && v.length > 0 ? v : DEFAULT_SYSTEM_PROMPT;
  } catch {
    return DEFAULT_SYSTEM_PROMPT;
  }
}

// Lê o conteúdo da página /planos editado pelo admin; cai no padrão se
// vazio/ausente/inválido (a página nunca quebra por causa da config).
export async function getPlanosConteudo(): Promise<PlanosConteudo> {
  try {
    const sb = createAdminClient();
    const { data } = await sb
      .from("app_config")
      .select("value")
      .eq("key", PLANOS_CONTEUDO_KEY)
      .maybeSingle();
    return mesclaPlanosConteudo(data?.value);
  } catch {
    return PLANOS_CONTEUDO_PADRAO;
  }
}
