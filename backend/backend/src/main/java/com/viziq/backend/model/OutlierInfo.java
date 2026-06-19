package com.viziq.backend.model;

public class OutlierInfo {

    private String column;
    private double value;

    private double lowerBound;
    private double upperBound;

    private String severity;

    public OutlierInfo(
            String column,
            double value,
            double lowerBound,
            double upperBound,
            String severity
    ) {

        this.column = column;
        this.value = value;

        this.lowerBound = lowerBound;
        this.upperBound = upperBound;

        this.severity = severity;
    }

    public String getColumn() {
        return column;
    }

    public double getValue() {
        return value;
    }

    public double getLowerBound() {
        return lowerBound;
    }

    public double getUpperBound() {
        return upperBound;
    }

    public String getSeverity() {
        return severity;
    }
}