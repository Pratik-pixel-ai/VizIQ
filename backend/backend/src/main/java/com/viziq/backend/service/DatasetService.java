package com.viziq.backend.service;

import org.springframework.stereotype.Service;

@Service
public class DatasetService {

    private String currentDatasetPath;

    public void setCurrentDatasetPath(
            String path
    ) {
        this.currentDatasetPath = path;
    }

    public String getCurrentDatasetPath() {
        return currentDatasetPath;
    }
}