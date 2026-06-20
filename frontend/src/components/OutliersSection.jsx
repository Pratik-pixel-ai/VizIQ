export default function OutliersSection({
    outliers,
    groupedOutliers
}) {

    return (
        <>
        <div
          style={{
            marginBottom: "30px"
          }}
        >

          <h2>
            🚨 Potential Outliers
          </h2>

          {outliers.length === 0 ? (

            <div
              style={{
                padding: "15px",
                border: "1px solid #333",
                borderRadius: "10px"
              }}
            >
              ✅ No significant outliers detected
            </div>

          ) : (

            Object.entries(
              groupedOutliers
            ).map(

              ([column, items]) => (

                <div
                  key={column}
                  style={{
                    border: "1px solid #333",
                    borderRadius: "12px",
                    padding: "15px",
                    marginBottom: "12px"
                  }}
                >

                  <h3>
                    {column}
                  </h3>

                  <p>
                    Severity:
                    {" "}
                    <strong
                      style={{
                        color:
                          items[0].severity === "Extreme"
                            ? "#ff4d4d"
                            : "#ffa500"
                      }}
                    >
                      {items[0].severity}
                    </strong>
                  </p>

                  <p>
                    Expected Range:
                    {" "}
                    {items[0].lowerBound.toFixed(2)}
                    {" → "}
                    {items[0].upperBound.toFixed(2)}
                  </p>

                  <p>
                    Outlier Values:
                  </p>

                  <ul
                    style={{
                      listStyle: "none",
                      padding: 0
                    }}
                  >

                    <p>
                      {items.map(item => item.value).join(" • ")}
                    </p>



                  </ul>

                </div>

              )

            )

          )}

        </div>
        </>
    );
}