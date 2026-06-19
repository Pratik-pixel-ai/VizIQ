package com.viziq.backend.service;

import com.viziq.backend.model.Insight;
import org.springframework.stereotype.Service;
import com.viziq.backend.model.CorrelationResult;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
public class InsightService {

    public List<Insight> generateInsights(
            Map<String, String> columns,
            List<CorrelationResult> correlations
    ) {

        List<Insight> insights =
                new ArrayList<>();

        int numericCount = 0;
        int textCount = 0;

        for (String type : columns.values()) {

            if ("NUMBER".equals(type))
                numericCount++;

            if ("TEXT".equals(type))
                textCount++;

        }

        insights.add(
                new Insight(
                        "Dataset contains "
                                + columns.size()
                                + " columns"
                )
        );

        insights.add(
                new Insight(
                        "Detected "
                                + numericCount
                                + " numeric columns"
                )
        );

        insights.add(
                new Insight(
                        "Detected "
                                + textCount
                                + " categorical columns"
                )
        );

        if (numericCount >= 2) {

            insights.add(
                    new Insight(
                            "Scatter Plot is suitable for relationship analysis"
                    )
            );

        }

        if (numericCount >= 3) {

            insights.add(
                    new Insight(
                            "Bubble Chart can visualize three-dimensional data"
                    )
            );

        }
        if (!correlations.isEmpty()) {

            CorrelationResult strongest =
                    correlations.get(0);

            insights.add(
                    new Insight(
                            "Strongest relationship found: "
                                    + strongest.getColumn1()
                                    + " and "
                                    + strongest.getColumn2()
                                    + " show correlation of "
                                    + String.format(
                                    "%.2f",
                                    strongest.getCorrelation()
                            )
                    )
            );

        }

        return insights;
    }
}