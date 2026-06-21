import { Sun, Moon, FileDown } from "lucide-react";

const TITLES = {
  dashboard: { title: "Dashboard", subtitle: "Your dataset, decoded at a glance" },
  charts: { title: "Charts", subtitle: "Build and explore custom visualizations" },
};

export default function Header({ activePage, theme, toggleTheme, downloadReport }) {
  const { title, subtitle } = TITLES[activePage] || TITLES.dashboard;

  return (
    <header className="sticky top-4 z-30 mb-6">
      <div className="glass-strong rounded-2xl px-5 py-4 flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight">{title}</h1>
          <p className="text-sm text-[var(--text-secondary)] mt-0.5">{subtitle}</p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={downloadReport}
            className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-sm font-semibold
                       text-white transition-all duration-200 cursor-pointer hover:brightness-110"
            style={{ background: "var(--accent)", boxShadow: "0 4px 18px -3px var(--accent)" }}
          >
            <FileDown size={16} strokeWidth={2.25} />
            <span className="hidden sm:inline">Generate Report</span>
          </button>

          <button
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="relative inline-flex items-center justify-center w-10 h-10 rounded-xl cursor-pointer
                       bg-[var(--surface-strong)] border border-[var(--surface-border)] hover:bg-[var(--surface-hover)]
                       transition-colors duration-200 overflow-hidden"
          >
            <Sun
              size={17}
              strokeWidth={2.25}
              className="absolute transition-all duration-300"
              style={{
                color: "var(--warn)",
                opacity: theme === "light" ? 1 : 0,
                transform: theme === "light" ? "rotate(0deg) scale(1)" : "rotate(90deg) scale(0.5)",
              }}
            />
            <Moon
              size={17}
              strokeWidth={2.25}
              className="absolute transition-all duration-300"
              style={{
                color: "var(--accent)",
                opacity: theme === "dark" ? 1 : 0,
                transform: theme === "dark" ? "rotate(0deg) scale(1)" : "rotate(-90deg) scale(0.5)",
              }}
            />
          </button>
        </div>
      </div>
    </header>
  );
}
