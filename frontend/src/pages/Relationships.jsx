import CorrelationSection
from "../components/CorrelationSection";

export default function Relationships({
    correlations
}) {

    return (
        <>
            <h1>Relationships</h1>

            <CorrelationSection
                correlations={correlations}
            />
        </>
    );
}