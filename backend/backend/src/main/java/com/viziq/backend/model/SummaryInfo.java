package com.viziq.backend.model;

public class SummaryInfo {

    private int rows;
    private int columns;
    private int numericColumns;
    private int categoricalColumns;
    private int missingValues;
    private int outliers;

    public SummaryInfo(
            int rows,
            int columns,
            int numericColumns,
            int categoricalColumns,
            int missingValues,
            int outliers
    ) {

        this.rows = rows;
        this.columns = columns;
        this.numericColumns = numericColumns;
        this.categoricalColumns = categoricalColumns;
        this.missingValues = missingValues;
        this.outliers = outliers;

    }

    public int getRows() {
        return rows;
    }

    public int getColumns() {
        return columns;
    }

    public int getNumericColumns() {
        return numericColumns;
    }

    public int getCategoricalColumns() {
        return categoricalColumns;
    }

    public int getMissingValues() {
        return missingValues;
    }

    public int getOutliers() {
        return outliers;
    }

}