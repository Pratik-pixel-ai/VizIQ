import { useEffect, useState } from "react";
import axios from "axios";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip
} from "recharts";

function LineChartView({
  xColumn,
  yColumn
}) {

  const [data, setData] = useState([]);

  useEffect(() => {

    if (!xColumn || !yColumn) return;

   axios
     .get(
       `http://localhost:8080/api/line-data?xColumn=${xColumn}&yColumn=${yColumn}`
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

    <LineChart
      width={900}
      height={400}
      data={data}
    >

      <CartesianGrid strokeDasharray="3 3" />

      <XAxis dataKey="x" />

      <YAxis />

      <Tooltip />

      <Line
        type="monotone"
        dataKey="y"
        stroke="#2563EB"
        strokeWidth={3}
        dot={false}
      />

    </LineChart>

  );
}

export default LineChartView;