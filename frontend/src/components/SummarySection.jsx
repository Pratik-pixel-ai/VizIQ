import { BarChart2, Hash, Tag, AlertTriangle, TriangleAlert } from "lucide-react";
import Card from "./ui/Card";

export default function SummarySection({ summary }) {
  if (!summary) return null;

  const items = [
    { label: "Rows", value: summary.rows, icon: BarChart2 },
    { label: "Columns", value: summary.columns, icon: BarChart2 },
    { label: "Numeric Columns", value: summary.numericColumns, icon: Hash },
    { label: "Categorical Columns", value: summary.categoricalColumns, icon: Tag },
    { label: "Missing Values", value: summary.missingValues, icon: AlertTriangle },
    { label: "Outliers", value: summary.outliers, icon: TriangleAlert },
  ];

  return (
    <Card title="Dataset Overview" icon={BarChart2} tone="accent">
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {items.map(({ label, value, icon: Icon }) => (
          <div
            key={label}
            className="rounded-xl px-4 py-3.5"
            style={{ background: "var(--surface-strong)" }}
          >
            <div className="flex items-center gap-1.5 text-[var(--text-tertiary)] mb-1.5">
              <Icon size={13} strokeWidth={2.25} />
              <span className="text-[11px] font-semibold uppercase tracking-wide">{label}</span>
            </div>
            <p className="mono-num text-xl font-bold text-[var(--text-primary)]">{value}</p>
          </div>
        ))}
      </div>
    </Card>
  );
}
