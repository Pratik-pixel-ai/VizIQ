package com.viziq.backend.service;

import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
public class ChartRecommendationService {

    public List<String> recommendCharts(
            Map<String,String> columns
    ) {

        List<String> charts =
                new ArrayList<>();

        int numericCount = 0;
        int textCount = 0;

        for(String type : columns.values()) {

            if(type.equals("NUMBER"))
                numericCount++;

            if(type.equals("TEXT"))
                textCount++;
        }

        if(textCount >= 1)
            charts.add("PIE_CHART");

        if(textCount >= 1 && numericCount >= 1)
            charts.add("BAR_CHART");

        if(numericCount >= 1)
            charts.add("HISTOGRAM");

        if(numericCount >= 2)
            charts.add("SCATTER_PLOT");

        return charts;
    }
}