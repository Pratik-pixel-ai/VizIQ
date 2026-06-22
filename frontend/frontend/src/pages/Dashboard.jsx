import UploadSection from "../components/UploadSection";
import DatasetMetadataCard from "../components/DatasetMetadataCard";
import DetectedColumnsSection from "../components/DetectedColumnsSection";
import StatsCardsSection from "../components/StatsCardsSection";
import SummarySection from "../components/SummarySection";
import HealthSection from "../components/HealthSection";
import DatasetQualitySection from "../components/DatasetQualitySection";
import OutliersSection from "../components/OutliersSection";
import CorrelationSection from "../components/CorrelationSection";
import CorrelationHeatmapSection from "../components/CorrelationHeatmapSection";
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
  loading,
  metadata,
  theme,
}) {
  const totalRows = Math.max(rows.length - 1, 0);
  const hasData = rows.length > 0;

  return (
    <>
      <UploadSection setFile={setFile} uploadFile={uploadFile} loading={loading} />

      {hasData && (
        <>
          <DatasetMetadataCard metadata={metadata} summary={summary} />

          <StatsCardsSection rows={rows} />

          <DetectedColumnsSection columns={columns} />

          <HealthSection datasetHealth={datasetHealth} />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <SummarySection summary={summary} />
            <DatasetQualitySection missingValues={missingValues} totalRows={totalRows} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <OutliersSection outliers={outliers} groupedOutliers={groupedOutliers} />
            <CorrelationSection correlations={correlations} />
          </div>

          <CorrelationHeatmapSection correlations={correlations} theme={theme} />

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
      )}
    </>
  );
}
