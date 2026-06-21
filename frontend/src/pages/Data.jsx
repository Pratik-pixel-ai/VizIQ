import DatasetPreviewSection
from "../components/DatasetPreviewSection";

export default function Data({
    rows
}) {

    return (
        <>
            <h1>Dataset Preview</h1>

            <DatasetPreviewSection
                rows={rows}
            />
        </>
    );
}