import { LayoutDashboard, BarChart3, Sparkles, Database } from "lucide-react";

const NAV_ITEMS = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "charts", label: "Charts", icon: BarChart3 },
];

export default function Sidebar({ activePage, setActivePage }) {
  return (
    <>
      {/* Desktop floating sidebar */}
      <aside className="hidden md:flex flex-col w-64 shrink-0 p-4">
        <div className="glass-strong rounded-2xl flex flex-col h-full p-4 sticky top-4">
          <div className="flex items-center gap-2.5 px-2 py-3 mb-4">
            <span
              className="inline-flex items-center justify-center w-9 h-9 rounded-xl"
              style={{ background: "var(--accent)" }}
            >
              <Database size={18} className="text-white" strokeWidth={2.25} />
            </span>
            <div>
              <p className="font-bold text-base leading-none text-[var(--text-primary)]" style={{ fontFamily: "var(--font-display)" }}>
                VizIQ
              </p>
              <p className="text-[11px] text-[var(--text-tertiary)] mt-1">
                Analytics Platform
              </p>
            </div>
          </div>

          <nav className="flex flex-col gap-1">
            {NAV_ITEMS.map(({ id, label, icon: Icon }) => {
              const active = activePage === id;
              return (
                <button
                  key={id}
                  onClick={() => setActivePage(id)}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold
                             transition-all duration-200 text-left cursor-pointer"
                  style={
                    active
                      ? { background: "var(--accent)", color: "#fff", boxShadow: "0 4px 16px -2px var(--accent)" }
                      : { color: "var(--text-secondary)" }
                  }
                  onMouseEnter={(e) => {
                    if (!active) e.currentTarget.style.background = "var(--surface-hover)";
                  }}
                  onMouseLeave={(e) => {
                    if (!active) e.currentTarget.style.background = "transparent";
                  }}
                >
                  <Icon size={17} strokeWidth={2.25} />
                  {label}
                </button>
              );
            })}
          </nav>

          <div className="mt-auto pt-4">
            <div
              className="rounded-xl p-3.5 flex items-start gap-2.5"
              style={{ background: "var(--accent-soft)" }}
            >
              <Sparkles size={16} style={{ color: "var(--accent)" }} className="mt-0.5 shrink-0" />
              <p className="text-xs leading-snug text-[var(--text-secondary)]">
                Upload a CSV to unlock auto insights, health scoring & chart recommendations.
              </p>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile bottom tab bar */}
      <nav className="md:hidden fixed bottom-3 left-3 right-3 z-40 glass-strong rounded-2xl flex justify-around p-1.5">
        {NAV_ITEMS.map(({ id, label, icon: Icon }) => {
          const active = activePage === id;
          return (
            <button
              key={id}
              onClick={() => setActivePage(id)}
              className="flex-1 flex flex-col items-center gap-1 py-2 rounded-xl text-[11px] font-semibold transition-colors cursor-pointer"
              style={active ? { background: "var(--accent)", color: "#fff" } : { color: "var(--text-secondary)" }}
            >
              <Icon size={17} strokeWidth={2.25} />
              {label}
            </button>
          );
        })}
      </nav>
    </>
  );
}
