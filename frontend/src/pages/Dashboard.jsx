import UploadSection from "../components/UploadSection";
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
    summary,
    datasetHealth,
    missingValues,
    outliers,
    groupedOutliers,
    correlations,
    insights,
    charts,
    setChartType,
    formatChartName,
    setFile,
    uploadFile
})  {

    return (
        <>
         <UploadSection
                  setFile={setFile}
                  uploadFile={uploadFile}
              />

         <StatsCardsSection
                   rows={rows}
               />

         <SummarySection
                 summary={summary}
             />

         <HealthSection
                datasetHealth={datasetHealth}
              />

         <DatasetQualitySection
              missingValues={missingValues}
          />

         <OutliersSection
              outliers={outliers}
              groupedOutliers={groupedOutliers}
          />

         <CorrelationSection
               correlations={correlations}
           />

         <InsightsSection
                 insights={insights}
         />

         <RecommendedChartsSection
                 charts={charts}
                 setChartType={setChartType}
                 formatChartName={formatChartName}
         />



        </>
    );
}