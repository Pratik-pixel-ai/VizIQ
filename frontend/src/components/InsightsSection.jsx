export default function InsightsSection({
    insights
}) {

    return (
        <>
            {insights.length > 0 && (

                <div
                      style={{
                        marginBottom: "30px"
                      }}
                    >
                      <h2>Smart Insights</h2>

                      {insights.map((insight, index) => (

                        <div
                          key={index}
                          style={{
                            padding: "15px",
                            border: "1px solid #333",
                            borderRadius: "10px",
                            marginBottom: "10px",
                            backgroundColor: "#111827"
                          }}
                        >

                          <span
                            style={{
                              fontSize: "18px"
                            }}
                          >
                            💡
                          </span>

                          {" "}

                          {insight.message}

                        </div>

                      ))}

                    </div>

            )}
        </>
    );
}