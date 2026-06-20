export default function HealthSection({
  datasetHealth
}) {
  return (
        <>

{datasetHealth && (

      <div
        style={{
          border: "1px solid #333",
          borderRadius: "12px",
          padding: "20px",
          marginBottom: "30px",
          backgroundColor: "#111827"
        }}
      >

        <h2>
          Dataset Health
        </h2>

        <h1
          style={{
            margin: "10px 0"
          }}
        >
          {datasetHealth.score}/100
        </h1>

        <h3>

          {datasetHealth.status ===
           "Excellent" && "🟢 Excellent"}

          {datasetHealth.status ===
           "Good" && "🟡 Good"}

          {datasetHealth.status ===
           "Fair" && "🟠 Fair"}

          {datasetHealth.status ===
           "Poor" && "🔴 Poor"}

        </h3>

        <div
          style={{
            marginTop: "20px",
            textAlign: "left",
            maxWidth: "300px",
            margin: "20px auto 0"
          }}
        >

          <p>
            📊 Dataset Size:
            {" "}
            {datasetHealth.datasetSizeScore}/25
          </p>

          <p>
            🔢 Numeric Quality:
            {" "}
            {datasetHealth.numericQualityScore}/20
          </p>

          <p>
            🔗 Relationships:
            {" "}
            {datasetHealth.relationshipScore}/15
          </p>

          <p>
            🌈 Diversity:
            {" "}
            {datasetHealth.diversityScore}/15
          </p>

          <p>
            📋 Completeness:
            {" "}
            {datasetHealth.completenessScore}/25
          </p>

        </div>

      </div>

    )}

        </>
    );
}