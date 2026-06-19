package com.viziq.backend.model;

public class ChartRecommendation {

    private String chartType;
    private int score;
    private String reason;

    public ChartRecommendation(
            String chartType,
            int score,
            String reason
    ) {
        this.chartType = chartType;
        this.score = score;
        this.reason = reason;
    }

    public String getChartType() {
        return chartType;
    }

    public void setChartType(String chartType) {
        this.chartType = chartType;
    }

    public int getScore() {
        return score;
    }

    public void setScore(int score) {
        this.score = score;
    }

    public String getReason() {
        return reason;
    }

    public void setReason(String reason) {
        this.reason = reason;
    }
}