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
  const [chartType, setChartType] = useState("BAR");

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
          onChange={(e) =>
            setChartType(e.target.value)
          }
        >
          <option value="BAR">
            Bar Chart
          </option>

          <option value="PIE">
            Pie Chart
          </option>
        </select>

        <br />
        <br />

        <h3>Select Column</h3>

        <select
          value={selectedColumn}
          onChange={(e) =>
            setSelectedColumn(e.target.value)
          }
        >
          <option value="">
            Select Column
          </option>

          {Object.entries(columns)
            .filter(
              ([_, type]) => type === "TEXT"
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
            <li key={index}>{chart}</li>
          ))}
        </ul>
      </div>

      <h2>Analytics Charts</h2>

      <BarChartView
        selectedColumn={selectedColumn}
        chartType={chartType}
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