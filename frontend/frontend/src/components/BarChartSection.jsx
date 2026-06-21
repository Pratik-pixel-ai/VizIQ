import { LineChart } from "lucide-react";
import Card from "./ui/Card";
import BarChartView from "./BarChartView";

export default function BarChartSection({ selectedColumn, chartType, recommendedChart, xColumn, yColumn, sizeColumn }) {
  return (
    <Card title="Analytics Chart" icon={LineChart}>
      <BarChartView
        selectedColumn={selectedColumn}
        chartType={chartType}
        recommendedChart={recommendedChart}
        xColumn={xColumn}
        yColumn={yColumn}
        sizeColumn={sizeColumn}
      />
    </Card>
  );
}
