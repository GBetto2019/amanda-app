interface SunIconProps {
  className?: string;
  size?: number;
  variant?: "filled" | "outline";
}

export function SunIcon({ className = "", size = 48, variant = "filled" }: SunIconProps) {
  if (variant === "outline") {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        fill="none"
        className={className}
        aria-hidden="true"
      >
        <line x1="6" y1="65" x2="94" y2="65" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
        <path d="M28 65 a22 22 0 0 1 44 0" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
        <line x1="50" y1="20" x2="50" y2="30" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
        <line x1="18" y1="33" x2="25" y2="40" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
        <line x1="82" y1="33" x2="75" y2="40" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
        <line x1="8" y1="55" x2="18" y2="55" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
        <line x1="82" y1="55" x2="92" y2="55" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
      </svg>
    );
  }

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <line x1="6" y1="65" x2="94" y2="65" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
      <circle cx="50" cy="65" r="22" fill="currentColor" />
      <line x1="50" y1="20" x2="50" y2="30" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
      <line x1="18" y1="33" x2="25" y2="40" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
      <line x1="82" y1="33" x2="75" y2="40" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
      <line x1="8" y1="55" x2="18" y2="55" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
      <line x1="82" y1="55" x2="92" y2="55" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}
