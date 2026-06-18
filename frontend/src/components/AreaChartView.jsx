import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from "recharts";

import { useEffect, useState } from "react";
import axios from "axios";

function AreaChartView({
  xColumn,
  yColumn
}) {

  const [data, setData] = useState([]);

  useEffect(() => {

    if (!xColumn || !yColumn) return;

    axios
      .get(
        `http://localhost:8080/api/line-data?xColumn=${xColumn}&yColumn=${yColumn}`
      )
      .then((response) => {

        setData(response.data);

      });

  }, [xColumn, yColumn]);

  return (

    <AreaChart
      width={1000}
      height={450}
      data={data}
    >

      <CartesianGrid strokeDasharray="3 3" />

      <XAxis dataKey="x" />

      <YAxis />

      <Tooltip />

      <Area
        type="monotone"
        dataKey="y"
        stroke="#22C55E"
        fill="#22C55E"
      />

    </AreaChart>

  );

}

export default AreaChartView;