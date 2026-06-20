export default function Dashboard() {

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
         </div>

         <InsightsSection
                 insights={insights}
         />

         <RecommendedChartsSection
                 charts={charts}
                 setChartType={setChartType}
                 formatChartName={formatChartName}
         />
             </div>



        </>
    );
}