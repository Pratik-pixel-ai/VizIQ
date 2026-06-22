const TONES = {
  good: { bg: "var(--accent-2-soft)", fg: "var(--accent-2)" },
  warn: { bg: "var(--warn-soft)", fg: "var(--warn)" },
  high: { bg: "var(--high-soft)", fg: "var(--high)" },
  danger: { bg: "var(--danger-soft)", fg: "var(--danger)" },
  accent: { bg: "var(--accent-soft)", fg: "var(--accent)" },
  neutral: { bg: "var(--surface-strong)", fg: "var(--text-secondary)" },
};

export default function Badge({ tone = "neutral", children, className = "" }) {
  const t = TONES[tone] || TONES.neutral;
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${className}`}
      style={{ background: t.bg, color: t.fg }}
    >
      {children}
    </span>
  );
}
