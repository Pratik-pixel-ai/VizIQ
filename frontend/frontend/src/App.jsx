import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { FileText } from "lucide-react";

import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import Charts from "./pages/Charts";
import useTheme from "./hooks/useTheme";
import { API_BASE_URL } from "./api";

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

  const groupedOutliers = (Array.isArray(outliers) ? outliers : []).reduce((acc, outlier) => {
    if (outlier && outlier.column) {
      if (!acc[outlier.column]) acc[outlier.column] = [];
      acc[outlier.column].push(outlier);
    }
    return acc;
  }, {});

  const getRecommendedChart = (column) => {
    axios
      .get(`${API_BASE_URL}/api/recommend-chart?column=${column}`)
      .then((response) => {
        setRecommendedChart(response.data);
        if (response.data === "PIE_CHART") setChartType("PIE");
        else if (response.data === "HISTOGRAM") setChartType("HISTOGRAM");
        else setChartType("BAR");
      })
      .catch((error) => console.error("Recommendation error:", error));
  };

  const fetchDatasetData = async () => {
    try {
      const [colRes, prevRes, chartRes, healthRes, insightRes, sumRes, outRes, corrRes, missRes, metaRes] = await Promise.allSettled([
        axios.get(`${API_BASE_URL}/api/columns`),
        axios.get(`${API_BASE_URL}/api/preview`),
        axios.get(`${API_BASE_URL}/api/charts`),
        axios.get(`${API_BASE_URL}/api/dataset-health`),
        axios.get(`${API_BASE_URL}/api/insights`),
        axios.get(`${API_BASE_URL}/api/summary`),
        axios.get(`${API_BASE_URL}/api/outliers`),
        axios.get(`${API_BASE_URL}/api/correlations`),
        axios.get(`${API_BASE_URL}/api/missing-values`),
        axios.get(`${API_BASE_URL}/api/metadata`),
      ]);

      if (colRes.status === "fulfilled") setColumns(colRes.value.data || {});
      if (prevRes.status === "fulfilled") setRows(Array.isArray(prevRes.value.data) ? prevRes.value.data : []);
      if (chartRes.status === "fulfilled") setCharts(Array.isArray(chartRes.value.data) ? chartRes.value.data : []);
      if (healthRes.status === "fulfilled") setDatasetHealth(healthRes.value.data || null);
      if (insightRes.status === "fulfilled") setInsights(Array.isArray(insightRes.value.data) ? insightRes.value.data : []);
      if (sumRes.status === "fulfilled") setSummary(sumRes.value.data || null);
      if (outRes.status === "fulfilled") setOutliers(Array.isArray(outRes.value.data) ? outRes.value.data : []);
      if (corrRes.status === "fulfilled") setCorrelations(Array.isArray(corrRes.value.data) ? corrRes.value.data : []);
      if (missRes.status === "fulfilled") setMissingValues(Array.isArray(missRes.value.data) ? missRes.value.data : []);
      if (metaRes.status === "fulfilled") setMetadata(metaRes.value.data || null);
    } catch (e) {
      console.error("Error fetching dataset data:", e);
    }
  };

  useEffect(() => {
    fetchDatasetData();
  }, []);

  const uploadFile = (fileToUpload) => {
    const targetFile = fileToUpload || file;
    if (!targetFile) return;

    const formData = new FormData();
    formData.append("file", targetFile);
    setLoading(true);

    axios
      .post(`${API_BASE_URL}/api/upload`, formData)
      .then(async () => {
        await fetchDatasetData();
        setLoading(false);
      })
      .catch((error) => {
        console.error("Upload error:", error);
        setLoading(false);
        alert("Upload Failed. Please try uploading again.");
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

      const response = await fetch(`${API_BASE_URL}/api/report`, {
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
