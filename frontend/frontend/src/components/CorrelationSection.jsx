import { Link2, ArrowUp, ArrowDown } from "lucide-react";
import Card from "./ui/Card";
import Badge from "./ui/Badge";

function strengthMeta(value) {
  const abs = Math.abs(value);
  if (abs >= 0.7) return { label: "Strong", tone: "good", color: "var(--accent-2)" };
  if (abs >= 0.5) return { label: "Moderate", tone: "warn", color: "var(--warn)" };
  return { label: "Weak", tone: "danger", color: "var(--danger)" };
}

export default function CorrelationSection({ correlations }) {
  if (correlations.length === 0) return null;

  return (
    <Card title="Strong Relationships" icon={Link2} tone="good">
      <div className="flex flex-col gap-2.5">
        {correlations.map((corr, index) => {
          const strength = Math.abs(corr.correlation);
          const meta = strengthMeta(corr.correlation);
          const isPositive = corr.correlation >= 0;

          return (
            <div
              key={index}
              className="flex items-center justify-between gap-3 rounded-xl px-4 py-3"
              style={{ background: "var(--surface-strong)" }}
            >
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2 mb-2">
                  <p className="text-sm font-semibold text-[var(--text-primary)] truncate">
                    🔗 {corr.column1} ↔ {corr.column2}
                  </p>
                  <Badge tone={meta.tone}>{meta.label}</Badge>
                </div>
                <div className="h-1.5 w-full rounded-full overflow-hidden" style={{ background: "var(--bg-base)" }}>
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{ width: `${strength * 100}%`, background: meta.color }}
                  />
                </div>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                {isPositive ? (
                  <ArrowUp size={14} style={{ color: meta.color }} />
                ) : (
                  <ArrowDown size={14} style={{ color: meta.color }} />
                )}
                <span className="mono-num text-sm font-bold" style={{ color: meta.color }}>
                  {corr.correlation.toFixed(2)}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
