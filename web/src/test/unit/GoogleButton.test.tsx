import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { GoogleButton } from "@/components/ui/GoogleButton";

const mockSignInWithOAuth = vi.fn();

vi.mock("@/lib/supabase/client", () => ({
  createClient: () => ({
    auth: {
      signInWithOAuth: mockSignInWithOAuth,
    },
  }),
}));

describe("GoogleButton", () => {
  beforeEach(() => {
    mockSignInWithOAuth.mockClear();
    mockSignInWithOAuth.mockResolvedValue({ data: {}, error: null });
  });

  it("renderiza o botão com texto correto", () => {
    render(<GoogleButton />);
    expect(screen.getByText("Entrar com Google")).toBeInTheDocument();
  });

  it("renderiza o SVG do logo Google", () => {
    const { container } = render(<GoogleButton />);
    expect(container.querySelector("svg")).toBeInTheDocument();
  });

  it("chama signInWithOAuth com provider google ao clicar", () => {
    render(<GoogleButton />);
    fireEvent.click(screen.getByText("Entrar com Google"));
    expect(mockSignInWithOAuth).toHaveBeenCalledWith(
      expect.objectContaining({ provider: "google" })
    );
  });

  it("passa redirectTo com /auth/callback ao clicar", () => {
    render(<GoogleButton />);
    fireEvent.click(screen.getByText("Entrar com Google"));
    expect(mockSignInWithOAuth).toHaveBeenCalledWith(
      expect.objectContaining({
        options: expect.objectContaining({
          redirectTo: expect.stringContaining("/auth/callback"),
        }),
      })
    );
  });

  it("aceita className extra", () => {
    const { container } = render(<GoogleButton className="minha-classe" />);
    expect((container.firstChild as HTMLElement).className).toContain("minha-classe");
  });
});
