package com.viziq.backend.service;

import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class StatsService {

    public Map<String, Map<String, Double>> calculateStats(
            List<String[]> rows
    ) {

        Map<String, Map<String, Double>> result =
                new HashMap<>();

        String[] headers = rows.get(0);

        for (int col = 0; col < headers.length; col++) {

            boolean numeric = true;

            for (int row = 1; row < rows.size(); row++) {

                try {
                    Double.parseDouble(rows.get(row)[col]);
                } catch (Exception e) {
                    numeric = false;
                    break;
                }
            }

            if (!numeric)
                continue;

            double min = Double.MAX_VALUE;
            double max = Double.MIN_VALUE;
            double sum = 0;

            for (int row = 1; row < rows.size(); row++) {

                double value =
                        Double.parseDouble(rows.get(row)[col]);

                min = Math.min(min, value);
                max = Math.max(max, value);
                sum += value;
            }

            double avg =
                    sum / (rows.size() - 1);

            Map<String, Double> stats =
                    new HashMap<>();

            stats.put("min", min);
            stats.put("max", max);
            stats.put("avg", avg);

            result.put(headers[col], stats);
        }

        return result;
    }
}