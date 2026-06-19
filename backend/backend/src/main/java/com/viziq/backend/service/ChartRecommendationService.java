package com.viziq.backend.service;

import com.viziq.backend.model.ChartRecommendation;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Map;

@Service
public class ChartRecommendationService {

    public List<ChartRecommendation> recommendCharts(
            Map<String, String> columns
    ) {

        List<ChartRecommendation> charts =
                new ArrayList<>();

        int numericCount = 0;
        int textCount = 0;

        for (String type : columns.values()) {

            if ("NUMBER".equals(type))
                numericCount++;

            if ("TEXT".equals(type))
                textCount++;

        }

        if (textCount >= 1) {

            charts.add(
                    new ChartRecommendation(
                            "PIE_CHART",
                            70,
                            "Categorical columns detected"
                    )
            );

        }

        if (textCount >= 1 && numericCount >= 1) {

            charts.add(
                    new ChartRecommendation(
                            "BAR_CHART",
                            90,
                            "Categorical and numeric columns available"
                    )
            );

        }

        if (numericCount >= 1) {

            charts.add(
                    new ChartRecommendation(
                            "HISTOGRAM",
                            85,
                            "Numeric columns detected"
                    )
            );

            charts.add(
                    new ChartRecommendation(
                            "BOX_PLOT",
                            80,
                            "Useful for distribution and outlier analysis"
                    )
            );

        }

        if (numericCount >= 2) {

            charts.add(
                    new ChartRecommendation(
                            "SCATTER_PLOT",
                            95,
                            "Multiple numeric columns available"
                    )
            );

            charts.add(
                    new ChartRecommendation(
                            "HEAT_MAP",
                            88,
                            "Suitable for density visualization"
                    )
            );

            charts.add(
                    new ChartRecommendation(
                            "LINE_CHART",
                            75,
                            "Can visualize trends between numeric columns"
                    )
            );

            charts.add(
                    new ChartRecommendation(
                            "AREA_CHART",
                            72,
                            "Can visualize cumulative trends"
                    )
            );

        }

        if (numericCount >= 3) {

            charts.add(
                    new ChartRecommendation(
                            "BUBBLE_CHART",
                            92,
                            "Three or more numeric columns detected"
                    )
            );

        }

        charts.sort(
                Comparator.comparingInt(
                        ChartRecommendation::getScore
                ).reversed()
        );

        return charts;
    }
}