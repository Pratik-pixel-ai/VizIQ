import { useEffect, useState } from "react";
import axios from "axios";

function BoxPlotView({ selectedColumn }) {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    if (!selectedColumn) return;
    axios
      .get(`http://localhost:8080/api/boxplot-data?column=${selectedColumn}`)
      .then((response) => setStats(response.data));
  }, [selectedColumn]);

  if (!stats) {
    return <p className="text-sm text-[var(--text-secondary)] py-12 text-center">Select a numeric column.</p>;
  }

  const range = stats.max - stats.min;
  const minPos = 5;
  const maxPos = 95;
  const q1Pos = 5 + ((stats.q1 - stats.min) / range) * 90;
  const medianPos = 5 + ((stats.median - stats.min) / range) * 90;
  const q3Pos = 5 + ((stats.q3 - stats.min) / range) * 90;

  const summary = [
    { label: "Min", value: stats.min },
    { label: "Q1", value: stats.q1 },
    { label: "Median", value: stats.median },
    { label: "Q3", value: stats.q3 },
    { label: "Max", value: stats.max },
  ];

  return (
    <div className="py-6 px-2 sm:px-6">
      <h3 className="text-sm font-semibold text-[var(--text-secondary)] mb-8 text-center">
        Box Plot — {selectedColumn}
      </h3>

      <div className="relative h-32" style={{ borderBottom: "2px solid var(--surface-border)" }}>
        {/* Whisker line */}
        <div
          className="absolute h-0.5 rounded-full"
          style={{ left: `${minPos}%`, width: `${maxPos - minPos}%`, top: "50%", background: "var(--text-tertiary)" }}
        />
        {/* Min cap */}
        <div className="absolute w-0.5 h-6" style={{ left: `${minPos}%`, top: "38%", background: "var(--text-tertiary)" }} />
        {/* Max cap */}
        <div className="absolute w-0.5 h-6" style={{ left: `calc(${maxPos}% - 1px)`, top: "38%", background: "var(--text-tertiary)" }} />

        {/* Box (Q1 -> Q3) */}
        <div
          className="absolute rounded-lg"
          style={{
            left: `${q1Pos}%`,
            width: `${q3Pos - q1Pos}%`,
            top: "33%",
            height: 32,
            background: "var(--accent-soft)",
            border: "2px solid var(--accent)",
          }}
        />

        {/* Median */}
        <div className="absolute w-0.5" style={{ left: `${medianPos}%`, top: "28%", height: 42, background: "var(--accent)" }} />
      </div>

      <div className="flex justify-between mt-6 flex-wrap gap-3">
        {summary.map(({ label, value }) => (
          <div key={label} className="text-center">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-[var(--text-tertiary)]">{label}</p>
            <p className="mono-num text-sm font-bold text-[var(--text-primary)] mt-0.5">{value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default BoxPlotView;
