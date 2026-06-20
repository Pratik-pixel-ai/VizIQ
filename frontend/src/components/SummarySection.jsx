export default function SummarySection({
    summary
}) {

    return (
        <>
            {summary && (



                      <div
                        style={{
                          border: "1px solid #333",
                          borderRadius: "12px",
                          padding: "20px",
                          marginBottom: "30px",
                          background: "#07162d"
                        }}
                      >

                        <h2>
                          📊 Dataset Overview
                        </h2>

                        <p>
                          Rows: {summary.rows}
                        </p>

                        <p>
                          Columns: {summary.columns}
                        </p>

                        <p>
                          Numeric Columns: {summary.numericColumns}
                        </p>

                        <p>
                          Categorical Columns: {summary.categoricalColumns}
                        </p>

                        <p>
                          Missing Values: {summary.missingValues}
                        </p>

                        <p>
                          Outliers: {summary.outliers}
                        </p>

                      </div>



            )}
        </>
    );
}