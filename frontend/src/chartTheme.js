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

export const chartDescriptions = {
  BAR: "Compares values across categories — best for ranking or spotting the biggest/smallest groups.",
  PIE: "Shows each category's share of the whole. Works best with 10 or fewer categories.",
  HISTOGRAM: "Groups numeric values into ranges to reveal the shape and spread of your data's distribution.",
  SCATTER: "Plots two numeric variables against each other to surface correlation or clustering patterns.",
  LINE: "Tracks how a value changes across a continuous axis — ideal for trends over time or sequence.",
  AREA: "Like a line chart, but the filled area emphasizes magnitude and cumulative change.",
  BUBBLE: "A scatter plot with a third dimension — bubble size encodes an extra numeric variable.",
  BOXPLOT: "Summarizes a column's distribution: median, quartiles, range, and where outliers fall.",
  HEATMAP: "Bins two numeric variables into a grid and colors by density — good for spotting hot zones.",
};
