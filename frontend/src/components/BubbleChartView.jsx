import { useEffect, useState } from "react";
import axios from "axios";

import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  ZAxis,
  Tooltip,
  CartesianGrid
} from "recharts";

function BubbleChartView({
  xColumn,
  yColumn,
  sizeColumn
}) {

  const [data, setData] = useState([]);

  useEffect(() => {

    if (
      !xColumn ||
      !yColumn ||
      !sizeColumn
    ) return;

    axios
      .get(
        `http://localhost:8080/api/bubble-data?xColumn=${xColumn}&yColumn=${yColumn}&sizeColumn=${sizeColumn}`
      )
      .then((response) => {

        setData(response.data);

      });

  }, [
    xColumn,
    yColumn,
    sizeColumn
  ]);

const bubbleRange =
  data.length > 10000
    ? [2, 6]
    : data.length > 5000
    ? [3, 8]
    : data.length > 1000
    ? [4, 12]
    : data.length > 300
    ? [5, 18]
    : [8, 25];
    console.log(
      "Rows:",
      data.length,
      "Bubble Range:",
      bubbleRange
    );
  return (

    <ScatterChart
      width={1000}
      height={500}
    >

      <CartesianGrid />

      <XAxis
        dataKey="x"
        type="number"
        domain={['auto', 'auto']}
        name={xColumn}
      />

      <YAxis
        dataKey="y"
        type="number"
        domain={['auto', 'auto']}
        name={yColumn}
      />

      <ZAxis
        dataKey="z"
        range={bubbleRange}
        name={sizeColumn}
      />

      <Tooltip
        cursor={{ strokeDasharray: "3 3" }}
      />

      <Scatter
        data={data}
        fill="#3B82F6"
        fillOpacity={0.5}
      />

    </ScatterChart>

  );

}

export default BubbleChartView;