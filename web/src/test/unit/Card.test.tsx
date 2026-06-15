import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Card } from "@/components/ui/Card";

describe("Card", () => {
  it("renderiza os filhos corretamente", () => {
    render(<Card>Conteúdo do card</Card>);
    expect(screen.getByText("Conteúdo do card")).toBeInTheDocument();
  });

  it("aplica border-radius e padding padrão", () => {
    const { container } = render(<Card>teste</Card>);
    const el = container.firstChild as HTMLElement;
    expect(el.className).toContain("rounded-");
    expect(el.className).toContain("p-");
  });

  it("variante default aplica bg-white", () => {
    const { container } = render(<Card variant="default">teste</Card>);
    expect((container.firstChild as HTMLElement).className).toContain("bg-white");
  });

  it("variante cafe aplica bg-cafe e text-creme", () => {
    const { container } = render(<Card variant="cafe">teste</Card>);
    const cls = (container.firstChild as HTMLElement).className;
    expect(cls).toContain("bg-cafe");
    expect(cls).toContain("text-creme");
  });

  it("variante sol aplica bg-sol", () => {
    const { container } = render(<Card variant="sol">teste</Card>);
    expect((container.firstChild as HTMLElement).className).toContain("bg-sol");
  });

  it("variante brasa aplica bg-brasa", () => {
    const { container } = render(<Card variant="brasa">teste</Card>);
    expect((container.firstChild as HTMLElement).className).toContain("bg-brasa");
  });

  it("aceita className extra sem sobrescrever as variantes", () => {
    const { container } = render(<Card className="minha-classe">teste</Card>);
    const cls = (container.firstChild as HTMLElement).className;
    expect(cls).toContain("minha-classe");
    expect(cls).toContain("bg-white");
  });

  it("renderiza múltiplos filhos", () => {
    render(
      <Card>
        <span>filho 1</span>
        <span>filho 2</span>
      </Card>
    );
    expect(screen.getByText("filho 1")).toBeInTheDocument();
    expect(screen.getByText("filho 2")).toBeInTheDocument();
  });
});
