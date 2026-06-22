import { FileSpreadsheet, Calendar, Rows3, Columns3, HardDrive } from "lucide-react";
import Card from "./ui/Card";

export default function DatasetMetadataCard({ metadata, summary }) {
  if (!metadata || !metadata.filename || metadata.filename === "dataset.csv") return null;

  const fields = [
    { label: "Dataset Name", value: metadata.filename, icon: FileSpreadsheet, full: true },
    { label: "Uploaded At", value: metadata.uploadedAt, icon: Calendar },
    { label: "Rows", value: summary ? summary.rows?.toLocaleString() : "—", icon: Rows3 },
    { label: "Columns", value: summary ? String(summary.columns) : "—", icon: Columns3 },
    { label: "Size", value: metadata.fileSize, icon: HardDrive },
  ];

  return (
    <Card title="Dataset Metadata" icon={FileSpreadsheet} tone="accent">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {/* Filename spans full width */}
        <div
          className="col-span-2 sm:col-span-4 flex items-center gap-3 rounded-xl px-4 py-3"
          style={{ background: "var(--accent-soft)" }}
        >
          <FileSpreadsheet size={18} style={{ color: "var(--accent)" }} className="shrink-0" />
          <div className="min-w-0">
            <p className="text-[10px] font-semibold uppercase tracking-wide text-[var(--text-tertiary)]">Dataset Name</p>
            <p className="font-semibold text-sm text-[var(--text-primary)] truncate mt-0.5">{metadata.filename}</p>
          </div>
        </div>

        {/* Remaining 4 fields in a 2x2 / 4-column grid */}
        {fields.slice(1).map(({ label, value, icon: Icon }) => (
          <div
            key={label}
            className="flex flex-col gap-1 rounded-xl px-4 py-3"
            style={{ background: "var(--surface-strong)" }}
          >
            <div className="flex items-center gap-1.5">
              <Icon size={12} style={{ color: "var(--text-tertiary)" }} />
              <span className="text-[10px] font-semibold uppercase tracking-wide text-[var(--text-tertiary)]">{label}</span>
            </div>
            <p className="mono-num text-lg font-bold text-[var(--text-primary)] leading-tight">{value || "—"}</p>
          </div>
        ))}
      </div>
    </Card>
  );
}
