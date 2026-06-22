import { useEffect, useState } from "react";
import axios from "axios";
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from "recharts";
import { tooltipStyle, axisProps, gridProps } from "../chartTheme";

function HistogramView({ selectedColumn, height = 380 }) {
  const [data, setData] = useState([]);

  useEffect(() => {
    if (!selectedColumn) return;
    axios
      .get(`https://viziq-production.up.railway.app/api/histogram-data?column=${selectedColumn}`)
      .then((response) => setData(response.data));
  }, [selectedColumn]);

  if (data.length === 0) {
    return <p className="text-sm text-[var(--text-secondary)] py-12 text-center">Histogram can only be created for numeric columns.</p>;
  }

  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data}>
        <CartesianGrid {...gridProps} />
        <XAxis dataKey="range" {...axisProps} />
        <YAxis {...axisProps} />
        <Tooltip {...tooltipStyle} />
        <Bar dataKey="count" fill="var(--accent-2)" radius={[6, 6, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}

export default HistogramView;
