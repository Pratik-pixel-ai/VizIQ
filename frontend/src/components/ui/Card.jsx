const TONE_VARS = {
  accent: { soft: "var(--accent-soft)", fg: "var(--accent)" },
  good: { soft: "var(--accent-2-soft)", fg: "var(--accent-2)" },
  warn: { soft: "var(--warn-soft)", fg: "var(--warn)" },
  danger: { soft: "var(--danger-soft)", fg: "var(--danger)" },
  neutral: { soft: "var(--surface-strong)", fg: "var(--text-secondary)" },
};

export default function Card({
  title,
  description,
  icon: Icon,
  action,
  tone = "accent",
  className = "",
  bodyClassName = "p-5 sm:p-6",
  children,
}) {
  const t = TONE_VARS[tone] || TONE_VARS.accent;
  const hasHeader = title || action;

  return (
    <div className={`glass-card overflow-hidden ${className}`}>
      {hasHeader && (
        <div
          className="flex items-center justify-between gap-3 px-5 sm:px-6 py-4"
          style={{ background: `linear-gradient(90deg, ${t.soft}, transparent 85%)` }}
        >
          <div className="min-w-0">
            {title && (
              <h2 className="flex items-center gap-2 text-[15px] font-semibold tracking-tight text-[var(--text-primary)]">
                {Icon && (
                  <span
                    className="inline-flex items-center justify-center w-7 h-7 rounded-lg shrink-0"
                    style={{ background: t.soft, color: t.fg }}
                  >
                    <Icon size={15} strokeWidth={2.25} />
                  </span>
                )}
                {title}
              </h2>
            )}
            {description && (
              <p className="text-xs text-[var(--text-secondary)] mt-1 ml-9">{description}</p>
            )}
          </div>
          {action && <div className="shrink-0">{action}</div>}
        </div>
      )}
      <div className={bodyClassName}>{children}</div>
    </div>
  );
}
