import { useEffect, useState } from "react";
import axios from "axios";
import { ScatterChart, Scatter, XAxis, YAxis, ZAxis, Tooltip, CartesianGrid, ResponsiveContainer } from "recharts";
import { tooltipStyle, axisProps, gridProps } from "../chartTheme";

function BubbleChartView({ xColumn, yColumn, sizeColumn }) {
  const [data, setData] = useState([]);

  useEffect(() => {
    if (!xColumn || !yColumn || !sizeColumn) return;
    axios
      .get(`http://localhost:8080/api/bubble-data?xColumn=${xColumn}&yColumn=${yColumn}&sizeColumn=${sizeColumn}`)
      .then((response) => setData(response.data));
  }, [xColumn, yColumn, sizeColumn]);

  if (!xColumn || !yColumn || !sizeColumn) {
    return <p className="text-sm text-[var(--text-secondary)] py-12 text-center">Please select X, Y and size columns.</p>;
  }

  const bubbleRange =
    data.length > 10000 ? [2, 6] : data.length > 5000 ? [3, 8] : data.length > 1000 ? [4, 12] : data.length > 300 ? [5, 18] : [8, 25];

  return (
    <ResponsiveContainer width="100%" height={420}>
      <ScatterChart>
        <CartesianGrid {...gridProps} />
        <XAxis dataKey="x" type="number" domain={["auto", "auto"]} name={xColumn} {...axisProps} />
        <YAxis dataKey="y" type="number" domain={["auto", "auto"]} name={yColumn} {...axisProps} />
        <ZAxis dataKey="z" range={bubbleRange} name={sizeColumn} />
        <Tooltip {...tooltipStyle} cursor={{ strokeDasharray: "3 3", stroke: "var(--surface-border)" }} />
        <Scatter data={data} fill="var(--accent)" fillOpacity={0.55} />
      </ScatterChart>
    </ResponsiveContainer>
  );
}

export default BubbleChartView;
