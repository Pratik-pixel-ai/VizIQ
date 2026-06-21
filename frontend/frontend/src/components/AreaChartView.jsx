import { AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from "recharts";
import { useEffect, useState } from "react";
import axios from "axios";
import { tooltipStyle, axisProps, gridProps } from "../chartTheme";

function AreaChartView({ xColumn, yColumn }) {
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
    <ResponsiveContainer width="100%" height={400}>
      <AreaChart data={data}>
        <defs>
          <linearGradient id="areaFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="var(--accent-2)" stopOpacity={0.5} />
            <stop offset="95%" stopColor="var(--accent-2)" stopOpacity={0.02} />
          </linearGradient>
        </defs>
        <CartesianGrid {...gridProps} />
        <XAxis dataKey="x" {...axisProps} />
        <YAxis {...axisProps} />
        <Tooltip {...tooltipStyle} />
        <Area type="monotone" dataKey="y" stroke="var(--accent-2)" strokeWidth={2.5} fill="url(#areaFill)" />
      </AreaChart>
    </ResponsiveContainer>
  );
}

export default AreaChartView;
