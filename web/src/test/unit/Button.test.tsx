import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { Button } from "@/components/ui/Button";

describe("Button", () => {
  it("renderiza o label do filho", () => {
    render(<Button>Salvar</Button>);
    expect(screen.getByRole("button", { name: "Salvar" })).toBeInTheDocument();
  });

  it("variante primary aplica bg-cafe por padrão", () => {
    render(<Button>OK</Button>);
    expect(screen.getByRole("button")).toHaveClass("bg-cafe");
  });

  it("variante ghost aplica border sem fundo sólido", () => {
    render(<Button variant="ghost">Cancelar</Button>);
    const btn = screen.getByRole("button");
    const classes = btn.className.split(" ");
    expect(btn.className).toContain("border");
    // bg-cafe não deve aparecer como classe isolada (hover:bg-cafe/5 é diferente)
    expect(classes).not.toContain("bg-cafe");
  });

  it("tamanho lg tem padding maior", () => {
    render(<Button size="lg">Grande</Button>);
    expect(screen.getByRole("button").className).toContain("px-8");
  });

  it("tamanho sm tem padding menor", () => {
    render(<Button size="sm">Pequeno</Button>);
    expect(screen.getByRole("button").className).toContain("px-4");
  });

  it("chama onClick ao ser clicado", () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Clique</Button>);
    fireEvent.click(screen.getByRole("button"));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("não chama onClick quando desabilitado", () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick} disabled>Bloqueado</Button>);
    fireEvent.click(screen.getByRole("button"));
    expect(handleClick).not.toHaveBeenCalled();
  });

  it("tipo padrão é button (não submit)", () => {
    render(<Button>Btn</Button>);
    expect(screen.getByRole("button")).toHaveAttribute("type", "button");
  });

  it("tipo submit é aplicado corretamente", () => {
    render(<Button type="submit">Enviar</Button>);
    expect(screen.getByRole("button")).toHaveAttribute("type", "submit");
  });

  it("aplica opacity-50 quando desabilitado", () => {
    render(<Button disabled>Off</Button>);
    expect(screen.getByRole("button").className).toContain("disabled:opacity-50");
  });
});
