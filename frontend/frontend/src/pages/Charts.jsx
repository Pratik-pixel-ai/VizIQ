import ChartControlsSection from "../components/ChartControlsSection";
import BarChartSection from "../components/BarChartSection";
import DatasetPreviewSection from "../components/DatasetPreviewSection";
import RecommendedChartsSection from "../components/RecommendedChartsSection";

export default function Charts({
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
  recommendedChart,
  rows,
  charts,
  formatChartName,
}) {
  return (
    <>
      <ChartControlsSection
        chartType={chartType}
        setChartType={setChartType}
        xColumn={xColumn}
        setXColumn={setXColumn}
        yColumn={yColumn}
        setYColumn={setYColumn}
        sizeColumn={sizeColumn}
        setSizeColumn={setSizeColumn}
        selectedColumn={selectedColumn}
        setSelectedColumn={setSelectedColumn}
        columns={columns}
        getRecommendedChart={getRecommendedChart}
      />

      <BarChartSection
        selectedColumn={selectedColumn}
        chartType={chartType}
        recommendedChart={recommendedChart}
        xColumn={xColumn}
        yColumn={yColumn}
        sizeColumn={sizeColumn}
      />

      <RecommendedChartsSection
        charts={charts}
        setChartType={setChartType}
        formatChartName={formatChartName}
      />

      <DatasetPreviewSection rows={rows} />
    </>
  );
}
