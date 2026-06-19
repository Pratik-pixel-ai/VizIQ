package com.viziq.backend.model;

public class MissingValueInfo {

    private String column;
    private int missingCount;

    public MissingValueInfo(
            String column,
            int missingCount
    ) {
        this.column = column;
        this.missingCount = missingCount;
    }

    public String getColumn() {
        return column;
    }

    public int getMissingCount() {
        return missingCount;
    }
}