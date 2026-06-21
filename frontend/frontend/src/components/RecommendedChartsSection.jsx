import { Wand2 } from "lucide-react";
import Card from "./ui/Card";

const TYPE_MAP = {
  BAR_CHART: "BAR",
  PIE_CHART: "PIE",
  HISTOGRAM: "HISTOGRAM",
  SCATTER_PLOT: "SCATTER",
  LINE_CHART: "LINE",
  AREA_CHART: "AREA",
  BUBBLE_CHART: "BUBBLE",
  BOX_PLOT: "BOXPLOT",
  HEAT_MAP: "HEATMAP",
};

export default function RecommendedChartsSection({ charts, setChartType, formatChartName }) {
  if (!charts || charts.length === 0) return null;

  return (
    <Card title="Recommended Charts" icon={Wand2}>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {charts.map((chart, index) => (
          <button
            key={index}
            onClick={() => setChartType(TYPE_MAP[chart.chartType] || "BAR")}
            className="text-left rounded-xl p-4 cursor-pointer transition-all duration-200 group"
            style={{ background: "var(--surface-strong)", border: "1px solid var(--surface-border)" }}
            onMouseEnter={(e) => (e.currentTarget.style.borderColor = "var(--accent)")}
            onMouseLeave={(e) => (e.currentTarget.style.borderColor = "var(--surface-border)")}
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-sm font-bold text-[var(--text-primary)]">
                #{index + 1} {formatChartName(chart.chartType)}
              </span>
              <span className="mono-num text-xs font-bold px-2 py-0.5 rounded-full" style={{ background: "var(--accent-soft)", color: "var(--accent)" }}>
                {chart.score}
              </span>
            </div>
            <p className="text-xs text-[var(--text-secondary)] leading-relaxed">{chart.reason}</p>
          </button>
        ))}
      </div>
    </Card>
  );
}
