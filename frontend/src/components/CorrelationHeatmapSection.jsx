import { Grid3X3 } from "lucide-react";
import Card from "./ui/Card";

function heatColor(value, theme) {
  const abs = Math.abs(value);
  if (value === 1) return { bg: theme === "dark" ? "#3d2e6e" : "#e0dbff", text: theme === "dark" ? "#c4b5fd" : "#4c3d99" };
  if (value > 0) {
    const intensity = abs;
    if (intensity >= 0.7) return { bg: theme === "dark" ? "#1e3a4c" : "#c7f0e8", text: theme === "dark" ? "#00ffa3" : "#006b58" };
    if (intensity >= 0.5) return { bg: theme === "dark" ? "#3a3020" : "#fff3d4", text: theme === "dark" ? "#ffc857" : "#7a5800" };
    return { bg: "var(--surface-strong)", text: "var(--text-tertiary)" };
  }
  if (abs >= 0.5) return { bg: theme === "dark" ? "#3a1e24" : "#ffe0e8", text: theme === "dark" ? "#ff6688" : "#9b1a3a" };
  return { bg: "var(--surface-strong)", text: "var(--text-tertiary)" };
}

export default function CorrelationHeatmapSection({ correlations, theme = "light" }) {
  if (!correlations || correlations.length === 0) return null;

  // Collect unique columns (max 10 for readability)
  const colSet = new Set();
  correlations.forEach((c) => { colSet.add(c.column1); colSet.add(c.column2); });
  const cols = [...colSet].slice(0, 10);

  if (cols.length < 2) return null;

  // Build lookup: always 1.0 on diagonal, correlation value for pairs
  const lookup = {};
  correlations.forEach((c) => {
    const k1 = `${c.column1}|${c.column2}`;
    const k2 = `${c.column2}|${c.column1}`;
    lookup[k1] = c.correlation;
    lookup[k2] = c.correlation;
  });

  const cellSize = Math.min(56, Math.floor(480 / cols.length));
  const labelW = 88;

  return (
    <Card title="Correlation Heatmap" icon={Grid3X3} tone="accent"
      description="Color intensity shows relationship strength between numeric columns">
      <div className="overflow-auto pb-1">
        <div style={{ minWidth: labelW + cols.length * cellSize }}>
          {/* Column headers row */}
          <div className="flex" style={{ paddingLeft: labelW }}>
            {cols.map((col) => (
              <div
                key={col}
                className="shrink-0 flex items-end justify-center pb-2"
                style={{ width: cellSize }}
              >
                <span
                  className="text-[10px] font-semibold text-[var(--text-tertiary)] leading-none"
                  style={{
                    writingMode: "vertical-rl",
                    transform: "rotate(180deg)",
                    maxHeight: 80,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {col}
                </span>
              </div>
            ))}
          </div>

          {/* Matrix rows */}
          {cols.map((rowCol) => (
            <div key={rowCol} className="flex items-center">
              {/* Row label */}
              <div
                className="shrink-0 flex items-center pr-2"
                style={{ width: labelW }}
              >
                <span
                  className="text-xs font-medium text-[var(--text-secondary)] truncate"
                  title={rowCol}
                >
                  {rowCol}
                </span>
              </div>

              {/* Cells */}
              {cols.map((colCol) => {
                const val = rowCol === colCol ? 1 : (lookup[`${rowCol}|${colCol}`] ?? null);
                const colors = val !== null ? heatColor(val, theme) : { bg: "var(--surface-strong)", text: "var(--text-tertiary)" };
                return (
                  <div
                    key={colCol}
                    className="shrink-0 flex items-center justify-center font-mono text-[11px] font-bold
                               transition-transform hover:scale-110 hover:z-10 relative"
                    style={{
                      width: cellSize,
                      height: cellSize,
                      background: colors.bg,
                      color: colors.text,
                      border: "2px solid var(--bg-base)",
                      borderRadius: 6,
                      cursor: "default",
                    }}
                    title={`${rowCol} ↔ ${colCol}: ${val !== null ? val.toFixed(3) : "n/a"}`}
                  >
                    {val !== null ? val.toFixed(2) : "—"}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 mt-4 flex-wrap">
        {[
          { color: "#c7f0e8", label: "Strong Positive (≥0.7)" },
          { color: "#fff3d4", label: "Moderate (≥0.5)" },
          { color: "#ffe0e8", label: "Negative" },
          { bg: "var(--surface-strong)", label: "Weak / None" },
        ].map(({ color, bg, label }) => (
          <div key={label} className="flex items-center gap-1.5">
            <div
              className="w-4 h-4 rounded"
              style={{ background: color || bg, border: "1px solid var(--surface-border)" }}
            />
            <span className="text-xs text-[var(--text-tertiary)]">{label}</span>
          </div>
        ))}
      </div>
    </Card>
  );
}
