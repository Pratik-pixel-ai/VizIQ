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
    getRecommendedChart
}) {
    return (
        <>
        <div
                style={{
                  border: "1px solid white",
                  padding: "20px",
                  marginBottom: "20px"
                }}
              >
                <h2>Create Chart</h2>

        <h3>Chart Type</h3>

                <select
                  value={chartType}
                  onChange={(e) => {
                    setChartType(e.target.value);
                  }}
                >
                  <option value="BAR">
                    Bar Chart
                  </option>

                  <option value="PIE">
                    Pie Chart
                  </option>

                  <option value="HISTOGRAM">
                    Histogram
                  </option>

                  <option value="SCATTER">
                    Scatter Plot
                  </option>

                  <option value="LINE">
                    Line Chart
                  </option>

                  <option value="AREA">
                    Area Chart
                  </option>

                  <option value="BUBBLE">
                    Bubble Chart
                  </option>

                  <option value="BOXPLOT">
                     Box Plot
                  </option>

                  <option value="HEATMAP">
                    Heat Map
                  </option>
                </select>



                <br />
                <br />

               {chartType === "SCATTER" ||
                chartType === "LINE" ||
                chartType === "AREA" ||
                chartType === "BUBBLE"||
                chartType === "HEATMAP" ? (

                  <>

                    <h3>X Axis</h3>

                    <select
                      value={xColumn}
                      onChange={(e) => {
                        setXColumn(e.target.value);
                      }}
                    >
                      <option value="">
                        Select X Column
                      </option>

                      {Object.entries(columns)
                        .filter(([_, type]) => type === "NUMBER")
                        .map(([name]) => (
                          <option
                            key={name}
                            value={name}
                          >
                            {name}
                          </option>
                        ))}
                    </select>

                    <br /><br />

                    <h3>Y Axis</h3>

                    <select
                      value={yColumn}
                      onChange={(e) => {
                        setYColumn(e.target.value);
                      }}
                    >
                      <option value="">
                        Select Y Column
                      </option>

                      {Object.entries(columns)
                        .filter(([_, type]) => type === "NUMBER")
                        .map(([name]) => (
                          <option
                            key={name}
                            value={name}
                          >
                            {name}
                          </option>
                        ))}
                    </select>
                    {chartType === "BUBBLE" && (

                      <>

                        <br /><br />

                        <h3>Bubble Size</h3>

                        <select
                          value={sizeColumn}
                          onChange={(e) => {
                            setSizeColumn(
                              e.target.value
                            );
                          }}
                        >

                          <option value="">
                            Select Size Column
                          </option>

                          {Object.entries(columns)
                            .filter(
                              ([_, type]) =>
                                type === "NUMBER"
                            )
                            .map(([name]) => (

                              <option
                                key={name}
                                value={name}
                              >
                                {name}
                              </option>

                            ))}

                        </select>

                      </>

                    )}

                  </>

                ) : (

                  <>

                    <h3>Select Column</h3>

                    <select
                      value={selectedColumn}
                      onChange={(e) => {

                        const column = e.target.value;

                        setSelectedColumn(column);

                        getRecommendedChart(column);

                      }}
                    >
                      <option value="">
                        Select Column
                      </option>

                      {Object.entries(columns).map(([name]) => (
                        <option
                          key={name}
                          value={name}
                        >
                          {name}
                        </option>
                      ))}
                    </select>

                  </>

                )}
              </div>
        </>
    );
}