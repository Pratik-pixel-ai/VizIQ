import { ChevronDown } from "lucide-react";

export default function Select({ label, value, onChange, children, className = "" }) {
  return (
    <label className={`flex flex-col gap-1.5 ${className}`}>
      {label && (
        <span className="text-xs font-semibold uppercase tracking-wide text-[var(--text-tertiary)]">
          {label}
        </span>
      )}
      <div className="relative">
        <select
          value={value}
          onChange={onChange}
          className="w-full appearance-none rounded-xl px-3.5 py-2.5 pr-9 text-sm font-medium
                     border outline-none cursor-pointer transition-colors
                     bg-[var(--surface-strong)] border-[var(--surface-border)] text-[var(--text-primary)]
                     hover:bg-[var(--surface-hover)] focus:ring-2"
          style={{ "--tw-ring-color": "var(--accent)" }}
        >
          {children}
        </select>
        <ChevronDown
          size={16}
          className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2"
          style={{ color: "var(--text-tertiary)" }}
        />
      </div>
    </label>
  );
}
