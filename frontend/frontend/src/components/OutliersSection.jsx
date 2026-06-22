import { TriangleAlert } from "lucide-react";
import Card from "./ui/Card";
import Badge from "./ui/Badge";
import EmptyState from "./ui/EmptyState";
import { getOutlierTone } from "../utils/severity";

export default function OutliersSection({ outliers, groupedOutliers }) {
  return (
    <Card title="Potential Outliers" icon={TriangleAlert} tone="danger">
      {outliers.length === 0 ? (
        <EmptyState message="No significant outliers detected" />
      ) : (
        <div className="flex flex-col gap-3">
          {Object.entries(groupedOutliers).map(([column, items]) => (
            <div
              key={column}
              className="rounded-xl p-4"
              style={{ background: "var(--surface-strong)" }}
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-bold text-[var(--text-primary)]">{column}</h3>
                <Badge tone={getOutlierTone(items[0].severity)}>{items[0].severity}</Badge>
              </div>
              <p className="text-xs text-[var(--text-secondary)] mb-2">
                Expected range:{" "}
                <span className="mono-num font-semibold text-[var(--text-primary)]">
                  {items[0].lowerBound.toFixed(2)} → {items[0].upperBound.toFixed(2)}
                </span>
              </p>
              <p className="mono-num text-xs leading-relaxed text-[var(--text-secondary)] break-words">
                {items.map((item) => item.value).join(" • ")}
              </p>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}
