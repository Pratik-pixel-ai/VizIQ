import DatasetQualitySection
from "../components/DatasetQualitySection";

import OutliersSection
from "../components/OutliersSection";

export default function Quality({
    missingValues,
    outliers,
    groupedOutliers
}) {
    console.log(missingValues);

    return (
        <>
            <h1>Data Quality</h1>

            <DatasetQualitySection
                missingValues={missingValues}
            />

            {outliers.length > 0 && (

                <div
                    style={{
                        border: "1px solid #333",
                        borderRadius: "12px",
                        padding: "20px",
                        marginBottom: "20px"
                    }}
                >

                    <h2>
                        Outlier Summary
                    </h2>

                    {Object.entries(groupedOutliers).map(
                        ([column, items]) => (

                            <div
                                key={column}
                                style={{
                                    marginBottom: "15px"
                                }}
                            >

                                <strong>
                                    {column}
                                </strong>

                                <p>
                                    {items
                                        .map(
                                            item =>
                                                item.value
                                        )
                                        .join(" • ")
                                    }
                                </p>

                            </div>

                        )
                    )}

                </div>

            )}

            <OutliersSection
                outliers={outliers}
                groupedOutliers={groupedOutliers}
            />
        </>
    );
}