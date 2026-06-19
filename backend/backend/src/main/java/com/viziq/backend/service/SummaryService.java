package com.viziq.backend.service;

import com.viziq.backend.model.SummaryInfo;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
public class SummaryService {

    public SummaryInfo generateSummary(

            List<String[]> rows,

            Map<String, String> columns,

            int missingValues,

            int outliers

    ) {

        int numeric = 0;
        int categorical = 0;

        for (String type : columns.values()) {

            if ("NUMBER".equals(type))
                numeric++;
            else
                categorical++;

        }

        return new SummaryInfo(

                rows.size() - 1,

                columns.size(),

                numeric,

                categorical,

                missingValues,

                outliers

        );

    }

}