export default function Card({
  title,
  icon: Icon,
  action,
  className = "",
  children,
}) {
  return (
    <div className={`glass-card p-5 sm:p-6 ${className}`}>
      {(title || action) && (
        <div className="flex items-center justify-between mb-4 gap-3">
          {title && (
            <h2 className="flex items-center gap-2 text-[15px] font-semibold tracking-tight text-[var(--text-primary)]">
              {Icon && (
                <span
                  className="inline-flex items-center justify-center w-7 h-7 rounded-lg shrink-0"
                  style={{ background: "var(--accent-soft)", color: "var(--accent)" }}
                >
                  <Icon size={15} strokeWidth={2.25} />
                </span>
              )}
              {title}
            </h2>
          )}
          {action}
        </div>
      )}
      {children}
    </div>
  );
}
