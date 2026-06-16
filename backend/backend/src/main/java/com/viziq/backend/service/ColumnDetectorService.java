package com.viziq.backend.service;

import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class ColumnDetectorService {

    public Map<String,String> detectColumns(
            List<String[]> rows
    ) {

        Map<String,String> result =
                new HashMap<>();

        if(rows.isEmpty()) {
            return result;
        }

        String[] headers = rows.get(0);

        String[] sampleRow = rows.get(1);

        for(int i=0;i<headers.length;i++) {

            String value = sampleRow[i];

            if(value.matches("\\d+")) {

                result.put(
                        headers[i],
                        "NUMBER"
                );

            } else {

                result.put(
                        headers[i],
                        "TEXT"
                );
            }
        }

        return result;
    }
}