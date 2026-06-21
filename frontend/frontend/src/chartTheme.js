// Shared recharts theming — uses CSS custom properties so charts
// automatically adapt when the user toggles light/dark theme.

export const tooltipStyle = {
  contentStyle: {
    background: "var(--surface-strong)",
    border: "1px solid var(--surface-border)",
    borderRadius: 12,
    backdropFilter: "blur(12px)",
    color: "var(--text-primary)",
    fontSize: 13,
    fontFamily: "var(--font-body)",
    boxShadow: "var(--shadow-glass)",
  },
  labelStyle: { color: "var(--text-secondary)", fontWeight: 600, marginBottom: 4 },
  itemStyle: { color: "var(--text-primary)" },
  cursor: { fill: "var(--accent-soft)" },
};

export const axisProps = {
  tick: { fill: "var(--text-tertiary)", fontSize: 12, fontFamily: "var(--font-body)" },
  axisLine: { stroke: "var(--surface-border)" },
  tickLine: { stroke: "var(--surface-border)" },
};

export const gridProps = {
  stroke: "var(--surface-border)",
  strokeDasharray: "3 3",
};

export const palette = [
  "var(--accent)",
  "var(--accent-2)",
  "var(--warn)",
  "var(--danger)",
  "#4F8CFF",
  "#FFC857",
];
