import { useEffect, useRef, useState } from "react";
import html2canvas from "html2canvas-pro";
import { LineChart as ChartIcon, Download, Maximize2, X } from "lucide-react";
import Card from "./ui/Card";
import BarChartView from "./BarChartView";
import { chartDescriptions } from "../chartTheme";

export default function BarChartSection({ selectedColumn, chartType, recommendedChart, xColumn, yColumn, sizeColumn }) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [exporting, setExporting] = useState(false);
  const chartRef = useRef(null);
  const fullscreenChartRef = useRef(null);

  useEffect(() => {
    if (!isFullscreen) return;
    const onKeyDown = (e) => {
      if (e.key === "Escape") setIsFullscreen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isFullscreen]);

  const description = chartDescriptions[chartType];

  const exportPng = async (variant) => {
    const ref = variant === "fullscreen" ? fullscreenChartRef : chartRef;
    if (!ref.current) return;
    setExporting(true);
    try {
      const bg = getComputedStyle(document.documentElement).getPropertyValue("--bg-base").trim() || "#ffffff";
      const canvas = await html2canvas(ref.current, { backgroundColor: bg, scale: 2 });
      const link = document.createElement("a");
      link.download = `viziq-${chartType.toLowerCase()}-chart.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    } catch (err) {
      console.error("Chart export failed:", err);
    } finally {
      setExporting(false);
    }
  };

  const renderActions = (variant) => {
    return (
      <div className="flex items-center gap-2">
        <button
          onClick={() => exportPng(variant)}
          disabled={exporting}
          title="Export chart as PNG"
          className="inline-flex items-center justify-center w-9 h-9 rounded-lg cursor-pointer transition-colors
                     bg-[var(--surface-strong)] border border-[var(--surface-border)] hover:bg-[var(--surface-hover)]
                     disabled:opacity-50 disabled:cursor-wait"
        >
          <Download size={15} strokeWidth={2.25} style={{ color: "var(--text-secondary)" }} />
        </button>
        {variant !== "fullscreen" && (
          <button
            onClick={() => setIsFullscreen(true)}
            title="View fullscreen"
            className="inline-flex items-center justify-center w-9 h-9 rounded-lg cursor-pointer transition-colors
                       bg-[var(--surface-strong)] border border-[var(--surface-border)] hover:bg-[var(--surface-hover)]"
          >
            <Maximize2 size={15} strokeWidth={2.25} style={{ color: "var(--text-secondary)" }} />
          </button>
        )}
      </div>
    );
  };

  const chartNode = (variant, height) => {
    const ref = variant === "fullscreen" ? fullscreenChartRef : chartRef;
    return (
      <div ref={ref} className="rounded-xl" style={{ background: "var(--bg-base)" }}>
        <BarChartView
          selectedColumn={selectedColumn}
          chartType={chartType}
          recommendedChart={recommendedChart}
          xColumn={xColumn}
          yColumn={yColumn}
          sizeColumn={sizeColumn}
          height={height}
        />
      </div>
    );
  };

  return (
    <>
      <Card title="Analytics Chart" description={description} icon={ChartIcon} tone="good" action={renderActions("inline")}>
        {chartNode("inline", 380)}
      </Card>

      {isFullscreen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8">
          <div
            className="absolute inset-0"
            style={{ background: "rgba(0,0,0,0.55)", backdropFilter: "blur(4px)" }}
            onClick={() => setIsFullscreen(false)}
          />
          <div className="glass-strong rounded-2xl relative w-full max-w-5xl max-h-[90vh] overflow-auto p-6">
            <div className="flex items-start justify-between mb-4 gap-4">
              <div>
                <h2 className="text-lg font-bold text-[var(--text-primary)]">Analytics Chart</h2>
                {description && <p className="text-sm text-[var(--text-secondary)] mt-1">{description}</p>}
              </div>
              <div className="flex items-center gap-2 shrink-0">
                {renderActions("fullscreen")}
                <button
                  onClick={() => setIsFullscreen(false)}
                  title="Close"
                  className="inline-flex items-center justify-center w-9 h-9 rounded-lg cursor-pointer transition-colors
                             bg-[var(--surface-strong)] border border-[var(--surface-border)] hover:bg-[var(--surface-hover)]"
                >
                  <X size={16} strokeWidth={2.25} style={{ color: "var(--text-secondary)" }} />
                </button>
              </div>
            </div>
            {chartNode("fullscreen", 560)}
          </div>
        </div>
      )}
    </>
  );
}
