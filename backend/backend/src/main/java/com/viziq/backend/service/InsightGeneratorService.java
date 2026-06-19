package com.viziq.backend.service;

import com.viziq.backend.model.CorrelationResult;
import com.viziq.backend.model.Insight;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class InsightGeneratorService {

    public List<Insight> generateInsights(

            int healthScore,

            int missingValues,

            int outlierCount,

            List<CorrelationResult> correlations

    ) {

        List<Insight> insights =
                new ArrayList<>();


        if (healthScore >= 90) {

            insights.add(
                    new Insight(
                            "Dataset quality is excellent (" +
                                    healthScore +
                                    "/100)"
                    )
            );

        } else if (healthScore >= 75) {

            insights.add(
                    new Insight(
                            "Dataset quality is good (" +
                                    healthScore +
                                    "/100)"
                    )
            );

        } else {

            insights.add(
                    new Insight(
                            "Dataset quality needs improvement (" +
                                    healthScore +
                                    "/100)"
                    )
            );

        }


        if (missingValues == 0) {

            insights.add(
                    new Insight(
                            "No missing values were detected."
                    )
            );

        } else {

            insights.add(
                    new Insight(
                            missingValues +
                                    " missing values detected."
                    )
            );

        }


        if (outlierCount == 0) {

            insights.add(
                    new Insight(
                            "No significant outliers detected."
                    )
            );

        } else {

            insights.add(
                    new Insight(
                            outlierCount +
                                    " outliers detected in the dataset."
                    )
            );

        }


        if (!correlations.isEmpty()) {

            CorrelationResult top =
                    correlations.get(0);

            insights.add(
                    new Insight(
                            "Strong relationship found between "
                                    + top.getColumn1()
                                    + " and "
                                    + top.getColumn2()
                                    + " ("
                                    + String.format(
                                    "%.2f",
                                    top.getCorrelation()
                            )
                                    + ")"
                    )
            );

        }

        return insights;
    }
}