import { HeartPulse } from "lucide-react";
import Card from "./ui/Card";
import Badge from "./ui/Badge";
import HealthGauge from "./HealthGauge";

const STATUS_TONE = {
  Excellent: "good",
  Good: "accent",
  Fair: "warn",
  Poor: "danger",
};

const STATUS_EMOJI = {
  Excellent: "🟢",
  Good: "🔵",
  Fair: "🟠",
  Poor: "🔴",
};

const BREAKDOWN = [
  { key: "datasetSizeScore", max: 25, label: "Dataset Size" },
  { key: "numericQualityScore", max: 20, label: "Numeric Quality" },
  { key: "relationshipScore", max: 15, label: "Relationships" },
  { key: "diversityScore", max: 15, label: "Diversity" },
  { key: "completenessScore", max: 25, label: "Completeness" },
];

export default function HealthSection({ datasetHealth }) {
  if (!datasetHealth) return null;

  return (
    <Card title="Dataset Health" icon={HeartPulse} tone="good">
      <div className="flex flex-col md:flex-row items-center gap-8">
        <div className="flex flex-col items-center gap-3 shrink-0">
          <HealthGauge score={datasetHealth.score} status={datasetHealth.status} />
          <Badge tone={STATUS_TONE[datasetHealth.status] || "neutral"}>
            {STATUS_EMOJI[datasetHealth.status]} {datasetHealth.status}
          </Badge>
        </div>

        <div className="flex-1 w-full flex flex-col gap-3.5">
          {BREAKDOWN.map(({ key, max, label }) => {
            const value = datasetHealth[key] ?? 0;
            const pct = Math.min((value / max) * 100, 100);
            return (
              <div key={key}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-sm font-medium text-[var(--text-secondary)]">{label}</span>
                  <span className="mono-num text-xs font-semibold text-[var(--text-primary)]">
                    {value}/{max}
                  </span>
                </div>
                <div className="h-2 rounded-full overflow-hidden" style={{ background: "var(--surface-strong)" }}>
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{ width: `${pct}%`, background: "var(--accent)" }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Card>
  );
}
