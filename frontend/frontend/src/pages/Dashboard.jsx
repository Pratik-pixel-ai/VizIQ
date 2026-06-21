import UploadSection from "../components/UploadSection";
import DetectedColumnsSection from "../components/DetectedColumnsSection";
import StatsCardsSection from "../components/StatsCardsSection";
import SummarySection from "../components/SummarySection";
import HealthSection from "../components/HealthSection";
import DatasetQualitySection from "../components/DatasetQualitySection";
import OutliersSection from "../components/OutliersSection";
import CorrelationSection from "../components/CorrelationSection";
import InsightsSection from "../components/InsightsSection";
import RecommendedChartsSection from "../components/RecommendedChartsSection";

export default function Dashboard({
  rows,
  columns,
  summary,
  datasetHealth,
  missingValues,
  outliers,
  groupedOutliers,
  correlations,
  insights,
  charts,
  setChartType,
  setActivePage,
  formatChartName,
  setFile,
  uploadFile,
}) {
  return (
    <>
      <UploadSection setFile={setFile} uploadFile={uploadFile} />

      <StatsCardsSection rows={rows} />

      <DetectedColumnsSection columns={columns} />

      <HealthSection datasetHealth={datasetHealth} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <SummarySection summary={summary} />
        <DatasetQualitySection missingValues={missingValues} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <OutliersSection outliers={outliers} groupedOutliers={groupedOutliers} />
        <CorrelationSection correlations={correlations} />
      </div>

      <InsightsSection insights={insights} />

      <RecommendedChartsSection
        charts={charts}
        setChartType={(type) => {
          setChartType(type);
          setActivePage("charts");
        }}
        formatChartName={formatChartName}
      />
    </>
  );
}
