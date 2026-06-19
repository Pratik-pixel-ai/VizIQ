package com.viziq.backend.model;

public class DatasetHealth {

    private int score;
    private String status;

    private int datasetSizeScore;
    private int numericQualityScore;
    private int relationshipScore;
    private int diversityScore;
    private int completenessScore;

    public DatasetHealth(
            int score,
            String status,
            int datasetSizeScore,
            int numericQualityScore,
            int relationshipScore,
            int diversityScore,
            int completenessScore
    ) {

        this.score = score;
        this.status = status;

        this.datasetSizeScore =
                datasetSizeScore;

        this.numericQualityScore =
                numericQualityScore;

        this.relationshipScore =
                relationshipScore;

        this.diversityScore =
                diversityScore;

        this.completenessScore =
                completenessScore;
    }

    public int getScore() {
        return score;
    }

    public String getStatus() {
        return status;
    }

    public int getDatasetSizeScore() {
        return datasetSizeScore;
    }

    public int getNumericQualityScore() {
        return numericQualityScore;
    }

    public int getRelationshipScore() {
        return relationshipScore;
    }

    public int getDiversityScore() {
        return diversityScore;
    }

    public int getCompletenessScore() {
        return completenessScore;
    }
}