import { useState, useRef } from "react";
import { UploadCloud, FileSpreadsheet, Loader2 } from "lucide-react";
import Card from "./ui/Card";

export default function UploadSection({ setFile, uploadFile, loading }) {
  const [fileName, setFileName] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef(null);

  const handleFile = (f) => {
    if (!f) return;
    setFile(f);
    setFileName(f.name);
  };

  return (
    <Card title="Upload Dataset" icon={UploadCloud} tone="accent">
      <div
        onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
        onDragLeave={() => setDragActive(false)}
        onDrop={(e) => { e.preventDefault(); setDragActive(false); handleFile(e.dataTransfer.files[0]); }}
        onClick={() => !loading && inputRef.current?.click()}
        className="rounded-xl border-2 border-dashed flex flex-col sm:flex-row items-center gap-4
                   px-5 py-7 cursor-pointer transition-colors duration-200"
        style={{
          borderColor: dragActive ? "var(--accent)" : "var(--surface-border)",
          background: dragActive ? "var(--accent-soft)" : loading ? "var(--surface-strong)" : "transparent",
          cursor: loading ? "default" : "pointer",
        }}
      >
        <span
          className="inline-flex items-center justify-center w-14 h-14 rounded-2xl shrink-0"
          style={{ background: "var(--accent-soft)", color: "var(--accent)" }}
        >
          {loading
            ? <Loader2 size={26} className="animate-spin" />
            : fileName
            ? <FileSpreadsheet size={26} />
            : <UploadCloud size={26} />}
        </span>

        <div className="flex-1 min-w-0 text-center sm:text-left">
          {loading ? (
            <>
              <p className="font-semibold text-sm text-[var(--text-primary)]">Analyzing dataset…</p>
              <p className="text-xs text-[var(--text-tertiary)] mt-0.5">Processing columns, health score, insights and correlations</p>
            </>
          ) : fileName ? (
            <>
              <p className="font-semibold text-sm text-[var(--text-primary)] truncate">{fileName}</p>
              <p className="text-xs text-[var(--text-tertiary)] mt-0.5">Ready to upload</p>
            </>
          ) : (
            <>
              <p className="font-semibold text-sm text-[var(--text-primary)]">
                📊 Drop your CSV here, or click to browse
              </p>
              <p className="text-xs text-[var(--text-tertiary)] mt-1 leading-relaxed">
                Upload a CSV to generate insights, quality metrics, charts and reports
              </p>
            </>
          )}
        </div>

        <input ref={inputRef} type="file" accept=".csv" className="hidden"
          onChange={(e) => handleFile(e.target.files[0])} />

        <button
          onClick={(e) => { e.stopPropagation(); uploadFile(); }}
          disabled={!fileName || loading}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold
                     text-white shrink-0 transition-all duration-200 cursor-pointer
                     disabled:opacity-50 disabled:cursor-not-allowed hover:brightness-110"
          style={{ background: "var(--accent)", boxShadow: fileName && !loading ? "0 4px 18px -3px var(--accent)" : "none" }}
        >
          {loading ? <Loader2 size={16} className="animate-spin" /> : <UploadCloud size={16} strokeWidth={2.25} />}
          {loading ? "Analyzing…" : "Upload CSV"}
        </button>
      </div>
    </Card>
  );
}
