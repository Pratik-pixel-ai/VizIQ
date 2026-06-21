import { Rows3, Columns3 } from "lucide-react";

export default function StatsCardsSection({ rows }) {
  const totalRows = Math.max(rows.length - 1, 0);
  const totalCols = rows.length > 0 ? rows[0].length : 0;

  const stats = [
    { label: "Total Rows", value: totalRows, icon: Rows3, tone: "var(--accent)" },
    { label: "Total Columns", value: totalCols, icon: Columns3, tone: "var(--accent-2)" },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
      {stats.map(({ label, value, icon: Icon, tone }) => (
        <div key={label} className="glass-card overflow-hidden">
          <div className="h-1" style={{ background: `linear-gradient(90deg, ${tone}, transparent)` }} />
          <div className="p-5 flex items-center gap-4">
            <span
              className="inline-flex items-center justify-center w-12 h-12 rounded-2xl shrink-0"
              style={{ background: `color-mix(in srgb, ${tone} 15%, transparent)`, color: tone }}
            >
              <Icon size={22} strokeWidth={2.25} />
            </span>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-[var(--text-tertiary)]">
                {label}
              </p>
              <p className="mono-num text-3xl font-bold leading-tight mt-0.5" style={{ color: "var(--text-primary)" }}>
                {value.toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
