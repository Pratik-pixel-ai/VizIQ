package com.viziq.backend.model;

public class DatasetHealth {

    private int score;
    private String status;

    public DatasetHealth(
            int score,
            String status
    ) {
        this.score = score;
        this.status = status;
    }

    public int getScore() {
        return score;
    }

    public String getStatus() {
        return status;
    }
}