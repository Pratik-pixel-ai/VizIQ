export default function RecommendedChartsSection({
    charts,
    setChartType,
    formatChartName
}) {

    return (
        <>
        <h2>Recommended Charts</h2>

                <ul
                  style={{
                    listStyle: "none",
                    padding: 0
                  }}
                >
                  {charts.map((chart, index) => (
                   <li
                     key={index}
                     onClick={() => {

                       if (chart.chartType === "BAR_CHART")
                         setChartType("BAR");

                       else if (chart.chartType === "PIE_CHART")
                         setChartType("PIE");

                       else if (chart.chartType === "HISTOGRAM")
                         setChartType("HISTOGRAM");

                       else if (chart.chartType === "SCATTER_PLOT")
                         setChartType("SCATTER");

                       else if (chart.chartType === "LINE_CHART")
                         setChartType("LINE");

                       else if (chart.chartType === "AREA_CHART")
                         setChartType("AREA");

                       else if (chart.chartType === "BUBBLE_CHART")
                         setChartType("BUBBLE");

                       else if (chart.chartType === "BOX_PLOT")
                         setChartType("BOXPLOT");

                       else if (chart.chartType === "HEAT_MAP")
                         setChartType("HEATMAP");

                     }}
                     style={{
                       marginBottom: "20px",
                       cursor: "pointer",
                       padding: "10px",
                       border: "1px solid #333",
                       borderRadius: "8px"
                     }}
                   >
                      <strong>
                        #{index + 1} {formatChartName(chart.chartType)}
                      </strong>
                      {" "}({chart.score})
                      <br />
                      {chart.reason}
                    </li>
                  ))}
                </ul>
        </>
    );
}