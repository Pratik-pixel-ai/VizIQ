package com.viziq.backend.model;

public class CorrelationResult {

    private String column1;
    private String column2;
    private double correlation;

    public CorrelationResult(
            String column1,
            String column2,
            double correlation
    ) {
        this.column1 = column1;
        this.column2 = column2;
        this.correlation = correlation;
    }

    public String getColumn1() {
        return column1;
    }

    public String getColumn2() {
        return column2;
    }

    public double getCorrelation() {
        return correlation;
    }
}