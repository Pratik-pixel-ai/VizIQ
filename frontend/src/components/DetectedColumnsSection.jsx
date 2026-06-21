import { Columns3, Hash, Type, Calendar } from "lucide-react";
import Card from "./ui/Card";

const TYPE_ICON = { NUMBER: Hash, STRING: Type, DATE: Calendar };

export default function DetectedColumnsSection({ columns }) {
  const entries = Object.entries(columns || {});
  if (entries.length === 0) return null;

  return (
    <Card title="Detected Columns" icon={Columns3}>
      <div className="flex flex-wrap gap-2">
        {entries.map(([name, type]) => {
          const Icon = TYPE_ICON[type] || Type;
          return (
            <span
              key={name}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium"
              style={{ background: "var(--surface-strong)", color: "var(--text-secondary)" }}
            >
              <Icon size={12} strokeWidth={2.25} style={{ color: "var(--accent)" }} />
              {name}
              <span className="text-[var(--text-tertiary)]">· {type}</span>
            </span>
          );
        })}
      </div>
    </Card>
  );
}
