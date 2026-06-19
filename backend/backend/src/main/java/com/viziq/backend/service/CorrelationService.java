package com.viziq.backend.service;

import com.viziq.backend.model.CorrelationResult;
import org.springframework.stereotype.Service;
import java.util.Map;

import java.util.ArrayList;
import java.util.List;

@Service
public class CorrelationService {

    public List<CorrelationResult> findCorrelations(
            List<String[]> rows,
            Map<String, String> columns
    ) {

        List<CorrelationResult> results =
                new ArrayList<>();

        String[] headers = rows.get(0);

        for (int i = 0; i < headers.length; i++) {

            for (int j = i + 1; j < headers.length; j++) {

                if (!"NUMBER".equals(columns.get(headers[i])) ||
                        !"NUMBER".equals(columns.get(headers[j]))) {

                    continue;

                }

                List<Double> x =
                        new ArrayList<>();

                List<Double> y =
                        new ArrayList<>();

                for (int r = 1; r < rows.size(); r++) {

                    try {

                        double xValue =
                                Double.parseDouble(
                                        rows.get(r)[i]
                                );

                        double yValue =
                                Double.parseDouble(
                                        rows.get(r)[j]
                                );

                        x.add(xValue);
                        y.add(yValue);

                    } catch (Exception ignored) {
                    }

                }

                if (x.size() > 2) {

                    double correlation =
                            calculateCorrelation(
                                    x,
                                    y
                            );

                    if (Math.abs(correlation) >= 0.5) {

                        results.add(
                                new CorrelationResult(
                                        headers[i],
                                        headers[j],
                                        correlation
                                )
                        );

                    }

                }

            }


        }
        results.sort(
                java.util.Comparator.comparingDouble(
                        (CorrelationResult r) ->
                                Math.abs(
                                        r.getCorrelation()
                                )
                ).reversed()
        );


        return results;

    }
    private double calculateCorrelation(
            List<Double> x,
            List<Double> y
    ) {

        int n = x.size();

        double sumX = 0;
        double sumY = 0;
        double sumXY = 0;
        double sumX2 = 0;
        double sumY2 = 0;

        for (int i = 0; i < n; i++) {

            sumX += x.get(i);
            sumY += y.get(i);

            sumXY +=
                    x.get(i) * y.get(i);

            sumX2 +=
                    x.get(i) * x.get(i);

            sumY2 +=
                    y.get(i) * y.get(i);

        }

        double numerator =
                n * sumXY -
                        sumX * sumY;

        double denominator =
                Math.sqrt(
                        (n * sumX2 - sumX * sumX)
                                *
                                (n * sumY2 - sumY * sumY)
                );

        if (denominator == 0)
            return 0;

        return numerator /
                denominator;
    }

}