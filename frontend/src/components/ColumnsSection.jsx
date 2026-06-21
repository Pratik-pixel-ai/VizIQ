export default function ColumnsSection({
    columns
}) {
    return (
        <div
            style={{
                border: "1px solid white",
                padding: "20px",
                marginBottom: "20px"
            }}
        >
            <h2>Detected Columns</h2>

            <ul>
                {Object.entries(columns).map(
                    ([name, type]) => (
                        <li key={name}>
                            {name} ({type})
                        </li>
                    )
                )}
            </ul>
        </div>
    );
}