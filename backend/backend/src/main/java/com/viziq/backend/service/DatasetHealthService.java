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

        int datasetSizeScore = 0;
        int numericQualityScore = 0;
        int relationshipScore = 0;
        int diversityScore = 0;
        int completenessScore = 0;

        int score = 0;

        int rowCount =
                rows.size() - 1;
        if (rowCount >= 1000)
            datasetSizeScore = 25;

        else if (rowCount >= 100)
            datasetSizeScore = 20;

        else if (rowCount >= 10)
            datasetSizeScore = 10;


        int numericCount = 0;

        for (String type : columns.values()) {

            if ("NUMBER".equals(type))
                numericCount++;

        }
        if (numericCount >= 5)
            numericQualityScore = 20;

        else if (numericCount >= 2)
            numericQualityScore = 15;

        else if (numericCount >= 1)
            numericQualityScore = 10;

        if (correlationCount >= 3)
            relationshipScore = 15;

        else if (correlationCount >= 1)
            relationshipScore = 10;

        int textCount = 0;

        for (String type : columns.values()) {

            if ("TEXT".equals(type))
                textCount++;

        }

        if (numericCount > 0 &&
                textCount > 0)
            diversityScore = 15;

        int totalMissing = 0;

        String[] headers =
                rows.get(0);

        for (int col = 0;
             col < headers.length;
             col++) {

            for (int row = 1;
                 row < rows.size();
                 row++) {

                if (col >= rows.get(row).length
                        ||
                        rows.get(row)[col]
                                .trim()
                                .isEmpty()) {

                    totalMissing++;

                }

            }

        }

        if (totalMissing == 0)
            completenessScore = 25;

        else if (totalMissing <= 20)
            completenessScore = 20;

        else if (totalMissing <= 50)
            completenessScore = 15;

        else if (totalMissing <= 100)
            completenessScore = 10;

        else
            completenessScore = 5;

        score =
                datasetSizeScore
                        + numericQualityScore
                        + relationshipScore
                        + diversityScore
                        + completenessScore;

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
                status,
                datasetSizeScore,
                numericQualityScore,
                relationshipScore,
                diversityScore,
                completenessScore
        );
    }
}