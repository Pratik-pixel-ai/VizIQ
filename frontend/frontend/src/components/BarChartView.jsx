import HistogramView from "./HistogramView";
import ScatterPlotView from "./ScatterPlotView";
import LineChartView from "./LineChartView";
import AreaChartView from "./AreaChartView";
import BoxPlotView from "./BoxPlotView";
import HeatMapView from "./HeatMapView";
import BubbleChartView from "./BubbleChartView";
import { PieChart, Pie, Cell, Legend, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from "recharts";
import { useEffect, useState } from "react";
import axios from "axios";
import { tooltipStyle, axisProps, gridProps, palette } from "../chartTheme";

function BarChartView({ selectedColumn, chartType, recommendedChart, xColumn, yColumn, sizeColumn }) {
  const [data, setData] = useState([]);

  useEffect(() => {
    if (!selectedColumn) return;
    axios.get(`http://localhost:8080/api/chart-data?column=${selectedColumn}`).then((response) => {
      const chartData = Object.entries(response.data).map(([name, count]) => ({ name, count }));
      setData(chartData);
    });
  }, [selectedColumn]);

  if (chartType === "HISTOGRAM") return <HistogramView selectedColumn={selectedColumn} />;
  if (chartType === "AREA") return <AreaChartView xColumn={xColumn} yColumn={yColumn} />;
  if (chartType === "LINE") return <LineChartView xColumn={xColumn} yColumn={yColumn} />;
  if (chartType === "BOXPLOT") return <BoxPlotView selectedColumn={selectedColumn} />;
  if (chartType === "BUBBLE") return <BubbleChartView xColumn={xColumn} yColumn={yColumn} sizeColumn={sizeColumn} />;
  if (chartType === "SCATTER") return <ScatterPlotView xColumn={xColumn} yColumn={yColumn} />;
  if (chartType === "HEATMAP") return <HeatMapView xColumn={xColumn} yColumn={yColumn} />;

  if (chartType === "PIE") {
    if (!selectedColumn) {
      return <p className="text-sm text-[var(--text-secondary)] py-12 text-center">Select a column to visualize.</p>;
    }
    if (data.length > 10) {
      return (
        <div className="text-center py-10">
          <h3 className="text-sm font-semibold text-[var(--text-primary)]">Too many categories for a pie chart.</h3>
          <p className="text-xs text-[var(--text-secondary)] mt-1.5">
            Recommended chart: <span className="font-semibold">{recommendedChart}</span>
          </p>
        </div>
      );
    }
    return (
      <ResponsiveContainer width="100%" height={380}>
        <PieChart>
          <Pie data={data} dataKey="count" nameKey="name" outerRadius={120} label>
            {data.map((_, index) => (
              <Cell key={index} fill={palette[index % palette.length]} />
            ))}
          </Pie>
          <Tooltip {...tooltipStyle} />
          <Legend wrapperStyle={{ fontSize: 13, color: "var(--text-secondary)" }} />
        </PieChart>
      </ResponsiveContainer>
    );
  }

  if (!selectedColumn) {
    return <p className="text-sm text-[var(--text-secondary)] py-12 text-center">Select a column to visualize.</p>;
  }

  return (
    <ResponsiveContainer width="100%" height={380}>
      <BarChart data={data.slice(0, 15)}>
        <CartesianGrid {...gridProps} />
        <XAxis dataKey="name" {...axisProps} />
        <YAxis {...axisProps} />
        <Tooltip {...tooltipStyle} />
        <Bar dataKey="count" fill="var(--accent)" radius={[6, 6, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}

export default BarChartView;
