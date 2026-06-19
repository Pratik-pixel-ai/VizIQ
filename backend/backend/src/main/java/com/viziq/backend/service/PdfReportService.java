package com.viziq.backend.service;

import com.lowagie.text.Document;
import com.lowagie.text.Paragraph;
import com.lowagie.text.pdf.PdfWriter;
import com.viziq.backend.model.SummaryInfo;

import org.springframework.stereotype.Service;
import com.viziq.backend.model.DatasetHealth;

import java.io.ByteArrayOutputStream;
import com.viziq.backend.model.Insight;
import java.util.List;
import com.viziq.backend.model.CorrelationResult;
import com.viziq.backend.model.ChartRecommendation;
import com.viziq.backend.model.OutlierInfo;

@Service
public class PdfReportService {

    public byte[] generatePdf(
            SummaryInfo summary,
            DatasetHealth health,
            List<Insight> insights,
            List<CorrelationResult> correlations,
            List<ChartRecommendation> charts,
            List<OutlierInfo> outliers
    )throws Exception{

        Document document =
                new Document();

        ByteArrayOutputStream output =
                new ByteArrayOutputStream();

        PdfWriter.getInstance(
                document,
                output
        );

        document.open();

        document.add(
                new Paragraph(
                        "VizIQ Dataset Report"
                )
        );

        document.add(
                new Paragraph(" ")
        );

        document.add(
                new Paragraph(
                        "Generated On: "
                                + java.time.LocalDateTime.now()
                )
        );

        document.add(
                new Paragraph(
                        "Report Type: Dataset Analysis Report"
                )
        );



        document.add(
                new Paragraph(
                        "Powered By: VizIQ Analytics Engine"
                )
        );

        document.add(
                new Paragraph(" ")
        );



        document.add(
                new Paragraph(
                        "EXECUTIVE SUMMARY"
                )
        );

        document.add(
                new Paragraph(
                        "Dataset contains "
                                + summary.getRows()
                                + " records and "
                                + summary.getColumns()
                                + " columns."
                )
        );

        document.add(
                new Paragraph(
                        "Dataset quality score is "
                                + health.getScore()
                                + "/100 ("
                                + health.getStatus()
                                + ")."
                )
        );

        document.add(
                new Paragraph(
                        "Detected "
                                + summary.getOutliers()
                                + " outliers and "
                                + summary.getMissingValues()
                                + " missing values."
                )
        );

        document.add(
                new Paragraph(" ")
        );


        document.add(
                new Paragraph("DATASET OVERVIEW")
        );

        document.add(
                new Paragraph(
                        "Rows: " +
                                summary.getRows()
                )
        );

        document.add(
                new Paragraph(
                        "Columns: " +
                                summary.getColumns()
                )
        );

        document.add(
                new Paragraph(
                        "Numeric Columns: " +
                                summary.getNumericColumns()
                )
        );

        document.add(
                new Paragraph(
                        "Categorical Columns: " +
                                summary.getCategoricalColumns()
                )
        );

        document.add(
                new Paragraph(
                        "Missing Values: " +
                                summary.getMissingValues()
                )
        );

        document.add(
                new Paragraph(
                        "Outliers: " +
                                summary.getOutliers()
                )
        );

        document.add(
                new Paragraph(" ")
        );

        document.add(
                new Paragraph(
                        "DATASET HEALTH SCORE"
                )
        );

        document.add(
                new Paragraph(
                        "Score: " +
                                health.getScore() +
                                "/100"
                )
        );

        document.add(
                new Paragraph(
                        "Status: " +
                                health.getStatus()
                )
        );

        document.add(
                new Paragraph(" ")
        );

        document.add(
                new Paragraph(
                        "HEALTH BREAKDOWN"
                )
        );

        document.add(
                new Paragraph(
                        "Dataset Size : "
                                + health.getDatasetSizeScore()
                                + "/25"
                )
        );

        document.add(
                new Paragraph(
                        "Numeric Quality : "
                                + health.getNumericQualityScore()
                                + "/20"
                )
        );

        document.add(
                new Paragraph(
                        "Relationships : "
                                + health.getRelationshipScore()
                                + "/15"
                )
        );

        document.add(
                new Paragraph(
                        "Diversity : "
                                + health.getDiversityScore()
                                + "/15"
                )
        );

        document.add(
                new Paragraph(
                        "Completeness : "
                                + health.getCompletenessScore()
                                + "/25"
                )
        );

        document.add(
                new Paragraph(" ")
        );

        document.add(
                new Paragraph(
                        "SMART INSIGHTS"
                )
        );

        for (Insight insight : insights) {

            document.add(
                    new Paragraph(
                            "• " +
                                    insight.getMessage()
                    )
            );
        }

        document.add(
                new Paragraph(" ")
        );

        document.add(
                new Paragraph(
                        "TOP RELATIONSHIPS"
                )
        );

        int limit =
                Math.min(
                        5,
                        correlations.size()
                );

        for(int i = 0; i < limit; i++) {

            CorrelationResult c =
                    correlations.get(i);

            document.add(
                    new Paragraph(
                            (i + 1)
                                    + ". "
                                    + c.getColumn1()
                                    + " vs "
                                    + c.getColumn2()
                                    + " : "
                                    + String.format(
                                    "%.2f",
                                    c.getCorrelation()
                            )
                    )
            );
        }

        document.add(
                new Paragraph(" ")
        );



        document.add(
                new Paragraph(
                        "OUTLIER SUMMARY"
                )
        );

        for (OutlierInfo outlier : outliers) {

            document.add(
                    new Paragraph(
                            outlier.getColumn()
                                    + " : "
                                    + outlier.getValue()
                    )
            );
        }

        document.add(
                new Paragraph(" ")
        );

        document.add(
                new Paragraph(
                        "RECOMMENDED CHARTS"
                )
        );

        for (int i = 0;
             i < charts.size();
             i++) {

            ChartRecommendation chart =
                    charts.get(i);

            document.add(
                    new Paragraph(
                            (i + 1)
                                    + ". "
                                    + chart.getChartType()
                                    + " ("
                                    + chart.getScore()
                                    + ")"
                    )
            );

            document.add(
                    new Paragraph(
                            "Reason: "
                                    + chart.getReason()
                    )
            );


        }

        document.add(
                new Paragraph(" ")
        );

        document.add(
                new Paragraph(
                        "FINAL ASSESSMENT"
                )
        );

        document.add(
                new Paragraph(
                        "Dataset quality score is "
                                + health.getScore()
                                + "/100."
                )
        );

        document.add(
                new Paragraph(
                        "Overall dataset status: "
                                + health.getStatus()
                )
        );

        document.add(
                new Paragraph(
                        "Detected "
                                + summary.getMissingValues()
                                + " missing values and "
                                + summary.getOutliers()
                                + " outliers."
                )
        );

        String conclusion;

        if (health.getScore() >= 90) {

            conclusion =
                    "Dataset is highly suitable for analytics, visualization and predictive modeling.";

        }
        else if (health.getScore() >= 75) {

            conclusion =
                    "Dataset is suitable for most analytical tasks with minor limitations.";

        }
        else {

            conclusion =
                    "Dataset may require cleaning before advanced analysis.";
        }

        document.add(
                new Paragraph(
                        conclusion
                )
        );



        document.close();

        return output.toByteArray();
    }
}