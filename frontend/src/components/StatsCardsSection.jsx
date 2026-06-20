export default function StatsCardsSection({
    rows
}) {

    return (

        <div
            style={{
                display: "flex",
                gap: "20px",
                marginBottom: "30px"
            }}
        >

            <div
                style={{
                    border: "1px solid white",
                    padding: "20px"
                }}
            >
                <h3>Total Rows</h3>

                <h2>
                    {rows.length - 1}
                </h2>
            </div>

            <div
                style={{
                    border: "1px solid white",
                    padding: "20px"
                }}
            >
                <h3>Total Columns</h3>

                <h2>
                    {rows.length > 0
                        ? rows[0].length
                        : 0}
                </h2>
            </div>

        </div>

    );
}