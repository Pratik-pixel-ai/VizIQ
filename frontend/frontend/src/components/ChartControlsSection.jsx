import { SlidersHorizontal } from "lucide-react";
import Card from "./ui/Card";
import Select from "./ui/Select";

const CHART_TYPES = [
  { value: "BAR", label: "Bar Chart" },
  { value: "PIE", label: "Pie Chart" },
  { value: "HISTOGRAM", label: "Histogram" },
  { value: "SCATTER", label: "Scatter Plot" },
  { value: "LINE", label: "Line Chart" },
  { value: "AREA", label: "Area Chart" },
  { value: "BUBBLE", label: "Bubble Chart" },
  { value: "BOXPLOT", label: "Box Plot" },
  { value: "HEATMAP", label: "Heat Map" },
];

export default function ChartControlsSection({
  chartType,
  setChartType,
  xColumn,
  setXColumn,
  yColumn,
  setYColumn,
  sizeColumn,
  setSizeColumn,
  selectedColumn,
  setSelectedColumn,
  columns,
  getRecommendedChart,
}) {
  const needsXY = ["SCATTER", "LINE", "AREA", "BUBBLE", "HEATMAP"].includes(chartType);
  const numericCols = Object.entries(columns).filter(([, type]) => type === "NUMBER");

  return (
    <Card title="Create Chart" icon={SlidersHorizontal}>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Select label="Chart Type" value={chartType} onChange={(e) => setChartType(e.target.value)}>
          {CHART_TYPES.map((c) => (
            <option key={c.value} value={c.value}>
              {c.label}
            </option>
          ))}
        </Select>

        {needsXY ? (
          <>
            <Select label="X Axis" value={xColumn} onChange={(e) => setXColumn(e.target.value)}>
              <option value="">Select X Column</option>
              {numericCols.map(([name]) => (
                <option key={name} value={name}>
                  {name}
                </option>
              ))}
            </Select>

            <Select label="Y Axis" value={yColumn} onChange={(e) => setYColumn(e.target.value)}>
              <option value="">Select Y Column</option>
              {numericCols.map(([name]) => (
                <option key={name} value={name}>
                  {name}
                </option>
              ))}
            </Select>

            {chartType === "BUBBLE" && (
              <Select label="Bubble Size" value={sizeColumn} onChange={(e) => setSizeColumn(e.target.value)}>
                <option value="">Select Size Column</option>
                {numericCols.map(([name]) => (
                  <option key={name} value={name}>
                    {name}
                  </option>
                ))}
              </Select>
            )}
          </>
        ) : (
          <Select
            label="Select Column"
            value={selectedColumn}
            onChange={(e) => {
              const column = e.target.value;
              setSelectedColumn(column);
              getRecommendedChart(column);
            }}
          >
            <option value="">Select Column</option>
            {Object.entries(columns).map(([name]) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
          </Select>
        )}
      </div>
    </Card>
  );
}
