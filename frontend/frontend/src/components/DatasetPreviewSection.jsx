import { Table2 } from "lucide-react";
import Card from "./ui/Card";

export default function DatasetPreviewSection({ rows }) {
  if (rows.length === 0) return null;

  return (
    <Card title="Dataset Preview" icon={Table2}>
      <div className="overflow-auto rounded-xl border" style={{ borderColor: "var(--surface-border)", maxHeight: 420 }}>
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr>
              {rows[0].map((header, index) => (
                <th
                  key={index}
                  className="sticky top-0 text-left px-4 py-2.5 text-xs font-semibold uppercase tracking-wide whitespace-nowrap"
                  style={{ background: "var(--surface-strong)", color: "var(--text-tertiary)", backdropFilter: "blur(8px)" }}
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.slice(1).map((row, rowIndex) => (
              <tr
                key={rowIndex}
                style={{ background: rowIndex % 2 === 0 ? "transparent" : "var(--surface)" }}
              >
                {row.map((cell, cellIndex) => (
                  <td
                    key={cellIndex}
                    className="mono-num px-4 py-2 whitespace-nowrap"
                    style={{ color: "var(--text-secondary)", borderTop: "1px solid var(--surface-border)" }}
                  >
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
