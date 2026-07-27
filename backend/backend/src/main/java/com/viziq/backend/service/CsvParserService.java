package com.viziq.backend.service;

import org.springframework.stereotype.Service;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileReader;
import java.util.ArrayList;
import java.util.List;

@Service
public class CsvParserService {

    public List<String[]> readCsv(String path) throws Exception {
        List<String[]> rows = new ArrayList<>();
        if (path == null || path.trim().isEmpty()) {
            return rows;
        }
        File file = new File(path);
        if (!file.exists()) {
            return rows;
        }

        try (BufferedReader br = new BufferedReader(new FileReader(file))) {
            String line;
            while ((line = br.readLine()) != null) {
                String[] values = line.split(",");
                rows.add(values);
            }
        }

        return rows;
    }
}