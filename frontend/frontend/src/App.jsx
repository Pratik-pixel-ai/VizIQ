import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { FileText } from "lucide-react";

import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import Charts from "./pages/Charts";
import useTheme from "./hooks/useTheme";

const formatChartName = (name) =>
  name
    .replaceAll("_", " ")
    .toLowerCase()
    .replace(/\b\w/g, (c) => c.toUpperCase());

// ── PDF Generation Loading Overlay ──────────────────────────────────
function PdfLoadingOverlay() {
  return (
    <div
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center gap-5"
      style={{ background: "rgba(5, 6, 12, 0.72)", backdropFilter: "blur(6px)" }}
    >
      {/* Spinner ring */}
      <div className="relative w-20 h-20">
        <div
          className="absolute inset-0 rounded-full border-4 border-transparent animate-spin"
          style={{ borderTopColor: "var(--accent)", borderRightColor: "var(--accent-soft)" }}
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <FileText size={26} style={{ color: "var(--accent)" }} />
        </div>
      </div>

      <div className="text-center">
        <p
          className="text-lg font-bold"
          style={{ fontFamily: "var(--font-display)", color: "#eef0ff" }}
        >
          Generating Report
        </p>
        <p className="text-sm mt-1" style={{ color: "rgba(200, 200, 220, 0.75)" }}>
          Capturing chart · Building PDF · Please wait…
        </p>
      </div>

      {/* Progress dots */}
      <div className="flex gap-2">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="w-2 h-2 rounded-full animate-bounce"
            style={{
              background: "var(--accent)",
              animationDelay: `${i * 0.18}s`,
              animationDuration: "0.8s",
            }}
          />
        ))}
      </div>
    </div>
  );
}

function App() {
  const { theme, toggleTheme } = useTheme();

  const [rows, setRows] = useState([]);
  const [charts, setCharts] = useState([]);
  const [metadata, setMetadata] = useState(null);
  const [insights, setInsights] = useState([]);
  const [correlations, setCorrelations] = useState([]);
  const [datasetHealth, setDatasetHealth] = useState(null);
  const [file, setFile] = useState(null);
  const [columns, setColumns] = useState({});
  const [selectedColumn, setSelectedColumn] = useState("");
  const [xColumn, setXColumn] = useState("");
  const [yColumn, setYColumn] = useState("");
  const [sizeColumn, setSizeColumn] = useState("");
  const [chartType, setChartType] = useState("BAR");
  const [recommendedChart, setRecommendedChart] = useState("");
  const [summary, setSummary] = useState(null);
  const [missingValues, setMissingValues] = useState([]);
  const [activePage, setActivePage] = useState("dashboard");
  const [outliers, setOutliers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [reportLoading, setReportLoading] = useState(false);

  const groupedOutliers = outliers.reduce((acc, outlier) => {
    if (!acc[outlier.column]) acc[outlier.column] = [];
    acc[outlier.column].push(outlier);
    return acc;
  }, {});

  const getRecommendedChart = (column) => {
    axios
      .get(`http://localhost:8080/api/recommend-chart?column=${column}`)
      .then((response) => {
        setRecommendedChart(response.data);
        if (response.data === "PIE_CHART") setChartType("PIE");
        else if (response.data === "HISTOGRAM") setChartType("HISTOGRAM");
        else setChartType("BAR");
      })
      .catch((error) => console.error("Recommendation error:", error));
  };

  useEffect(() => {
    axios.get("http://localhost:8080/api/columns").then((r) => setColumns(r.data));
    axios.get("http://localhost:8080/api/preview").then((r) => setRows(r.data));
    axios.get("http://localhost:8080/api/charts").then((r) => setCharts(r.data));
    axios.get("http://localhost:8080/api/dataset-health").then((r) => setDatasetHealth(r.data));
    axios.get("http://localhost:8080/api/insights").then((r) => setInsights(r.data));
    axios.get("http://localhost:8080/api/summary").then((r) => setSummary(r.data));
    axios.get("http://localhost:8080/api/outliers").then((r) => setOutliers(r.data));
    axios.get("http://localhost:8080/api/correlations").then((r) => setCorrelations(r.data));
    axios.get("http://localhost:8080/api/missing-values").then((r) => setMissingValues(r.data));
    axios.get("http://localhost:8080/api/metadata").then((r) => setMetadata(r.data)).catch(() => {});
  }, []);

  const uploadFile = () => {
    const formData = new FormData();
    formData.append("file", file);
    setLoading(true);

    axios
      .post("http://localhost:8080/api/upload", formData)
      .then(() => window.location.reload())
      .catch((error) => {
        console.error(error);
        setLoading(false);
        alert("Upload Failed");
      });
  };

  // Inside component so it can set reportLoading state
  const downloadReport = useCallback(async () => {
    setReportLoading(true);

    let chartBlob = null;
    try {
      const chartEl = document.querySelector("[data-chart-capture]");
      if (chartEl) {
        const html2canvas = (await import("html2canvas-pro")).default;
        const bg =
          getComputedStyle(document.documentElement).getPropertyValue("--bg-base").trim() || "#fff";
        const canvas = await html2canvas(chartEl, {
          backgroundColor: bg,
          scale: 1.5,
          useCORS: true,
          logging: false,
        });
        chartBlob = await new Promise((resolve) => canvas.toBlob(resolve, "image/jpeg", 0.85));
      }
    } catch (e) {
      console.warn("Chart capture skipped:", e);
    }

    try {
      const formData = new FormData();
      if (chartBlob) formData.append("chartImage", chartBlob, "chart.jpg");

      const response = await fetch("http://localhost:8080/api/report", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error(`Report request failed (${response.status})`);

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "VizIQ_Report.pdf";
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (e) {
      console.error("Report generation failed:", e);
      alert("Failed to generate PDF report. Please try again.");
    } finally {
      setReportLoading(false);
    }
  }, []);

  return (
    <>
      {reportLoading && <PdfLoadingOverlay />}

      <Layout
        activePage={activePage}
        setActivePage={setActivePage}
        theme={theme}
        toggleTheme={toggleTheme}
        downloadReport={downloadReport}
      >
        {activePage === "dashboard" && (
          <Dashboard
            rows={rows}
            columns={columns}
            summary={summary}
            datasetHealth={datasetHealth}
            missingValues={missingValues}
            outliers={outliers}
            groupedOutliers={groupedOutliers}
            correlations={correlations}
            insights={insights}
            charts={charts}
            setChartType={setChartType}
            setActivePage={setActivePage}
            formatChartName={formatChartName}
            setFile={setFile}
            uploadFile={uploadFile}
            loading={loading}
            metadata={metadata}
            theme={theme}
          />
        )}

        {activePage === "charts" && (
          <Charts
            chartType={chartType}
            setChartType={setChartType}
            xColumn={xColumn}
            setXColumn={setXColumn}
            yColumn={yColumn}
            setYColumn={setYColumn}
            sizeColumn={sizeColumn}
            setSizeColumn={setSizeColumn}
            selectedColumn={selectedColumn}
            setSelectedColumn={setSelectedColumn}
            columns={columns}
            getRecommendedChart={getRecommendedChart}
            recommendedChart={recommendedChart}
            rows={rows}
            charts={charts}
            formatChartName={formatChartName}
          />
        )}
      </Layout>
    </>
  );
}

export default App;
