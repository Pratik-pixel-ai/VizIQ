package com.viziq.backend.service;
import java.util.HashSet;
import java.util.Set;

import com.viziq.backend.model.OutlierInfo;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import java.util.Comparator;

@Service
public class OutlierDetectionService {

    public List<OutlierInfo> detectOutliers(
            List<String[]> rows,
            Map<String, String> columns
    ) {

        List<OutlierInfo> results =
                new ArrayList<>();
        Set<String> seen =
                new HashSet<>();

        String[] headers =
                rows.get(0);

        for (int col = 0;
             col < headers.length;
             col++) {

            String columnName =
                    headers[col];

            if (!"NUMBER".equals(
                    columns.get(columnName)
            )) {
                continue;
            }

            List<Double> values =
                    new ArrayList<>();

            for (int row = 1;
                 row < rows.size();
                 row++) {

                if (col >= rows.get(row).length)
                    continue;

                try {

                    values.add(
                            Double.parseDouble(
                                    rows.get(row)[col]
                            )
                    );

                } catch (Exception ignored) {
                }

            }

            if (values.size() < 4)
                continue;

            Collections.sort(values);

            double q1 =
                    values.get(values.size() / 4);

            double q3 =
                    values.get(
                            (values.size() * 3) / 4
                    );

            double iqr =
                    q3 - q1;

            double lowerBound =
                    q1 - (1.5 * iqr);

            double upperBound =
                    q3 + (1.5 * iqr);

            for (double value : values) {

                if (value < lowerBound ||
                        value > upperBound) {

                    double distance;

                    if (value < lowerBound) {

                        distance =
                                lowerBound - value;

                    } else {

                        distance =
                                value - upperBound;

                    }

                    String severity;

                    if (distance > iqr * 3) {

                        severity =
                                "Extreme";

                    } else if (
                            distance > iqr
                    ) {

                        severity =
                                "Strong";

                    } else {

                        severity =
                                "Moderate";

                    }
                    if ("Moderate".equals(severity))
                        continue;


                    String key =
                            columnName + "_" + value;

                    if (!seen.contains(key)) {

                        seen.add(key);

                        results.add(
                                new OutlierInfo(
                                        columnName,
                                        value,
                                        lowerBound,
                                        upperBound,
                                        severity
                                )
                        );

                    }


                }

            }

        }
        results.sort(
                (a, b) -> {

                    int scoreA =
                            "Extreme".equals(
                                    a.getSeverity()
                            )
                                    ? 3
                                    : "Strong".equals(
                                    a.getSeverity()
                            )
                                    ? 2
                                    : 1;

                    int scoreB =
                            "Extreme".equals(
                                    b.getSeverity()
                            )
                                    ? 3
                                    : "Strong".equals(
                                    b.getSeverity()
                            )
                                    ? 2
                                    : 1;

                    return Integer.compare(
                            scoreB,
                            scoreA
                    );

                }
        );

        return results
                .stream()
                .collect(
                        Collectors.groupingBy(
                                OutlierInfo::getColumn
                        )
                )
                .values()
                .stream()
                .flatMap(list ->

                        list.stream()
                                .sorted(
                                        Comparator.comparingDouble(
                                                        OutlierInfo::getValue
                                                )
                                                .reversed()
                                )
                                .limit(5)

                )
                .collect(
                        Collectors.toList()
                );
    }
}