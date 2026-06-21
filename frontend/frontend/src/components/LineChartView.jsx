import { useEffect, useState } from "react";
import axios from "axios";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { tooltipStyle, axisProps, gridProps } from "../chartTheme";

function LineChartView({ xColumn, yColumn }) {
  const [data, setData] = useState([]);

  useEffect(() => {
    if (!xColumn || !yColumn) return;
    axios
      .get(`http://localhost:8080/api/line-data?xColumn=${xColumn}&yColumn=${yColumn}`)
      .then((response) => setData(response.data));
  }, [xColumn, yColumn]);

  if (!xColumn || !yColumn) {
    return <p className="text-sm text-[var(--text-secondary)] py-12 text-center">Please select X and Y columns.</p>;
  }

  return (
    <ResponsiveContainer width="100%" height={380}>
      <LineChart data={data}>
        <CartesianGrid {...gridProps} />
        <XAxis dataKey="x" {...axisProps} />
        <YAxis {...axisProps} />
        <Tooltip {...tooltipStyle} />
        <Line type="monotone" dataKey="y" stroke="var(--accent)" strokeWidth={2.5} dot={false} />
      </LineChart>
    </ResponsiveContainer>
  );
}

export default LineChartView;
