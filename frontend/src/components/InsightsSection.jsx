import { Lightbulb } from "lucide-react";
import Card from "./ui/Card";
import Badge from "./ui/Badge";
import { categorizeInsight } from "../utils/insightCategory";

const TONE_BORDER = {
  accent: "var(--accent)",
  warn: "var(--warn)",
  good: "var(--accent-2)",
};

export default function InsightsSection({ insights }) {
  if (insights.length === 0) return null;

  return (
    <Card title="Smart Insights" icon={Lightbulb} tone="accent">
      <div className="flex flex-col gap-2.5">
        {insights.map((insight, index) => {
          const cat = categorizeInsight(insight.message);
          return (
            <div
              key={index}
              className="flex items-start gap-3 rounded-xl pl-3.5 pr-4 py-3.5"
              style={{
                background: `var(--${cat.tone === "good" ? "accent-2" : cat.tone}-soft)`,
                borderLeft: `3px solid ${TONE_BORDER[cat.tone]}`,
              }}
            >
              <span className="text-base shrink-0 leading-none mt-0.5">{cat.emoji}</span>
              <p className="text-sm leading-relaxed text-[var(--text-primary)] flex-1">{insight.message}</p>
              <Badge tone={cat.tone} className="shrink-0">
                {cat.label}
              </Badge>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
