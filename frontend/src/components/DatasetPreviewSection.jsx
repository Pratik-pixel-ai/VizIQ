import { useState, useMemo } from "react";
import { Table2, Search, ArrowUpDown, ArrowUp, ArrowDown, X } from "lucide-react";
import Card from "./ui/Card";

export default function DatasetPreviewSection({ rows }) {
  const [search, setSearch] = useState("");
  const [sortCol, setSortCol] = useState(null);
  const [sortDir, setSortDir] = useState("asc");

  const headers = rows.length > 0 ? rows[0] : [];
  const data = rows.length > 0 ? rows.slice(1) : [];

  // Filter
  const filtered = useMemo(() => {
    if (!search.trim()) return data;
    const q = search.toLowerCase();
    return data.filter((row) => row.some((cell) => String(cell).toLowerCase().includes(q)));
  }, [data, search]);

  // Sort
  const sorted = useMemo(() => {
    if (sortCol === null) return filtered;
    return [...filtered].sort((a, b) => {
      const va = a[sortCol] ?? "";
      const vb = b[sortCol] ?? "";
      const na = parseFloat(va), nb = parseFloat(vb);
      const cmp = !isNaN(na) && !isNaN(nb) ? na - nb : String(va).localeCompare(String(vb));
      return sortDir === "asc" ? cmp : -cmp;
    });
  }, [filtered, sortCol, sortDir]);

  if (rows.length === 0) return null;

  const handleSort = (idx) => {
    if (sortCol === idx) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortCol(idx);
      setSortDir("asc");
    }
  };

  const SortIcon = ({ idx }) => {
    if (sortCol !== idx) return <ArrowUpDown size={12} style={{ color: "var(--text-tertiary)" }} />;
    return sortDir === "asc"
      ? <ArrowUp size={12} style={{ color: "var(--accent)" }} />
      : <ArrowDown size={12} style={{ color: "var(--accent)" }} />;
  };

  const searchAction = (
    <div className="relative flex items-center">
      <Search size={14} className="absolute left-3 pointer-events-none" style={{ color: "var(--text-tertiary)" }} />
      <input
        type="text"
        placeholder="Search rows…"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="pl-8 pr-8 py-2 text-sm rounded-xl border outline-none w-44 sm:w-56 transition-colors"
        style={{
          background: "var(--surface-strong)",
          border: "1px solid var(--surface-border)",
          color: "var(--text-primary)",
        }}
        onFocus={(e) => (e.currentTarget.style.borderColor = "var(--accent)")}
        onBlur={(e) => (e.currentTarget.style.borderColor = "var(--surface-border)")}
      />
      {search && (
        <button
          onClick={() => setSearch("")}
          className="absolute right-2.5 cursor-pointer"
          style={{ color: "var(--text-tertiary)" }}
        >
          <X size={13} />
        </button>
      )}
    </div>
  );

  return (
    <Card title="Dataset Preview" icon={Table2} tone="neutral" action={searchAction}>
      <p className="text-xs text-[var(--text-tertiary)] mb-3">
        Showing {sorted.length} of {data.length} rows
        {search && ` matching "${search}"`}
        {sortCol !== null && ` · sorted by ${headers[sortCol]} ${sortDir === "asc" ? "↑" : "↓"}`}
      </p>

      <div className="overflow-auto rounded-xl border" style={{ borderColor: "var(--surface-border)", maxHeight: 420 }}>
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr>
              {headers.map((header, idx) => (
                <th
                  key={idx}
                  onClick={() => handleSort(idx)}
                  className="sticky top-0 text-left px-4 py-2.5 whitespace-nowrap cursor-pointer group select-none"
                  style={{
                    background: "var(--surface-strong)",
                    color: sortCol === idx ? "var(--accent)" : "var(--text-tertiary)",
                    backdropFilter: "blur(8px)",
                    fontSize: 11,
                    fontWeight: 600,
                    textTransform: "uppercase",
                    letterSpacing: "0.06em",
                  }}
                >
                  <div className="flex items-center gap-1.5">
                    {header}
                    <SortIcon idx={idx} />
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sorted.slice(0, 200).map((row, rowIdx) => (
              <tr
                key={rowIdx}
                style={{ background: rowIdx % 2 === 0 ? "transparent" : "var(--surface)" }}
                className="hover:bg-[var(--surface-hover)] transition-colors"
              >
                {row.map((cell, cellIdx) => (
                  <td
                    key={cellIdx}
                    className="mono-num px-4 py-2 whitespace-nowrap"
                    style={{ color: "var(--text-secondary)", borderTop: "1px solid var(--surface-border)" }}
                  >
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
