package com.viziq.backend.service;

import com.viziq.backend.model.MissingValueInfo;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class MissingValueService {

    public List<MissingValueInfo> findMissingValues(
            List<String[]> rows
    ) {

        List<MissingValueInfo> results =
                new ArrayList<>();

        String[] headers =
                rows.get(0);

        for (int col = 0;
             col < headers.length;
             col++) {

            int missingCount = 0;

            for (int row = 1;
                 row < rows.size();
                 row++) {

                if (col >= rows.get(row).length
                        ||
                        rows.get(row)[col]
                                .trim()
                                .isEmpty()) {

                    missingCount++;

                }

            }

            if (missingCount > 0) {

                results.add(
                        new MissingValueInfo(
                                headers[col],
                                missingCount
                        )
                );

            }


        }

        return results;
    }
}