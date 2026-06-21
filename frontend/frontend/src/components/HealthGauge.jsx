import { useEffect, useState } from "react";

const STATUS_COLOR = {
  Excellent: "var(--accent-2)",
  Good: "var(--accent)",
  Fair: "var(--warn)",
  Poor: "var(--danger)",
};

export default function HealthGauge({ score = 0, status = "Good", size = 168 }) {
  const [animated, setAnimated] = useState(0);
  const stroke = 12;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const color = STATUS_COLOR[status] || "var(--accent)";

  useEffect(() => {
    const id = requestAnimationFrame(() => setAnimated(score));
    return () => cancelAnimationFrame(id);
  }, [score]);

  const offset = circumference - (Math.min(animated, 100) / 100) * circumference;

  return (
    <div className="relative inline-flex items-center justify-center shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="var(--surface-strong)"
          strokeWidth={stroke}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{
            transition: "stroke-dashoffset 1.1s cubic-bezier(0.16, 1, 0.3, 1)",
            filter: `drop-shadow(0 0 8px ${color})`,
          }}
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className="mono-num text-3xl font-bold leading-none" style={{ color }}>
          {Math.round(animated)}
        </span>
        <span className="text-[11px] text-[var(--text-tertiary)] mt-1 font-medium">/ 100</span>
      </div>
    </div>
  );
}
