import { useEffect, useState } from "react";
import axios from "axios";

import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import Charts from "./pages/Charts";
import useTheme from "./hooks/useTheme";

const formatChartName = (name) =>
  name
    .replaceAll("_", " ")
    .toLowerCase()
    .replace(/\b\w/g, (c) => c.toUpperCase());




function App() {
  const { theme, toggleTheme } = useTheme();


  const [rows, setRows] = useState([]);
  const [isGeneratingPdf, setIsGeneratingPdf] =
      useState(false);
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
    axios.get("http://localhost:8080/api/columns").then((response) => setColumns(response.data));
    axios.get("http://localhost:8080/api/preview").then((response) => setRows(response.data));
    axios.get("http://localhost:8080/api/charts").then((response) => setCharts(response.data));
    axios.get("http://localhost:8080/api/dataset-health").then((response) => setDatasetHealth(response.data));
    axios.get("http://localhost:8080/api/insights").then((response) => setInsights(response.data));
    axios.get("http://localhost:8080/api/summary").then((response) => setSummary(response.data));
    axios.get("http://localhost:8080/api/outliers").then((response) => setOutliers(response.data));
    axios.get("http://localhost:8080/api/correlations").then((response) => setCorrelations(response.data));
    axios.get("http://localhost:8080/api/missing-values").then((response) => setMissingValues(response.data));
    axios.get("http://localhost:8080/api/metadata").then((response) => setMetadata(response.data)).catch(() => {});
  }, []);

const downloadReport = async () => {
    console.log("PDF STARTED");
    setIsGeneratingPdf(true);
  let chartBlob = null;
  try {
    const chartEl = document.querySelector("[data-chart-capture]");
    if (chartEl) {
      const html2canvas = (await import("html2canvas-pro")).default;
      const bg = getComputedStyle(document.documentElement).getPropertyValue("--bg-base").trim() || "#fff";
      const canvas = await html2canvas(chartEl, { backgroundColor: bg, scale: 1.5, useCORS: true, logging: false });
      chartBlob = await new Promise((resolve) => canvas.toBlob(resolve, "image/jpeg", 0.85));
    }
  } catch (e) {
    console.warn("Chart capture skipped:", e);
  }

  const formData = new FormData();
  if (chartBlob) {
    formData.append("chartImage", chartBlob, "chart.jpg");
  }

  try {
    const response = await fetch("http://localhost:8080/api/report", {
      method: "POST",
      body: formData,
    });
    if (!response.ok) {
      throw new Error(`Report request failed (${response.status})`);
    }

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
  }
  finally {

      setIsGeneratingPdf(false);

  }
};

  const uploadFile = () => {
    const formData = new FormData();
    formData.append("file", file);
    setLoading(true);

    axios
      .post("http://localhost:8080/api/upload", formData)
      .then(() => {
        window.location.reload();
      })
      .catch((error) => {
        console.error(error);
        setLoading(false);
        alert("Upload Failed");
      });
  };

  return (
      <>
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
    {
          true && (
            <div className="loading-overlay">
              <div className="spinner"></div>
            </div>
          )
        }
      </>
  );
}

export default App;
