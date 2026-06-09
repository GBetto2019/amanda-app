import { type ReactNode } from "react";

interface ButtonProps {
  children: ReactNode;
  variant?: "primary" | "ghost";
  size?: "sm" | "md" | "lg";
  className?: string;
  onClick?: () => void;
  type?: "button" | "submit";
  disabled?: boolean;
}

export function Button({
  children,
  variant = "primary",
  size = "md",
  className = "",
  onClick,
  type = "button",
  disabled,
}: ButtonProps) {
  const base = "inline-flex items-center justify-center font-mono text-[11px] tracking-[0.16em] uppercase rounded-full transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed";

  const variants = {
    primary: "bg-cafe text-creme hover:bg-cafe-2 active:scale-[0.98]",
    ghost: "border border-cafe/20 text-cafe hover:bg-cafe/5 active:scale-[0.98]",
  };

  const sizes = {
    sm: "px-4 py-2.5",
    md: "px-6 py-3.5",
    lg: "px-8 py-4",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
    >
      {children}
    </button>
  );
}
