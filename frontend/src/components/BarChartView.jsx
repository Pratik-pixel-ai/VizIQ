import HistogramView from "./HistogramView";
import ScatterPlotView from "./ScatterPlotView";
import LineChartView from "./LineChartView";
import AreaChartView from "./AreaChartView";
import BoxPlotView from "./BoxPlotView";
import HeatMapView from "./HeatMapView";
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
import BubbleChartView from "./BubbleChartView";
function BarChartView({
  selectedColumn,
  chartType,
  recommendedChart,
  xColumn,
  yColumn,
  sizeColumn
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



if (chartType === "HISTOGRAM") {

  return (
    <HistogramView
      selectedColumn={selectedColumn}
    />
  );

}

if (chartType === "AREA") {

  return (
    <AreaChartView
      xColumn={xColumn}
      yColumn={yColumn}
    />
  );

}

if (chartType === "LINE") {

  return (
    <LineChartView
      xColumn={xColumn}
      yColumn={yColumn}
    />
  );

}

if (chartType === "BOXPLOT") {

  return (
    <BoxPlotView
      selectedColumn={selectedColumn}
    />
  );

}

if (chartType === "BUBBLE") {

  return (
    <BubbleChartView
      xColumn={xColumn}
      yColumn={yColumn}
      sizeColumn={sizeColumn}
    />
  );

}

if (chartType === "SCATTER") {

  return (
    <ScatterPlotView
      xColumn={xColumn}
      yColumn={yColumn}
    />
  );

}

if (chartType === "HEATMAP") {

  return (
    <HeatMapView
      xColumn={xColumn}
      yColumn={yColumn}
    />
  );

}

if (chartType === "PIE") {

  if (data.length > 10) {
    return (
      <div>
        <h3>
          Too many categories for Pie Chart.
        </h3>

        <h4>
          Recommended Chart:
          {" "}
          {recommendedChart}
        </h4>
      </div>
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

    <Bar
      dataKey="count"
      fill="#4F46E5"
    />

  </BarChart>

);
}
export default BarChartView;