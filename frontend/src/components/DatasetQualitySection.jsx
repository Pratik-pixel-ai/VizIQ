import { ShieldCheck } from "lucide-react";
import Card from "./ui/Card";
import Badge from "./ui/Badge";
import EmptyState from "./ui/EmptyState";
import { getMissingSeverity } from "../utils/severity";

export default function DatasetQualitySection({ missingValues, totalRows }) {
  return (
    <Card title="Dataset Quality" icon={ShieldCheck} tone="warn">
      {missingValues.length === 0 ? (
        <EmptyState message="No missing values detected" />
      ) : (
        <div className="flex flex-col gap-2.5">
          {missingValues.map((item, index) => {
            const { label, tone, pct } = getMissingSeverity(item.missingCount, totalRows);
            return (
              <div
                key={index}
                className="flex items-center justify-between gap-3 rounded-xl px-4 py-3"
                style={{ background: "var(--surface-strong)" }}
              >
                <div className="min-w-0">
                  <p className="text-sm font-medium text-[var(--text-primary)] truncate">{item.column}</p>
                  <p className="mono-num text-xs text-[var(--text-tertiary)] mt-0.5">
                    {item.missingCount} missing · {pct.toFixed(1)}%
                  </p>
                </div>
                <Badge tone={tone}>{label}</Badge>
              </div>
            );
          })}
        </div>
      )}
    </Card>
  );
}
