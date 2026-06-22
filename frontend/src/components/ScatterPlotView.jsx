import { useEffect, useState } from "react";
import axios from "axios";
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { tooltipStyle, axisProps, gridProps } from "../chartTheme";

function ScatterPlotView({ xColumn, yColumn, height = 380 }) {
  const [data, setData] = useState([]);

  useEffect(() => {
    if (!xColumn || !yColumn) return;
    axios
      .get(`https://viziq-production.up.railway.app/api/scatter-data?xColumn=${xColumn}&yColumn=${yColumn}`)
      .then((response) => setData(response.data));
  }, [xColumn, yColumn]);

  if (!xColumn || !yColumn) {
    return <p className="text-sm text-[var(--text-secondary)] py-12 text-center">Please select X and Y columns.</p>;
  }

  const pointSize = data.length > 5000 ? 1.5 : data.length > 1000 ? 2.5 : data.length > 300 ? 3.5 : 5;

  return (
    <ResponsiveContainer width="100%" height={height}>
      <ScatterChart>
        <CartesianGrid {...gridProps} />
        <XAxis dataKey="x" name={xColumn} {...axisProps} />
        <YAxis dataKey="y" name={yColumn} {...axisProps} />
        <Tooltip {...tooltipStyle} />
        <Scatter
          data={data}
          fill="var(--danger)"
          shape={(props) => <circle cx={props.cx} cy={props.cy} r={pointSize} fill="var(--danger)" fillOpacity={0.7} />}
        />
      </ScatterChart>
    </ResponsiveContainer>
  );
}

export default ScatterPlotView;
