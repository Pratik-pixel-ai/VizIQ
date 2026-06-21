import { useState, useRef } from "react";
import { UploadCloud, FileSpreadsheet } from "lucide-react";
import Card from "./ui/Card";
import Button from "./ui/Button";

export default function UploadSection({ setFile, uploadFile }) {
  const [fileName, setFileName] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef(null);

  const handleFile = (f) => {
    if (!f) return;
    setFile(f);
    setFileName(f.name);
  };

  return (
    <Card>
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragActive(true);
        }}
        onDragLeave={() => setDragActive(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragActive(false);
          handleFile(e.dataTransfer.files[0]);
        }}
        onClick={() => inputRef.current?.click()}
        className="rounded-xl border-2 border-dashed flex flex-col sm:flex-row items-center gap-4
                   px-5 py-6 cursor-pointer transition-colors duration-200"
        style={{
          borderColor: dragActive ? "var(--accent)" : "var(--surface-border)",
          background: dragActive ? "var(--accent-soft)" : "transparent",
        }}
      >
        <span
          className="inline-flex items-center justify-center w-12 h-12 rounded-xl shrink-0"
          style={{ background: "var(--accent-soft)", color: "var(--accent)" }}
        >
          {fileName ? <FileSpreadsheet size={22} /> : <UploadCloud size={22} />}
        </span>

        <div className="flex-1 min-w-0 text-center sm:text-left">
          <p className="font-semibold text-sm text-[var(--text-primary)] truncate">
            {fileName || "Drop your CSV here, or click to browse"}
          </p>
          <p className="text-xs text-[var(--text-tertiary)] mt-0.5">
            {fileName ? "Ready to upload" : "Supports .csv files"}
          </p>
        </div>

        <input
          ref={inputRef}
          type="file"
          accept=".csv"
          className="hidden"
          onChange={(e) => handleFile(e.target.files[0])}
        />

        <Button
          variant="primary"
          icon={UploadCloud}
          onClick={(e) => {
            e.stopPropagation();
            uploadFile();
          }}
          disabled={!fileName}
        >
          Upload CSV
        </Button>
      </div>
    </Card>
  );
}
