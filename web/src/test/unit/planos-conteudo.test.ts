import { describe, it, expect } from "vitest";
import {
  PLANOS_CONTEUDO_PADRAO,
  mesclaPlanosConteudo,
} from "@/lib/planos-conteudo";

describe("mesclaPlanosConteudo", () => {
  it("sem config salva, usa o padrão", () => {
    expect(mesclaPlanosConteudo(null)).toEqual(PLANOS_CONTEUDO_PADRAO);
    expect(mesclaPlanosConteudo("")).toEqual(PLANOS_CONTEUDO_PADRAO);
  });

  it("JSON inválido cai no padrão", () => {
    expect(mesclaPlanosConteudo("{isso não é json")).toEqual(
      PLANOS_CONTEUDO_PADRAO
    );
    expect(mesclaPlanosConteudo("[1,2,3]")).toEqual(PLANOS_CONTEUDO_PADRAO);
  });

  it("aplica os campos salvos e completa o resto com o padrão", () => {
    const c = mesclaPlanosConteudo(
      JSON.stringify({ chapeu: "Nossos planos" })
    );
    expect(c.chapeu).toBe("Nossos planos");
    expect(c.tituloLinha1).toBe(PLANOS_CONTEUDO_PADRAO.tituloLinha1);
    expect(c.cards).toHaveLength(3);
  });

  it("edita um card sem mexer nos outros", () => {
    const c = mesclaPlanosConteudo(
      JSON.stringify({
        cards: [{}, {}, { preco: "3x de R$120,00", itens: ["Só um item"] }],
      })
    );
    expect(c.cards[0].preco).toBe(PLANOS_CONTEUDO_PADRAO.cards[0].preco);
    expect(c.cards[2].preco).toBe("3x de R$120,00");
    expect(c.cards[2].itens).toEqual(["Só um item"]);
    expect(c.cards[2].nome).toBe(PLANOS_CONTEUDO_PADRAO.cards[2].nome);
  });

  it("a chave do plano nunca vem do banco (protege o link do checkout)", () => {
    const c = mesclaPlanosConteudo(
      JSON.stringify({ cards: [{ chave: "premium" }, {}, {}] })
    );
    expect(c.cards.map((x) => x.chave)).toEqual([
      "basico",
      "complementar",
      "premium",
    ]);
  });

  it("campo apagado pelo admin fica vazio (não volta ao padrão)", () => {
    const c = mesclaPlanosConteudo(
      JSON.stringify({ cards: [{ etiqueta: "" }, {}, {}] })
    );
    expect(c.cards[0].etiqueta).toBe("");
  });

  it("linhas em branco da lista de itens são descartadas", () => {
    const c = mesclaPlanosConteudo(
      JSON.stringify({ cards: [{ itens: ["Um", "", "  ", "Dois"] }, {}, {}] })
    );
    expect(c.cards[0].itens).toEqual(["Um", "Dois"]);
  });

  it("tipos errados caem no padrão do campo", () => {
    const c = mesclaPlanosConteudo(
      JSON.stringify({ chapeu: 42, cards: [{ itens: "texto" }, {}, {}] })
    );
    expect(c.chapeu).toBe(PLANOS_CONTEUDO_PADRAO.chapeu);
    expect(c.cards[0].itens).toEqual(PLANOS_CONTEUDO_PADRAO.cards[0].itens);
  });
});
