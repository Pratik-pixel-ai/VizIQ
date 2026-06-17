import {
  PieChart,
  Pie,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from "recharts";
import { useEffect, useState } from "react";
import axios from "axios";
function BarChartView({
  selectedColumn,
  chartType
}) {

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



if (chartType === "PIE") {

  if (data.length > 10) {
    return (
      <h3>
        Too many categories for Pie Chart.
        Use Bar Chart instead.
      </h3>
    );
  }

  return (
    <PieChart width={500} height={400}>
      <Pie
        data={data}
        dataKey="count"
        nameKey="name"
        outerRadius={120}
        label
      />
      <Tooltip />
      <Legend />
    </PieChart>
  );
}

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

      <Bar dataKey="count" fill="#4F46E5" />

    </BarChart>

  );

}
export default BarChartView;