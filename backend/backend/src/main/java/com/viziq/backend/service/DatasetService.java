package com.viziq.backend.service;

import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@Service
public class DatasetService {

    private String currentDatasetPath;
    private String filename;
    private LocalDateTime uploadedAt;
    private long fileSize;

    public void setCurrentDatasetPath(String path) {
        this.currentDatasetPath = path;
    }

    public String getCurrentDatasetPath() {
        return currentDatasetPath;
    }

    public void setMetadata(String filename, long fileSize) {
        this.filename = filename;
        this.uploadedAt = LocalDateTime.now();
        this.fileSize = fileSize;
    }

    public String getFilename() {
        return filename != null ? filename : "dataset.csv";
    }

    public String getUploadedAt() {
        if (uploadedAt == null) return "—";
        return uploadedAt.format(DateTimeFormatter.ofPattern("dd MMM yyyy"));
    }

    public long getFileSize() {
        return fileSize;
    }

    public String getFileSizeFormatted() {
        if (fileSize < 1024) return fileSize + " B";
        if (fileSize < 1024 * 1024) return String.format("%.1f KB", fileSize / 1024.0);
        return String.format("%.1f MB", fileSize / (1024.0 * 1024));
    }
}
