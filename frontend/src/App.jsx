import { useEffect, useState } from "react";
import axios from "axios";
import BarChartView from "./components/BarChartView";

import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";


import Charts from "./pages/Charts";




const formatChartName = (name) => {

  return name
    .replaceAll("_", " ")
    .toLowerCase()
    .replace(/\b\w/g, c => c.toUpperCase());

};

const downloadReport = async () => {

    const response = await fetch(
        "http://localhost:8080/api/report"
    );

    const blob = await response.blob();

    const url =
        window.URL.createObjectURL(blob);

    const link =
        document.createElement("a");

    link.href = url;

    link.download =
        "VizIQ_Report.pdf";

    document.body.appendChild(link);

    link.click();

    link.remove();
};

function App() {
  const [rows, setRows] = useState([]);
  const [stats, setStats] = useState({});
  const [charts, setCharts] = useState([]);
  const [insights, setInsights] = useState([]);
  const [correlations, setCorrelations] = useState([]);
  const [datasetHealth, setDatasetHealth] =
    useState(null);
  const [file, setFile] = useState(null);
  const [columns, setColumns] = useState({});
  const [selectedColumn, setSelectedColumn] = useState("");
  const [xColumn, setXColumn] = useState("");
  const [yColumn, setYColumn] = useState("");
  const [sizeColumn, setSizeColumn] = useState("");
  const [chartType, setChartType] = useState("BAR");
  const [recommendedChart, setRecommendedChart] = useState("");
  const [summary, setSummary] =
    useState(null);
  const [missingValues, setMissingValues] =
    useState([]);
    const [activePage, setActivePage] =
        useState("dashboard");
  const [outliers, setOutliers] =
      useState([]);
      const groupedOutliers =
          outliers.reduce(
            (acc, outlier) => {

              if (
                !acc[outlier.column]
              ) {

                acc[outlier.column] = [];

              }

              acc[outlier.column]
                .push(outlier);

              return acc;

            },
            {}
          );
  const getRecommendedChart = (column) => {

   axios
     .get(
       `http://localhost:8080/api/recommend-chart?column=${column}`
     )
.then((response) => {

  console.log(
    "Recommended chart:",
    response.data
  );

  setRecommendedChart(
    response.data
  );

  if (response.data === "PIE_CHART") {

    setChartType("PIE");

  } else if (
    response.data === "HISTOGRAM"
  ) {

    setChartType("HISTOGRAM");

  } else {

    setChartType("BAR");

  }

})
.catch((error) => {

  console.error(
    "Recommendation error:",
    error
  );

});

};
  useEffect(() => {
    axios
      .get("http://localhost:8080/api/columns")
      .then((response) => {
        setColumns(response.data);
      });

    axios
      .get("http://localhost:8080/api/preview")
      .then((response) => {
        setRows(response.data);
      });

    axios
      .get("http://localhost:8080/api/stats")
      .then((response) => {
        setStats(response.data);
      });

    axios
      .get("http://localhost:8080/api/charts")
      .then((response) => {
        setCharts(response.data);
      });

  axios
    .get(
      "http://localhost:8080/api/dataset-health"
    )
    .then((response) => {

      setDatasetHealth(
        response.data
      );

    });

    axios
      .get("http://localhost:8080/api/insights")
      .then((response) => {
        setInsights(response.data);
      });
  axios
    .get(
      "http://localhost:8080/api/summary"
    )
    .then((response) => {

      setSummary(
        response.data
      );

    });

    axios
      .get(
        "http://localhost:8080/api/outliers"
      )
      .then((response) => {

        setOutliers(
          response.data
        );

      });

    axios
      .get("http://localhost:8080/api/correlations")
      .then((response) => {

        setCorrelations(
          response.data
        );

      });
  axios
    .get("http://localhost:8080/api/missing-values")
    .then((response) => {

      console.log(
        "Missing Values:",
        response.data
      );

      setMissingValues(
        response.data
      );

    });

  }, []);

  const uploadFile = () => {
    const formData = new FormData();

    formData.append("file", file);

    axios
      .post(
        "http://localhost:8080/api/upload",
        formData
      )
      .then(() => {
        alert("File Uploaded");
        window.location.reload();
      })
      .catch((error) => {
        console.error(error);
        alert("Upload Failed");
      });
  };

  return (
    <div style={{ padding: "20px" }}>

      <h1>VizIQ Dashboard</h1>

      <button
          onClick={() =>
              setActivePage("dashboard")
          }
      >
          Dashboard
      </button>

      <button
          onClick={() =>
              setActivePage("charts")
          }
      >
          Charts
      </button>
      <button
        onClick={downloadReport}
        style={{
          padding: "12px 20px",
          borderRadius: "10px",
          border: "none",
          cursor: "pointer",
          fontWeight: "bold",
          marginBottom: "20px"
        }}
      >
        📄 Generate PDF Report
      </button>
      <div
        style={{
          border: "1px solid white",
          padding: "20px",
          marginBottom: "20px"
        }}
      >
        <h2>Detected Columns</h2>

        <ul>
          {Object.entries(columns).map(
            ([name, type]) => (
              <li key={name}>
                {name} ({type})
              </li>
            )
          )}
        </ul>
      </div>

      {activePage === "dashboard" && (
          <Dashboard
                    rows={rows}
                    summary={summary}
                    datasetHealth={datasetHealth}
                    missingValues={missingValues}
                    outliers={outliers}
                    groupedOutliers={groupedOutliers}
                    correlations={correlations}
                    insights={insights}
                    charts={charts}
                    setChartType={setChartType}
                    formatChartName={formatChartName}
                    setFile={setFile}
                    uploadFile={uploadFile}
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
          />
      )}



  </div>
);
}

export default App;