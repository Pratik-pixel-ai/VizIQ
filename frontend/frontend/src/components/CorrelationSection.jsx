import { Link2 } from "lucide-react";
import Card from "./ui/Card";

export default function CorrelationSection({ correlations }) {
  if (correlations.length === 0) return null;

  return (
    <Card title="Strong Relationships" icon={Link2}>
      <div className="flex flex-col gap-2.5">
        {correlations.map((corr, index) => {
          const strength = Math.abs(corr.correlation);
          return (
            <div
              key={index}
              className="flex items-center justify-between gap-3 rounded-xl px-4 py-3"
              style={{ background: "var(--surface-strong)" }}
            >
              <div className="min-w-0">
                <p className="text-sm font-semibold text-[var(--text-primary)] truncate">
                  🔗 {corr.column1} ↔ {corr.column2}
                </p>
                <div className="h-1.5 w-32 rounded-full overflow-hidden mt-2" style={{ background: "var(--bg-base)" }}>
                  <div
                    className="h-full rounded-full"
                    style={{ width: `${strength * 100}%`, background: "var(--accent-2)" }}
                  />
                </div>
              </div>
              <span className="mono-num text-sm font-bold shrink-0" style={{ color: "var(--accent-2)" }}>
                {corr.correlation.toFixed(2)}
              </span>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
