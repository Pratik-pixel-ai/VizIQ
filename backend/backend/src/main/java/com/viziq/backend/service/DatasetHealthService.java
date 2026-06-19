package com.viziq.backend.service;

import com.viziq.backend.model.DatasetHealth;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
public class DatasetHealthService {

    public DatasetHealth calculateHealth(
            List<String[]> rows,
            Map<String, String> columns,
            int correlationCount
    ) {

        int score = 100;

        int rowCount =
                rows.size() - 1;

        if (rowCount < 10)
            score -= 20;

        int numericCount = 0;

        for (String type : columns.values()) {

            if ("NUMBER".equals(type))
                numericCount++;

        }

        if (numericCount == 0)
            score -= 30;

        if (correlationCount == 0)
            score -= 10;

        String status;

        if (score >= 90)
            status = "Excellent";

        else if (score >= 75)
            status = "Good";

        else if (score >= 50)
            status = "Fair";

        else
            status = "Poor";

        return new DatasetHealth(
                score,
                status
        );
    }
}