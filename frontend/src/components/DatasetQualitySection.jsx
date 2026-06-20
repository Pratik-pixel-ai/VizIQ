export default function DatasetQualitySection({
    missingValues
}) {

    return (
        <>
        <div
          style={{
            marginBottom: "30px"
          }}
        >

          <h2>
            Dataset Quality
          </h2>

          {missingValues.length === 0 ? (

            <div
              style={{
                padding: "15px",
                border: "1px solid #333",
                borderRadius: "10px"
              }}
            >
              ✅ No missing values detected
            </div>

          ) : (

            missingValues.map(
              (item, index) => (

                <div
                  key={index}
                  style={{
                    padding: "12px",
                    border: "1px solid #333",
                    borderRadius: "10px",
                    marginBottom: "10px"
                  }}
                >

                  ⚠ {item.column}

                  {" : "}

                  <strong>
                    {item.missingCount}
                  </strong>

                  {" missing values"}

                </div>

              )
            )

          )}

        </div>
        </>
    );
}