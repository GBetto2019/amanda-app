import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { SunIcon } from "@/components/ui/SunIcon";

describe("SunIcon", () => {
  it("renderiza um SVG", () => {
    const { container } = render(<SunIcon />);
    expect(container.querySelector("svg")).toBeInTheDocument();
  });

  it("aplica o tamanho passado via prop size", () => {
    const { container } = render(<SunIcon size={64} />);
    const svg = container.querySelector("svg")!;
    expect(svg.getAttribute("width")).toBe("64");
    expect(svg.getAttribute("height")).toBe("64");
  });

  it("usa tamanho padrão 48 quando size não é passado", () => {
    const { container } = render(<SunIcon />);
    const svg = container.querySelector("svg")!;
    expect(svg.getAttribute("width")).toBe("48");
    expect(svg.getAttribute("height")).toBe("48");
  });

  it("aplica className passada", () => {
    const { container } = render(<SunIcon className="text-sol" />);
    const svg = container.querySelector("svg")!;
    // SVG usa getAttribute("class"), não .className (SVGAnimatedString)
    expect(svg.getAttribute("class")).toContain("text-sol");
  });

  it("variante filled renderiza um círculo preenchido", () => {
    const { container } = render(<SunIcon variant="filled" />);
    expect(container.querySelector("circle")).toBeInTheDocument();
  });

  it("variante outline não renderiza círculo preenchido", () => {
    const { container } = render(<SunIcon variant="outline" />);
    expect(container.querySelector("circle")).not.toBeInTheDocument();
  });

  it("tem aria-hidden para acessibilidade", () => {
    const { container } = render(<SunIcon />);
    expect(container.querySelector("svg")?.getAttribute("aria-hidden")).toBe("true");
  });
});
