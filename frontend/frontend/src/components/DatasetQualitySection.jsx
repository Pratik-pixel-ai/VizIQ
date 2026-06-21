import { ShieldCheck } from "lucide-react";
import Card from "./ui/Card";
import EmptyState from "./ui/EmptyState";

export default function DatasetQualitySection({ missingValues }) {
  return (
    <Card title="Dataset Quality" icon={ShieldCheck}>
      {missingValues.length === 0 ? (
        <EmptyState message="No missing values detected" />
      ) : (
        <div className="flex flex-col gap-2.5">
          {missingValues.map((item, index) => (
            <div
              key={index}
              className="flex items-center justify-between rounded-xl px-4 py-3"
              style={{ background: "var(--warn-soft)" }}
            >
              <span className="text-sm font-medium text-[var(--text-primary)]">
                ⚠ {item.column}
              </span>
              <span className="mono-num text-sm font-bold" style={{ color: "var(--warn)" }}>
                {item.missingCount} missing
              </span>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}
