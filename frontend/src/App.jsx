import { useEffect, useState } from "react";
import axios from "axios";
import BarChartView from "./components/BarChartView";
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

      <div style={{ marginBottom: "20px" }}>
        <input
          type="file"
          onChange={(e) => {
            setFile(e.target.files[0]);
          }}
        />

        <button onClick={uploadFile}>
          Upload CSV
        </button>
      </div>

      <div
        style={{
          display: "flex",
          gap: "20px",
          marginBottom: "30px"
        }}
      >
        <div
          style={{
            border: "1px solid white",
            padding: "20px"
          }}
        >
          <h3>Total Rows</h3>
          <h2>{rows.length - 1}</h2>
        </div>

        <div
          style={{
            border: "1px solid white",
            padding: "20px"
          }}
        >
          <h3>Total Columns</h3>
          <h2>
            {rows.length > 0 ? rows[0].length : 0}
          </h2>
        </div>
      </div>

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

      <div
        style={{
          border: "1px solid white",
          padding: "20px",
          marginBottom: "20px"
        }}
      >
        <h2>Create Chart</h2>

        <h3>Chart Type</h3>

        <select
          value={chartType}
          onChange={(e) => {
            setChartType(e.target.value);
          }}
        >
          <option value="BAR">
            Bar Chart
          </option>

          <option value="PIE">
            Pie Chart
          </option>

          <option value="HISTOGRAM">
            Histogram
          </option>

          <option value="SCATTER">
            Scatter Plot
          </option>

          <option value="LINE">
            Line Chart
          </option>

          <option value="AREA">
            Area Chart
          </option>

          <option value="BUBBLE">
            Bubble Chart
          </option>

          <option value="BOXPLOT">
             Box Plot
          </option>

          <option value="HEATMAP">
            Heat Map
          </option>
        </select>



        <br />
        <br />

       {chartType === "SCATTER" ||
        chartType === "LINE" ||
        chartType === "AREA" ||
        chartType === "BUBBLE"||
        chartType === "HEATMAP" ? (

          <>

            <h3>X Axis</h3>

            <select
              value={xColumn}
              onChange={(e) => {
                setXColumn(e.target.value);
              }}
            >
              <option value="">
                Select X Column
              </option>

              {Object.entries(columns)
                .filter(([_, type]) => type === "NUMBER")
                .map(([name]) => (
                  <option
                    key={name}
                    value={name}
                  >
                    {name}
                  </option>
                ))}
            </select>

            <br /><br />

            <h3>Y Axis</h3>

            <select
              value={yColumn}
              onChange={(e) => {
                setYColumn(e.target.value);
              }}
            >
              <option value="">
                Select Y Column
              </option>

              {Object.entries(columns)
                .filter(([_, type]) => type === "NUMBER")
                .map(([name]) => (
                  <option
                    key={name}
                    value={name}
                  >
                    {name}
                  </option>
                ))}
            </select>
            {chartType === "BUBBLE" && (

              <>

                <br /><br />

                <h3>Bubble Size</h3>

                <select
                  value={sizeColumn}
                  onChange={(e) => {
                    setSizeColumn(
                      e.target.value
                    );
                  }}
                >

                  <option value="">
                    Select Size Column
                  </option>

                  {Object.entries(columns)
                    .filter(
                      ([_, type]) =>
                        type === "NUMBER"
                    )
                    .map(([name]) => (

                      <option
                        key={name}
                        value={name}
                      >
                        {name}
                      </option>

                    ))}

                </select>

              </>

            )}

          </>

        ) : (

          <>

            <h3>Select Column</h3>

            <select
              value={selectedColumn}
              onChange={(e) => {

                const column = e.target.value;

                setSelectedColumn(column);

                getRecommendedChart(column);

              }}
            >
              <option value="">
                Select Column
              </option>

              {Object.entries(columns).map(([name]) => (
                <option
                  key={name}
                  value={name}
                >
                  {name}
                </option>
              ))}
            </select>

          </>

        )}
      </div>

      <div
        style={{
          border: "1px solid white",
          padding: "20px",
          marginBottom: "20px"
        }}
      >


<div
  style={{
    marginBottom: "30px"
  }}
>

    {summary && (

      <div
        style={{
          border: "1px solid #333",
          borderRadius: "12px",
          padding: "20px",
          marginBottom: "30px",
          background: "#07162d"
        }}
      >

        <h2>
          📊 Dataset Overview
        </h2>

        <p>
          Rows: {summary.rows}
        </p>

        <p>
          Columns: {summary.columns}
        </p>

        <p>
          Numeric Columns: {summary.numericColumns}
        </p>

        <p>
          Categorical Columns: {summary.categoricalColumns}
        </p>

        <p>
          Missing Values: {summary.missingValues}
        </p>

        <p>
          Outliers: {summary.outliers}
        </p>

      </div>

    )}

    {datasetHealth && (

      <div
        style={{
          border: "1px solid #333",
          borderRadius: "12px",
          padding: "20px",
          marginBottom: "30px",
          backgroundColor: "#111827"
        }}
      >

        <h2>
          Dataset Health
        </h2>

        <h1
          style={{
            margin: "10px 0"
          }}
        >
          {datasetHealth.score}/100
        </h1>

        <h3>

          {datasetHealth.status ===
           "Excellent" && "🟢 Excellent"}

          {datasetHealth.status ===
           "Good" && "🟡 Good"}

          {datasetHealth.status ===
           "Fair" && "🟠 Fair"}

          {datasetHealth.status ===
           "Poor" && "🔴 Poor"}

        </h3>

        <div
          style={{
            marginTop: "20px",
            textAlign: "left",
            maxWidth: "300px",
            margin: "20px auto 0"
          }}
        >

          <p>
            📊 Dataset Size:
            {" "}
            {datasetHealth.datasetSizeScore}/25
          </p>

          <p>
            🔢 Numeric Quality:
            {" "}
            {datasetHealth.numericQualityScore}/20
          </p>

          <p>
            🔗 Relationships:
            {" "}
            {datasetHealth.relationshipScore}/15
          </p>

          <p>
            🌈 Diversity:
            {" "}
            {datasetHealth.diversityScore}/15
          </p>

          <p>
            📋 Completeness:
            {" "}
            {datasetHealth.completenessScore}/25
          </p>

        </div>

      </div>

    )}

<div
  style={{
    marginBottom: "30px"
  }}
>

  <h2>
    Dataset Quality
  </h2>

  {missingValues.length === 0 ? (

    <div
      style={{
        padding: "15px",
        border: "1px solid #333",
        borderRadius: "10px"
      }}
    >
      ✅ No missing values detected
    </div>

  ) : (

    missingValues.map(
      (item, index) => (

        <div
          key={index}
          style={{
            padding: "12px",
            border: "1px solid #333",
            borderRadius: "10px",
            marginBottom: "10px"
          }}
        >

          ⚠ {item.column}

          {" : "}

          <strong>
            {item.missingCount}
          </strong>

          {" missing values"}

        </div>

      )
    )

  )}

</div>



<div
  style={{
    marginBottom: "30px"
  }}
>

  <h2>
    🚨 Potential Outliers
  </h2>

  {outliers.length === 0 ? (

    <div
      style={{
        padding: "15px",
        border: "1px solid #333",
        borderRadius: "10px"
      }}
    >
      ✅ No significant outliers detected
    </div>

  ) : (

    Object.entries(
      groupedOutliers
    ).map(

      ([column, items]) => (

        <div
          key={column}
          style={{
            border: "1px solid #333",
            borderRadius: "12px",
            padding: "15px",
            marginBottom: "12px"
          }}
        >

          <h3>
            {column}
          </h3>

          <p>
            Severity:
            {" "}
            <strong
              style={{
                color:
                  items[0].severity === "Extreme"
                    ? "#ff4d4d"
                    : "#ffa500"
              }}
            >
              {items[0].severity}
            </strong>
          </p>

          <p>
            Expected Range:
            {" "}
            {items[0].lowerBound.toFixed(2)}
            {" → "}
            {items[0].upperBound.toFixed(2)}
          </p>

          <p>
            Outlier Values:
          </p>

          <ul
            style={{
              listStyle: "none",
              padding: 0
            }}
          >

            <p>
              {items.map(item => item.value).join(" • ")}
            </p>



          </ul>

        </div>

      )

    )

  )}

</div>




  <h2>
    Strong Relationships
  </h2>

  {correlations.length === 0 ? (

    <div
      style={{
        padding: "15px",
        border: "1px solid #333",
        borderRadius: "10px"
      }}
    >
      No significant numeric relationships found.
    </div>

  ) : (

    correlations.map((corr, index) => (

      <div
        key={index}
        style={{
          padding: "15px",
          border: "1px solid #333",
          borderRadius: "10px",
          marginBottom: "10px"
        }}
      >
        <h3>
          🔗 {corr.column1} ↔ {corr.column2}
        </h3>

        <p>
          Correlation Strength:
          {" "}
          <strong>
            {corr.correlation.toFixed(2)}
          </strong>
        </p>

      </div>

    ))

  )}

</div>

    <div
      style={{
        marginBottom: "30px"
      }}
    >
      <h2>Smart Insights</h2>

      {insights.map((insight, index) => (

        <div
          key={index}
          style={{
            padding: "15px",
            border: "1px solid #333",
            borderRadius: "10px",
            marginBottom: "10px",
            backgroundColor: "#111827"
          }}
        >

          <span
            style={{
              fontSize: "18px"
            }}
          >
            💡
          </span>

          {" "}

          {insight.message}

        </div>

      ))}

    </div>

        <h2>Recommended Charts</h2>

        <ul
          style={{
            listStyle: "none",
            padding: 0
          }}
        >
          {charts.map((chart, index) => (
           <li
             key={index}
             onClick={() => {

               if (chart.chartType === "BAR_CHART")
                 setChartType("BAR");

               else if (chart.chartType === "PIE_CHART")
                 setChartType("PIE");

               else if (chart.chartType === "HISTOGRAM")
                 setChartType("HISTOGRAM");

               else if (chart.chartType === "SCATTER_PLOT")
                 setChartType("SCATTER");

               else if (chart.chartType === "LINE_CHART")
                 setChartType("LINE");

               else if (chart.chartType === "AREA_CHART")
                 setChartType("AREA");

               else if (chart.chartType === "BUBBLE_CHART")
                 setChartType("BUBBLE");

               else if (chart.chartType === "BOX_PLOT")
                 setChartType("BOXPLOT");

               else if (chart.chartType === "HEAT_MAP")
                 setChartType("HEATMAP");

             }}
             style={{
               marginBottom: "20px",
               cursor: "pointer",
               padding: "10px",
               border: "1px solid #333",
               borderRadius: "8px"
             }}
           >
              <strong>
                #{index + 1} {formatChartName(chart.chartType)}
              </strong>
              {" "}({chart.score})
              <br />
              {chart.reason}
            </li>
          ))}
        </ul>
      </div>

      <h2>Analytics Charts</h2>

      <BarChartView
        selectedColumn={selectedColumn}
        chartType={chartType}
        recommendedChart={recommendedChart}
        xColumn={xColumn}
        yColumn={yColumn}
        sizeColumn={sizeColumn}
      />

      <h2>Dataset Preview</h2>

      <table border="1" cellPadding="8">
        <thead>
          <tr>
            {rows.length > 0 &&
              rows[0].map(
                (header, index) => (
                  <th key={index}>
                    {header}
                  </th>
                )
              )}
          </tr>
        </thead>

        <tbody>
          {rows.slice(1).map(
            (row, rowIndex) => (
              <tr key={rowIndex}>
                {row.map(
                  (cell, cellIndex) => (
                    <td key={cellIndex}>
                      {cell}
                    </td>
                  )
                )}
              </tr>
            )
          )}
        </tbody>
      </table>

    </div>
  );
}

export default App;