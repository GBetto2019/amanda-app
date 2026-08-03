import type { Plano } from "@/lib/hotmart/checkout";

// Conteúdo da página /planos, editável pelo admin (app_config.planos_conteudo).
// Só TEXTO é editável — o visual e o destino de cada botão (a chave do plano)
// continuam no código, para não quebrar o fluxo de checkout.
export const PLANOS_CONTEUDO_KEY = "planos_conteudo";

export type CardPlano = {
  chave: Plano;
  etiqueta: string; // selo do canto ("Comece por aqui")
  nome: string;
  preco: string;
  precoDetalhe: string; // linha abaixo do preço (opcional)
  descricao: string;
  itens: string[];
  cta: string; // texto do botão
};

export type PlanosConteudo = {
  chapeu: string;
  tituloLinha1: string;
  tituloLinha2: string; // destacada em laranja
  subtitulo: string;
  cards: CardPlano[];
  avisoDestaque: string; // parte em negrito do box laranja
  avisoTexto: string;
  rodapePergunta: string;
  rodapeLink: string;
  whatsapp: string;
};

export const PLANOS_CONTEUDO_PADRAO: PlanosConteudo = {
  chapeu: "Escolha seu plano",
  tituloLinha1: "Quanto você quer",
  tituloLinha2: "evoluir como líder?",
  subtitulo:
    "Escolha o plano, finalize o pagamento na Hotmart e o acesso é liberado automaticamente.",
  cards: [
    {
      chave: "basico",
      etiqueta: "Comece por aqui",
      nome: "Aprenda",
      preco: "R$49,90",
      precoDetalhe: "",
      descricao:
        "4 videoaulas sobre os temas fundamentais da primeira liderança — prática, direta e sem enrolação.",
      itens: [
        "Virei líder e agora? — a transição sem sofrer",
        "Como fazer feedback",
        "Como construir um time de alta performance",
        "Como conduzir conversas difíceis",
      ],
      cta: "Saiba Mais",
    },
    {
      chave: "complementar",
      etiqueta: "Complementar",
      nome: "Mentor IA",
      preco: "R$29,90",
      precoDetalhe: "por mês · cancele quando quiser",
      descricao:
        "Um mentor de bolso treinado pela nossa metodologia, pronto para suas perguntas a qualquer hora.",
      itens: [
        "Perguntas 24h por dia, 7 dias por semana",
        "Treinado pela metodologia Acordei, virei líder",
        "Cancele sem custo, quando quiser",
      ],
      cta: "Saiba Mais",
    },
    {
      chave: "premium",
      etiqueta: "Premium",
      nome: "Evolua com acompanhamento",
      preco: "R$99,90",
      precoDetalhe: "",
      descricao:
        "Para quem quer um acompanhamento guiado, de perto, com quem idealizou o projeto.",
      itens: [
        "Sessão de Mentoria em Grupo (1h)",
        "Troque vivências com quem vive o mesmo momento",
        "Tire dúvidas direto com a idealizadora do projeto",
      ],
      cta: "Saiba Mais",
    },
  ],
  avisoDestaque:
    "Use o mesmo e-mail da sua conta Google no checkout da Hotmart.",
  avisoTexto:
    "É ele que vincula o pagamento ao seu acesso — o mentor é liberado automaticamente após a confirmação.",
  rodapePergunta: "E-mails diferentes ou dúvidas no pagamento?",
  rodapeLink: "Fale pelo WhatsApp",
  whatsapp: "https://wa.me/5511974668867",
};

function texto(valor: unknown, padrao: string): string {
  // String vazia é intencional (o admin apagou o campo); só cai no padrão
  // quando o campo não existe ou veio com outro tipo.
  return typeof valor === "string" ? valor.trim() : padrao;
}

function lista(valor: unknown, padrao: string[]): string[] {
  if (!Array.isArray(valor)) return padrao;
  return valor
    .filter((i): i is string => typeof i === "string")
    .map((i) => i.trim())
    .filter((i) => i !== "");
}

function mesclaCard(valor: unknown, padrao: CardPlano): CardPlano {
  const c = (valor ?? {}) as Record<string, unknown>;
  return {
    chave: padrao.chave, // nunca vem do banco: define o link do checkout
    etiqueta: texto(c.etiqueta, padrao.etiqueta),
    nome: texto(c.nome, padrao.nome),
    preco: texto(c.preco, padrao.preco),
    precoDetalhe: texto(c.precoDetalhe, padrao.precoDetalhe),
    descricao: texto(c.descricao, padrao.descricao),
    itens: lista(c.itens, padrao.itens),
    cta: texto(c.cta, padrao.cta),
  };
}

// Converte o JSON salvo em conteúdo completo. Qualquer campo ausente, inválido
// ou JSON quebrado cai no padrão — a página nunca fica sem conteúdo.
export function mesclaPlanosConteudo(
  bruto: string | null | undefined
): PlanosConteudo {
  if (!bruto || bruto.trim() === "") return PLANOS_CONTEUDO_PADRAO;

  let dados: Record<string, unknown>;
  try {
    const parsed: unknown = JSON.parse(bruto);
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
      return PLANOS_CONTEUDO_PADRAO;
    }
    dados = parsed as Record<string, unknown>;
  } catch {
    return PLANOS_CONTEUDO_PADRAO;
  }

  const cardsSalvos = Array.isArray(dados.cards) ? dados.cards : [];
  const padrao = PLANOS_CONTEUDO_PADRAO;

  return {
    chapeu: texto(dados.chapeu, padrao.chapeu),
    tituloLinha1: texto(dados.tituloLinha1, padrao.tituloLinha1),
    tituloLinha2: texto(dados.tituloLinha2, padrao.tituloLinha2),
    subtitulo: texto(dados.subtitulo, padrao.subtitulo),
    // A quantidade e a ordem dos cards são fixas (uma por plano).
    cards: padrao.cards.map((c, i) => mesclaCard(cardsSalvos[i], c)),
    avisoDestaque: texto(dados.avisoDestaque, padrao.avisoDestaque),
    avisoTexto: texto(dados.avisoTexto, padrao.avisoTexto),
    rodapePergunta: texto(dados.rodapePergunta, padrao.rodapePergunta),
    rodapeLink: texto(dados.rodapeLink, padrao.rodapeLink),
    whatsapp: texto(dados.whatsapp, padrao.whatsapp),
  };
}
