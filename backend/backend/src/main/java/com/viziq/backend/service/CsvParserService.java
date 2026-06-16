package com.viziq.backend.service;

import org.springframework.stereotype.Service;

import java.io.BufferedReader;
import java.io.FileReader;
import java.util.ArrayList;
import java.util.List;

@Service
public class CsvParserService {

    public List<String[]> readCsv(String path)
            throws Exception {

        List<String[]> rows =
                new ArrayList<>();

        BufferedReader br =
                new BufferedReader(
                        new FileReader(path)
                );

        String line;

        while ((line = br.readLine()) != null) {

            String[] values =
                    line.split(",");

            rows.add(values);
        }

        br.close();

        return rows;
    }
}