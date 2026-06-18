import { useEffect, useState } from "react";
import axios from "axios";

function BoxPlotView({
  selectedColumn
}) {

  const [stats, setStats] =
    useState(null);

  useEffect(() => {

    if (!selectedColumn) return;

    axios
      .get(
        `http://localhost:8080/api/boxplot-data?column=${selectedColumn}`
      )
      .then((response) => {

        setStats(response.data);

      });

  }, [selectedColumn]);

  if (!stats) {

    return (
      <h3>
        Select a numeric column
      </h3>
    );

  }

const range = stats.max - stats.min;

const minPos = 5;
const maxPos = 95;

const q1Pos =
  5 +
  ((stats.q1 - stats.min) / range) * 90;

const medianPos =
  5 +
  ((stats.median - stats.min) / range) * 90;

const q3Pos =
  5 +
  ((stats.q3 - stats.min) / range) * 90;
  return (

    <div
      style={{
        width: "900px",
        margin: "auto",
        paddingTop: "40px"
      }}
    >

      <h2>
        Box Plot: {selectedColumn}
      </h2>

      <div
        style={{
          position: "relative",
          height: "120px",
          borderBottom:
            "2px solid white"
        }}
      >

        {/* Whisker */}
        {/* Min Cap */}
        <div
          style={{
            position: "absolute",
            left: `${minPos}%`,
            top: "40%",
            width: "2px",
            height: "25px",
            background: "white"
          }}
        />

        {/* Max Cap */}
        <div
          style={{
            position: "absolute",
            left: `calc(${maxPos}% - 1px)`,
            top: "40%",
            width: "2px",
            height: "25px",
            background: "white"
          }}
        />

        <div
          style={{
            position: "absolute",
            left: `${minPos}%`,
            width: `${maxPos - minPos}%`,
            top: "50%",
            height: "2px",
            background: "white"
          }}
        />

        {/* Box */}

        <div
          style={{
            position: "absolute",
            left: `${q1Pos}%`,
            width: `${q3Pos - q1Pos}%`,
            top: "35%",
            height: "30px",
            background: "#4F46E5",
            border: "2px solid #818CF8",
            borderRadius: "4px",
          }}
        />

        {/* Median */}

        <div
          style={{
            position: "absolute",
           left: `${medianPos}%`,
            top: "30%",
            width: "3px",
            height: "40px",
            background: "white"
          }}
        />

      </div>

      <div
        style={{
          display: "flex",
          justifyContent:
            "space-between",
          marginTop: "20px"
        }}
      >

        <div>
          Min<br />
          {stats.min}
        </div>

        <div>
          Q1<br />
          {stats.q1}
        </div>

        <div>
          Median<br />
          {stats.median}
        </div>

        <div>
          Q3<br />
          {stats.q3}
        </div>

        <div>
          Max<br />
          {stats.max}
        </div>

      </div>

    </div>

  );

}

export default BoxPlotView;