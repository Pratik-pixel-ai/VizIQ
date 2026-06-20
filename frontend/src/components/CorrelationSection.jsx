export default function CorrelationSection({
    correlations
}) {

    return (
        <>
            {correlations.length > 0 && (

                <div>

                    <h2>
                        Strong Relationships
                    </h2>

                    {correlations.length === 0 ? (

                        <div
                            style={{
                                padding: "15px",
                                border: "1px solid #333",
                                borderRadius: "10px"
                            }}
                        >
                            No significant numeric relationships found.
                        </div>

                    ) : (

                        correlations.map((corr, index) => (

                            <div
                                key={index}
                                style={{
                                    padding: "15px",
                                    border: "1px solid #333",
                                    borderRadius: "10px",
                                    marginBottom: "10px"
                                }}
                            >
                                <h3>
                                    🔗 {corr.column1} ↔ {corr.column2}
                                </h3>

                                <p>
                                    Correlation Strength:
                                    {" "}
                                    <strong>
                                        {corr.correlation.toFixed(2)}
                                    </strong>
                                </p>

                            </div>

                        ))

                    )}

                </div>

            )}
        </>
    );
}