import { ResponsiveHeatMap } from "@nivo/heatmap";
import { useEffect, useState } from "react";
import axios from "axios";

function HeatMapView({ xColumn, yColumn, height = 560 }) {
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    if (!xColumn || !yColumn) return;

    axios
      .get(`https://viziq-production.up.railway.app/api/heatmap-data?xColumn=${xColumn}&yColumn=${yColumn}`)
      .then((response) => {
        const data = response.data;
        const grouped = {};
        const BIN_COUNT = 10;

        const minX = Math.min(...data.map((d) => d.x));
        const maxX = Math.max(...data.map((d) => d.x));
        const minY = Math.min(...data.map((d) => d.y));
        const maxY = Math.max(...data.map((d) => d.y));

        const xBinSize = (maxX - minX) / BIN_COUNT;
        const yBinSize = (maxY - minY) / BIN_COUNT;

        data.forEach((point) => {
          const xBin = Math.min(BIN_COUNT - 1, Math.floor((point.x - minX) / xBinSize));
          const yBin = Math.min(BIN_COUNT - 1, Math.floor((point.y - minY) / yBinSize));

          const xLabel = `${Math.round(minX + xBin * xBinSize)}-${Math.round(minX + (xBin + 1) * xBinSize)}`;
          const yLabel = `${Math.round(minY + yBin * yBinSize)}-${Math.round(minY + (yBin + 1) * yBinSize)}`;

          if (!grouped[yLabel]) grouped[yLabel] = {};
          grouped[yLabel][xLabel] = (grouped[yLabel][xLabel] || 0) + 1;
        });

        const sortedY = Object.keys(grouped).sort((a, b) => parseInt(b.split("-")[0]) - parseInt(a.split("-")[0]));

        const formatted = sortedY.map((y) => ({
          id: y,
          data: Object.keys(grouped[y]).map((x) => ({ x, y: grouped[y][x] })),
        }));

        setChartData(formatted);
      });
  }, [xColumn, yColumn]);

  if (chartData.length === 0) {
    return <p className="text-sm text-[var(--text-secondary)] py-12 text-center">Loading heat map…</p>;
  }

  return (
    <div style={{ height }}>
      <h3 className="text-sm font-semibold text-[var(--text-secondary)] mb-4 text-center">
        {xColumn} vs {yColumn}
      </h3>

      <ResponsiveHeatMap
        data={chartData}
        margin={{ top: 50, right: 70, bottom: 50, left: 70 }}
        axisTop={{ tickRotation: -45 }}
        axisLeft={{ tickSize: 5 }}
        cellOpacity={1}
        cellBorderWidth={1}
        enableLabels={false}
        theme={{
          axis: { ticks: { text: { fill: "var(--text-secondary)", fontSize: 11 } } },
          labels: { text: { fill: "var(--text-secondary)" } },
        }}
        colors={{ type: "sequential", scheme: "purples" }}
        emptyColor="var(--surface-strong)"
        borderColor="var(--bg-base)"
        labelTextColor="#ffffff"
      />
    </div>
  );
}

export default HeatMapView;
