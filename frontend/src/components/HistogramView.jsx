import { useEffect, useState } from "react";
import axios from "axios";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from "recharts";

function HistogramView({
  selectedColumn
}) {

  const [data, setData] = useState([]);

  useEffect(() => {

    if (!selectedColumn) return;

    axios
      .get(
        `http://localhost:8080/api/histogram-data?column=${selectedColumn}`
      )
      .then((response) => {

        setData(response.data);

      });

  }, [selectedColumn]);

  if (data.length === 0) {

    return (
      <h3>
        Histogram can only be created for numeric columns.
      </h3>
    );

  }

  return (

    <BarChart
      width={900}
      height={400}
      data={data}
    >

      <CartesianGrid strokeDasharray="3 3" />

      <XAxis dataKey="range" />

      <YAxis />

      <Tooltip />

      <Bar
        dataKey="count"
        fill="#22C55E"
      />

    </BarChart>

  );
}

export default HistogramView;