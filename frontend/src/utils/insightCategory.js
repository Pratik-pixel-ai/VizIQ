// Backend only sends raw message text, so we classify by content
// to drive icon/color without needing a backend change.
export function categorizeInsight(message) {
  if (/strong relationship/i.test(message)) {
    return { type: "opportunity", label: "Opportunity", emoji: "📈", tone: "good" };
  }
  if (/needs improvement/i.test(message) || /^\d+\s+(missing values|outliers)\s+detected/i.test(message)) {
    return { type: "warning", label: "Warning", emoji: "⚠", tone: "warn" };
  }
  return { type: "insight", label: "Insight", emoji: "💡", tone: "accent" };
}
