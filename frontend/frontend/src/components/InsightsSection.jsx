import { Lightbulb } from "lucide-react";
import Card from "./ui/Card";

export default function InsightsSection({ insights }) {
  if (insights.length === 0) return null;

  return (
    <Card title="Smart Insights" icon={Lightbulb}>
      <div className="flex flex-col gap-2.5">
        {insights.map((insight, index) => (
          <div
            key={index}
            className="flex items-start gap-3 rounded-xl px-4 py-3.5"
            style={{ background: "var(--accent-soft)" }}
          >
            <span className="text-base shrink-0">💡</span>
            <p className="text-sm leading-relaxed text-[var(--text-primary)]">{insight.message}</p>
          </div>
        ))}
      </div>
    </Card>
  );
}
