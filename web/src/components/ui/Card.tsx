import { type ReactNode } from "react";

type CardVariant = "default" | "linen" | "cafe" | "sol" | "amber" | "brasa";

interface CardProps {
  children: ReactNode;
  variant?: CardVariant;
  className?: string;
}

const variantClasses: Record<CardVariant, string> = {
  default: "bg-white border border-[var(--linha-soft)]",
  linen:   "bg-linho border border-[var(--linha-soft)]",
  cafe:    "bg-cafe text-creme",
  sol:     "bg-sol text-creme",
  amber:   "bg-amanhecer text-cafe",
  brasa:   "bg-brasa text-creme",
};

export function Card({ children, variant = "default", className = "" }: CardProps) {
  return (
    <div className={`rounded-[1.75rem] p-10 ${variantClasses[variant]} ${className}`}>
      {children}
    </div>
  );
}
