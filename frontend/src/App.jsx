import { useEffect, useState } from "react";
import axios from "axios";
import BarChartView from "./components/BarChartView";

function App() {
  const [rows, setRows] = useState([]);
  const [stats, setStats] = useState({});
  const [charts, setCharts] = useState([]);
  const [file, setFile] = useState(null);
  const [columns, setColumns] = useState({});
  const [selectedColumn, setSelectedColumn] = useState("");
  const [xColumn, setXColumn] = useState("");
  const [yColumn, setYColumn] = useState("");
  const [sizeColumn, setSizeColumn] = useState("");
  const [chartType, setChartType] = useState("BAR");
  const [recommendedChart, setRecommendedChart] = useState("");
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
        <h2>Recommended Charts</h2>

        <ul>
          {charts.map((chart, index) => (
            <li key={index}>
              {chart}
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