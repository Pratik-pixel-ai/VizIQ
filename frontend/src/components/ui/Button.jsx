const VARIANTS = {
  primary:
    "text-white shadow-[0_4px_20px_-2px_var(--accent)] hover:brightness-110 active:brightness-95",
  secondary:
    "bg-[var(--surface-strong)] border border-[var(--surface-border)] text-[var(--text-primary)] hover:bg-[var(--surface-hover)]",
  ghost: "text-[var(--text-secondary)] hover:bg-[var(--surface-hover)]",
};

export default function Button({
  variant = "primary",
  icon: Icon,
  children,
  className = "",
  ...props
}) {
  return (
    <button
      className={`inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold
                  transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed
                  ${VARIANTS[variant]} ${className}`}
      style={variant === "primary" ? { background: "var(--accent)" } : undefined}
      {...props}
    >
      {Icon && <Icon size={16} strokeWidth={2.25} />}
      {children}
    </button>
  );
}
