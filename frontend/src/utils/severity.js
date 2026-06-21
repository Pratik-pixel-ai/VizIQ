// Classifies missing-value severity by what % of rows in a column are empty.
export function getMissingSeverity(missingCount, totalRows) {
  const pct = totalRows > 0 ? (missingCount / totalRows) * 100 : 0;

  if (pct >= 30) return { label: "Extreme", tone: "danger", pct };
  if (pct >= 15) return { label: "High", tone: "high", pct };
  if (pct >= 5) return { label: "Medium", tone: "warn", pct };
  return { label: "Low", tone: "good", pct };
}

// Maps backend outlier severity strings onto the same Low/Medium/High/Extreme tone scale.
export function getOutlierTone(severity) {
  if (severity === "Extreme") return "danger";
  if (severity === "Strong") return "high";
  return "warn";
}
