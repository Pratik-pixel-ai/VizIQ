import { useEffect, useState } from "react";
import axios from "axios";

import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip
} from "recharts";

function ScatterPlotView({
  xColumn,
  yColumn
}) {

  const [data, setData] = useState([]);

  useEffect(() => {

    if (!xColumn || !yColumn) return;

    axios
      .get(
        `http://localhost:8080/api/scatter-data?xColumn=${xColumn}&yColumn=${yColumn}`
      )
      .then((response) => {

        setData(response.data);

      });

  }, [xColumn, yColumn]);

  if (!xColumn || !yColumn) {

    return (
      <h3>
        Please select X and Y columns.
      </h3>
    );

  }

  return (

    <ScatterChart
      width={900}
      height={400}
    >

      <CartesianGrid />

      <XAxis
        dataKey="x"
        name={xColumn}
      />

      <YAxis
        dataKey="y"
        name={yColumn}
      />

      <Tooltip />

      <Scatter
        data={data}
        fill="#EF4444"
        shape={(props) => {

          const pointSize =
            data.length > 5000 ? 1 :
            data.length > 1000 ? 2 :
            data.length > 300 ? 3 :
            5;

          return (
            <circle
              cx={props.cx}
              cy={props.cy}
              r={pointSize}
              fill="#EF4444"
            />
          );

        }}
      />

    </ScatterChart>

  );
}

export default ScatterPlotView;