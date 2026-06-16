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

function BarChartView({ selectedColumn }) {

  const [data, setData] = useState([]);

  useEffect(() => {

    if (!selectedColumn) return;

    axios
      .get(
        `http://localhost:8080/api/chart-data?column=${selectedColumn}`
      )
      .then((response) => {

        const chartData =
          Object.entries(response.data)
            .map(([name, count]) => ({
              name,
              count
            }));

        setData(chartData);
      });

  }, [selectedColumn]);

  return (

    <BarChart
      width={900}
      height={400}
      data={data.slice(0, 15)}
    >

      <CartesianGrid strokeDasharray="3 3" />

      <XAxis dataKey="name" />

      <YAxis />

      <Tooltip />

      <Bar dataKey="count" />

    </BarChart>

  );
}

export default BarChartView;