import BarChartView
from "./BarChartView";

export default function BarChartSection({
    selectedColumn,
    chartType,
    recommendedChart,
    xColumn,
    yColumn,
    sizeColumn
}) {

    return (
        <>
         <h2>Analytics Charts</h2>

              <BarChartView
                selectedColumn={selectedColumn}
                chartType={chartType}
                recommendedChart={recommendedChart}
                xColumn={xColumn}
                yColumn={yColumn}
                sizeColumn={sizeColumn}
              />
        </>
    );
}