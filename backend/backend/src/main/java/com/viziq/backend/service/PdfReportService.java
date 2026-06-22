package com.viziq.backend.service;

import com.lowagie.text.*;
import com.lowagie.text.pdf.*;
import com.viziq.backend.model.*;

import org.springframework.stereotype.Service;

import java.awt.Color;
import java.io.ByteArrayOutputStream;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Map;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Comparator;
import java.util.stream.Collectors;
import java.util.LinkedHashMap;
import java.util.LinkedHashSet;
import java.util.Set;
import java.util.Collections;


@Service
public class PdfReportService {

    // ── Colour palette ──────────────────────────────────────────────
    private static final Color COL_PRIMARY    = new Color(108, 92, 231);   // violet
    private static final Color COL_TEAL       = new Color(0, 194, 168);
    private static final Color COL_WARN       = new Color(255, 138, 61);
    private static final Color COL_DANGER     = new Color(239, 71, 104);
    private static final Color COL_SUCCESS    = new Color(0, 200, 140);
    private static final Color COL_HIGH       = new Color(255, 90, 78);
    private static final Color COL_PAGE_BG    = new Color(247, 248, 255);
    private static final Color COL_CARD_BG    = new Color(255, 255, 255);
    private static final Color COL_HEADER_BG  = new Color(240, 238, 255);
    private static final Color COL_BORDER     = new Color(226, 228, 245);
    private static final Color COL_TEXT       = new Color(24, 27, 52);
    private static final Color COL_MUTED      = new Color(91, 95, 122);
    private static final Color COL_LABEL      = new Color(141, 144, 168);

    // ── Fonts ────────────────────────────────────────────────────────
    private BaseFont bf;
    private BaseFont bfBold;
    private Font fTitle;
    private Font fHeading;
    private Font fSubheading;
    private Font fBody;
    private Font fBodyBold;
    private Font fSmall;
    private Font fSmallBold;
    private Font fLabel;
    private Font fMono;

    private void initFonts() throws Exception {
        bf     = BaseFont.createFont(BaseFont.HELVETICA,        BaseFont.CP1252, false);
        bfBold = BaseFont.createFont(BaseFont.HELVETICA_BOLD,   BaseFont.CP1252, false);
        fTitle      = new Font(bfBold, 28, Font.BOLD,   Color.WHITE);
        fHeading    = new Font(bfBold, 15, Font.BOLD,   COL_PRIMARY);
        fSubheading = new Font(bfBold, 12, Font.BOLD,   COL_TEXT);
        fBody       = new Font(bf,     10, Font.NORMAL, COL_TEXT);
        fBodyBold   = new Font(bfBold, 10, Font.BOLD,   COL_TEXT);
        fSmall      = new Font(bf,      9, Font.NORMAL, COL_MUTED);
        fSmallBold  = new Font(bfBold,  9, Font.BOLD,   COL_TEXT);
        fLabel      = new Font(bf,      8, Font.NORMAL, COL_LABEL);
        fMono       = new Font(bf,      9, Font.NORMAL, COL_TEXT);
    }

    // ── Helpers ──────────────────────────────────────────────────────

    private void addSpacer(Document doc, float height) throws Exception {
        Paragraph spacer = new Paragraph(" ");
        spacer.setSpacingBefore(height / 2f);
        spacer.setSpacingAfter(height / 2f);
        doc.add(spacer);
    }

    private void addSectionHeader(Document doc, String title, String subtitle) throws Exception {
        PdfPTable t = new PdfPTable(1);
        t.setWidthPercentage(100);
        t.setSpacingBefore(12);
        t.setSpacingAfter(10);

        PdfPCell c = new PdfPCell();
        c.setBorder(Rectangle.LEFT);
        c.setBorderColorLeft(COL_PRIMARY);
        c.setBorderWidthLeft(3f);
        c.setBackgroundColor(COL_HEADER_BG);
        c.setPadding(10);

        c.addElement(new Phrase(title, fHeading));
        if (subtitle != null) {
            Paragraph sub = new Paragraph(subtitle, fSmall);
            sub.setSpacingBefore(2);
            c.addElement(sub);
        }
        t.addCell(c);
        doc.add(t);
    }

    private PdfPTable makeTable(int cols) {
        PdfPTable t = new PdfPTable(cols);
        t.setWidthPercentage(100);
        t.setSpacingBefore(6);
        t.setSpacingAfter(6);
        return t;
    }

    private PdfPCell headerCell(String text) {
        PdfPCell c = new PdfPCell(new Phrase(text, fSmallBold));
        c.setBackgroundColor(COL_HEADER_BG);
        c.setBorderColor(COL_BORDER);
        c.setPadding(7);
        c.setHorizontalAlignment(Element.ALIGN_LEFT);
        return c;
    }

    private PdfPCell dataCell(String text) {
        PdfPCell c = new PdfPCell(new Phrase(text, fMono));
        c.setBorderColor(COL_BORDER);
        c.setPadding(7);
        c.setHorizontalAlignment(Element.ALIGN_LEFT);
        return c;
    }

    private PdfPCell dataCell(String text, Color bg) {
        PdfPCell c = dataCell(text);
        c.setBackgroundColor(bg);
        return c;
    }

    private PdfPCell badgeCell(String label, Color bg, Color fg) {
        Font f = new Font(bfBold, 8, Font.BOLD, fg);
        PdfPCell c = new PdfPCell(new Phrase(label, f));
        c.setBackgroundColor(bg);
        c.setBorderColor(COL_BORDER);
        c.setPadding(5);
        c.setHorizontalAlignment(Element.ALIGN_CENTER);
        return c;
    }

    private Color severityColor(String sev) {
        if ("Extreme".equals(sev)) return COL_DANGER;
        if ("Strong".equals(sev))  return COL_HIGH;
        return COL_WARN;
    }

    private Color severityBg(String sev) {
        if ("Extreme".equals(sev)) return new Color(253, 234, 239);
        if ("Strong".equals(sev))  return new Color(255, 240, 235);
        return new Color(255, 248, 235);
    }

    private Color correlationColor(double v) {
        double abs = Math.abs(v);
        if (abs >= 0.7) return new Color(220, 250, 240);
        if (abs >= 0.5) return new Color(255, 248, 230);
        return new Color(255, 238, 242);
    }

    private Color heatColor(double v) {
        // v in [-1, 1]. Purple = high positive, white = zero, coral = negative
        if (v > 0) {
            int r = (int)(240 - v * 100);
            int g = (int)(235 - v * 100);
            int b = 255;
            return new Color(Math.max(0, r), Math.max(0, g), Math.min(255, b));
        } else {
            double neg = Math.abs(v);
            int r = 255;
            int g = (int)(235 - neg * 120);
            int b = (int)(235 - neg * 120);
            return new Color(Math.min(255, r), Math.max(100, g), Math.max(100, b));
        }
    }

    private String strengthLabel(double v) {
        double abs = Math.abs(v);
        if (abs >= 0.7) return v > 0 ? "Strong Positive" : "Strong Negative";
        if (abs >= 0.5) return v > 0 ? "Moderate Positive" : "Moderate Negative";
        return v > 0 ? "Weak Positive" : "Weak Negative";
    }

    private String formatChartName(String raw) {
        return raw.replace("_", " ").toLowerCase()
                .chars()
                .collect(StringBuilder::new,
                    (sb, c) -> {
                        if (sb.length() == 0 || sb.charAt(sb.length() - 1) == ' ')
                            sb.append(Character.toUpperCase((char) c));
                        else sb.append((char) c);
                    }, StringBuilder::append)
                .toString();
    }

    // ── Header / footer event ─────────────────────────────────────────
    static class FooterEvent extends PdfPageEventHelper {
        private BaseFont bf;
        FooterEvent(BaseFont bf) { this.bf = bf; }
        @Override
        public void onEndPage(PdfWriter writer, Document doc) {
            PdfContentByte cb = writer.getDirectContent();
            cb.saveState();
            cb.setColorStroke(new Color(226, 228, 245));
            cb.setLineWidth(0.5f);
            cb.moveTo(doc.leftMargin(), doc.bottomMargin() - 8);
            cb.lineTo(doc.right(), doc.bottomMargin() - 8);
            cb.stroke();

            cb.beginText();
            cb.setFontAndSize(bf, 8);
            cb.setColorFill(new Color(141, 144, 168));
            cb.showTextAligned(Element.ALIGN_LEFT,
                    "VizIQ Analytics Platform",
                    doc.leftMargin(), doc.bottomMargin() - 20, 0);
            cb.showTextAligned(Element.ALIGN_RIGHT,
                    "Page " + writer.getPageNumber(),
                    doc.right(), doc.bottomMargin() - 20, 0);
            cb.endText();
            cb.restoreState();
        }
    }

    // ── Main generator ───────────────────────────────────────────────
    public byte[] generatePdf(
            SummaryInfo summary,
            DatasetHealth health,
            List<Insight> insights,
            List<CorrelationResult> correlations,
            List<ChartRecommendation> charts,
            List<OutlierInfo> outliers,
            List<MissingValueInfo> missingValueList,
            Map<String, String> columns,
            String filename,
            String uploadedAt,
            String fileSize,
            byte[] chartImageBytes
    ) throws Exception {

        initFonts();

        Document doc = new Document(PageSize.A4, 42, 42, 55, 55);
        ByteArrayOutputStream out = new ByteArrayOutputStream();
        PdfWriter writer = PdfWriter.getInstance(doc, out);
        writer.setPageEvent(new FooterEvent(bf));
        doc.open();

        // ═══════════════════════════════════════════════════
        // PAGE 1 — COVER
        // ═══════════════════════════════════════════════════
        drawCoverPage(doc, writer, summary, health, filename, uploadedAt, fileSize);
        doc.newPage();

        // ═══════════════════════════════════════════════════
        // PAGE 2 — DATASET OVERVIEW
        // ═══════════════════════════════════════════════════
        drawOverviewPage(doc, summary, columns);
        doc.newPage();

        // ═══════════════════════════════════════════════════
        // PAGE 3 — DATA QUALITY
        // ═══════════════════════════════════════════════════
        drawQualityPage(doc, missingValueList, outliers, summary.getRows());
        doc.newPage();

        // ═══════════════════════════════════════════════════
        // PAGE 4 — RELATIONSHIPS
        // ═══════════════════════════════════════════════════
        drawRelationshipsPage(doc, correlations);
        doc.newPage();

        // ═══════════════════════════════════════════════════
        // PAGE 5 — SMART INSIGHTS
        // ═══════════════════════════════════════════════════
        drawInsightsPage(doc, insights);
        doc.newPage();

        // ═══════════════════════════════════════════════════
        // PAGE 6 — RECOMMENDED CHARTS
        // ═══════════════════════════════════════════════════
        drawChartsPage(doc, charts);

        // ═══════════════════════════════════════════════════
        // PAGE 7 — CHART VISUALIZATION (only if image provided)
        // ═══════════════════════════════════════════════════
        if (chartImageBytes != null && chartImageBytes.length > 0) {
            doc.newPage();
            drawChartPage(doc, chartImageBytes, charts);
        }

        doc.close();
        return out.toByteArray();
    }

    // ── PAGE 1: Cover (ROUND SCORE BADGE FIX) ────────────────────────
    private void drawCoverPage(Document doc, PdfWriter writer,
                               SummaryInfo summary, DatasetHealth health,
                               String filename, String uploadedAt, String fileSize) throws Exception {

        PdfContentByte cb = writer.getDirectContent();
        float pageW = doc.getPageSize().getWidth();
        float pageH = doc.getPageSize().getHeight();
        float marginL = doc.leftMargin();

        // Hero banner background
        cb.saveState();
        cb.setColorFill(COL_PRIMARY);
        cb.rectangle(0, pageH - 185, pageW, 185);
        cb.fill();

        // Subtle accent strip
        cb.setColorFill(new Color(139, 92, 246));
        cb.rectangle(0, pageH - 188, pageW, 4);
        cb.fill();
        cb.restoreState();

        // ── Banner text ──
        ColumnText ct = new ColumnText(cb);
        ct.setSimpleColumn(marginL, pageH - 175, pageW - marginL, pageH - 10);

        Font fBrandSmall = new Font(bf, 10, Font.NORMAL, new Color(200, 195, 255));
        ct.addElement(new Paragraph("VIZIQ ANALYTICS PLATFORM", fBrandSmall));

        Font fBigTitle = new Font(bfBold, 26, Font.BOLD, Color.WHITE);
        Paragraph titleP = new Paragraph("Dataset Analytics Report", fBigTitle);
        titleP.setSpacingBefore(6);
        ct.addElement(titleP);

        Font fSubtitle = new Font(bf, 12, Font.NORMAL, new Color(210, 205, 255));
        Paragraph subP = new Paragraph("Automated Intelligence Report · " + LocalDate.now()
                .format(DateTimeFormatter.ofPattern("dd MMMM yyyy")), fSubtitle);
        subP.setSpacingBefore(6);
        ct.addElement(subP);
        ct.go();

        // Advance past hero banner safely
        addSpacer(doc, 140);

        // ── Metadata Grid ──
        PdfPTable metaTable = new PdfPTable(5);
        metaTable.setWidthPercentage(100);
        metaTable.setSpacingAfter(25);

        String[][] metaData = {
                {"Dataset", filename},
                {"Uploaded", uploadedAt},
                {"Rows", String.format("%,d", summary.getRows())},
                {"Columns", String.valueOf(summary.getColumns())},
                {"Size", fileSize}
        };

        Font fMetaLabel = new Font(bf, 8, Font.NORMAL, COL_LABEL);
        Font fMetaValue = new Font(bfBold, 10, Font.BOLD, COL_TEXT);

        for (String[] entry : metaData) {
            PdfPCell lc = new PdfPCell();
            lc.setBorder(Rectangle.BOX);
            lc.setBorderColor(COL_BORDER);
            lc.setBackgroundColor(COL_CARD_BG);
            lc.setPadding(10);
            lc.setMinimumHeight(60);

            Paragraph label = new Paragraph(entry[0].toUpperCase(), fMetaLabel);
            Paragraph val = new Paragraph(entry[1], fMetaValue);
            val.setSpacingBefore(4);

            lc.addElement(label);
            lc.addElement(val);
            metaTable.addCell(lc);
        }
        doc.add(metaTable);

        // ── Health Score Block ──
        Color scoreColor = scoreColor(health.getScore());
        Color scoreBg   = scoreBg(health.getScore());

        PdfPTable mainCard = new PdfPTable(2);
        mainCard.setWidthPercentage(100);
        mainCard.setWidths(new float[]{32, 68});
        mainCard.setSpacingBefore(10);

        // Left wrapper cell
        PdfPCell cardCellLeft = new PdfPCell();
        cardCellLeft.setBorder(Rectangle.TOP | Rectangle.BOTTOM | Rectangle.LEFT);
        cardCellLeft.setBorderColor(COL_BORDER);
        cardCellLeft.setBackgroundColor(COL_CARD_BG);
        cardCellLeft.setPaddingTop(15);
        cardCellLeft.setPaddingBottom(15);
        cardCellLeft.setHorizontalAlignment(Element.ALIGN_CENTER);

        // Nested layout table to square up the circle space perfectly
        PdfPTable layoutTable = new PdfPTable(1);
        layoutTable.setTotalWidth(90f);
        layoutTable.setLockedWidth(true);

        PdfPCell circleCell = new PdfPCell();
        circleCell.setCellEvent(new CircleBackgroundEvent(
                scoreBg, scoreColor, health.getScore(), bfBold, bf));
        circleCell.setBorder(Rectangle.NO_BORDER);
        circleCell.setFixedHeight(90f);
        circleCell.setPadding(0);
        layoutTable.addCell(circleCell);
        cardCellLeft.addElement(layoutTable);

        // Status pill badge setup
        PdfPTable pillTable = new PdfPTable(1);
        pillTable.setTotalWidth(85f);
        pillTable.setLockedWidth(true);
        pillTable.setSpacingBefore(12);

        PdfPCell pillCell = new PdfPCell(new Phrase(health.getStatus().toUpperCase(), new Font(bfBold, 8, Font.BOLD, Color.WHITE)));
        pillCell.setBackgroundColor(scoreColor);
        pillCell.setBorder(Rectangle.NO_BORDER);
        pillCell.setPadding(3);
        pillCell.setHorizontalAlignment(Element.ALIGN_CENTER);
        pillTable.addCell(pillCell);
        cardCellLeft.addElement(pillTable);

        // Right side: Executive Summary Text
        PdfPCell cardCellRight = new PdfPCell();
        cardCellRight.setBorder(Rectangle.TOP | Rectangle.BOTTOM | Rectangle.RIGHT);
        cardCellRight.setBorderColor(COL_BORDER);
        cardCellRight.setBackgroundColor(COL_CARD_BG);
        cardCellRight.setPadding(18);

        Font fExecHead = new Font(bfBold, 13, Font.BOLD, COL_TEXT);
        Paragraph execTitle = new Paragraph("Executive Summary", fExecHead);
        cardCellRight.addElement(execTitle);

        String execText = "Dataset contains "
                + String.format("%,d", summary.getRows())
                + " rows and "
                + summary.getColumns()
                + " columns. The calculated dataset overall health score is evaluated at "
                + health.getScore()
                + "/100.";

        Font fExec = new Font(bf, 10, Font.NORMAL, COL_MUTED);
        Paragraph ep = new Paragraph(execText, fExec);
        ep.setSpacingBefore(8);
        ep.setLeading(15);
        cardCellRight.addElement(ep);

        mainCard.addCell(cardCellLeft);
        mainCard.addCell(cardCellRight);
        doc.add(mainCard);
    }
    private String buildExecutiveSummary(SummaryInfo summary, DatasetHealth health,
            List<CorrelationResult> correlations, List<OutlierInfo> outliers,
            List<MissingValueInfo> missingValueList) {

        StringBuilder sb = new StringBuilder();
        sb.append("Dataset contains ").append(String.format("%,d", summary.getRows()))
          .append(" records and ").append(summary.getColumns()).append(" columns. ");

        if (health.getScore() >= 90)
            sb.append("Data quality is excellent and suitable for advanced analytics. ");
        else if (health.getScore() >= 75)
            sb.append("Data quality is good with minor limitations. ");
        else
            sb.append("Data quality needs improvement before advanced analysis. ");

        if (missingValueList.isEmpty())
            sb.append("No missing values detected. ");
        else
            sb.append(summary.getMissingValues()).append(" missing values found across ")
              .append(missingValueList.size()).append(" column(s). ");

        Map<String, Long> outliersBySeverity = outliers.stream()
                .collect(Collectors.groupingBy(OutlierInfo::getSeverity, Collectors.counting()));
        if (outliersBySeverity.containsKey("Extreme"))
            sb.append(outliersBySeverity.get("Extreme")).append(" extreme outlier(s) detected. ");

        if (!correlations.isEmpty()) {
            CorrelationResult top = correlations.get(0);
            sb.append("Strongest relationship: ").append(top.getColumn1())
              .append(" ↔ ").append(top.getColumn2())
              .append(" (").append(String.format("%.2f", top.getCorrelation())).append(").");
        }
        return sb.toString();
    }

    private Color scoreColor(int score) {
        if (score >= 90) return COL_TEAL;
        if (score >= 75) return COL_PRIMARY;
        if (score >= 60) return COL_WARN;
        return COL_DANGER;
    }

    private Color scoreBg(int score) {
        if (score >= 90) return new Color(220, 252, 245);
        if (score >= 75) return new Color(240, 238, 255);
        if (score >= 60) return new Color(255, 248, 232);
        return new Color(253, 234, 239);
    }

    // ── PAGE 2: Dataset Overview ─────────────────────────────────────
    private void drawOverviewPage(Document doc, SummaryInfo summary,
            Map<String, String> columns) throws Exception {

        addSectionHeader(doc, "Dataset Overview", "Complete structural summary of the uploaded dataset");

        PdfPTable t = makeTable(2);
        t.setWidths(new float[]{45, 55});

        String[][] rows2 = {
            {"Total Rows",              String.format("%,d", summary.getRows())},
            {"Total Columns",           String.valueOf(summary.getColumns())},
            {"Numeric Columns",         String.valueOf(summary.getNumericColumns())},
            {"Categorical Columns",     String.valueOf(summary.getCategoricalColumns())},
            {"Missing Values",          String.valueOf(summary.getMissingValues())},
            {"Outliers Detected",       String.valueOf(summary.getOutliers())},
        };

        t.addCell(headerCell("Metric"));
        t.addCell(headerCell("Value"));

        boolean alt = false;
        for (String[] row : rows2) {
            Color bg = alt ? new Color(250, 250, 255) : COL_CARD_BG;
            t.addCell(dataCell(row[0], bg));
            PdfPCell vc = dataCell(row[1], bg);
            vc.setHorizontalAlignment(Element.ALIGN_RIGHT);
            t.addCell(vc);
            alt = !alt;
        }
        doc.add(t);

        addSpacer(doc, 16);
        addSectionHeader(doc, "Detected Columns", "Column names and their detected data types");

        PdfPTable ct = makeTable(3);
        ct.setWidths(new float[]{40, 30, 30});
        ct.addCell(headerCell("#"));
        ct.addCell(headerCell("Column Name"));
        ct.addCell(headerCell("Type"));

        int i = 1;
        alt = false;
        for (Map.Entry<String, String> e : columns.entrySet()) {
            Color bg = alt ? new Color(250, 250, 255) : COL_CARD_BG;
            PdfPCell nc = dataCell(String.valueOf(i++), bg);
            nc.setHorizontalAlignment(Element.ALIGN_CENTER);
            ct.addCell(nc);
            ct.addCell(dataCell(e.getKey(), bg));
            String typeLabel = "NUMBER".equals(e.getValue()) ? "Numeric" : "Categorical";
            Color typeColor = "NUMBER".equals(e.getValue()) ? new Color(240, 238, 255) : new Color(220, 252, 245);
            Color typeFg   = "NUMBER".equals(e.getValue()) ? COL_PRIMARY : COL_TEAL;
            ct.addCell(badgeCell(typeLabel, typeColor, typeFg));
            alt = !alt;
        }
        doc.add(ct);
    }

    // ── PAGE 3: Data Quality ─────────────────────────────────────────
    private void drawQualityPage(Document doc, List<MissingValueInfo> missingValues,
            List<OutlierInfo> outliers, int totalRows) throws Exception {

        addSectionHeader(doc, "Data Quality — Missing Values",
                missingValues.isEmpty() ? "No missing values detected in any column."
                        : missingValues.size() + " column(s) contain missing values.");

        if (missingValues.isEmpty()) {
            PdfPTable t = makeTable(1);
            PdfPCell c = new PdfPCell(new Phrase("✓  All columns are complete. No missing values detected.", fBody));
            c.setBackgroundColor(new Color(220, 252, 245));
            c.setBorderColor(COL_TEAL);
            c.setPadding(10);
            t.addCell(c);
            doc.add(t);
        } else {
            PdfPTable t = makeTable(4);
            t.setWidths(new float[]{35, 20, 25, 20});
            t.addCell(headerCell("Column"));
            t.addCell(headerCell("Missing Count"));
            t.addCell(headerCell("% of Rows"));
            t.addCell(headerCell("Severity"));

            boolean alt = false;
            for (MissingValueInfo mv : missingValues) {
                double pct = totalRows > 0 ? (mv.getMissingCount() * 100.0 / totalRows) : 0;
                String sev  = pct >= 30 ? "Extreme" : pct >= 15 ? "High" : pct >= 5 ? "Medium" : "Low";
                Color bg = alt ? new Color(250, 250, 255) : COL_CARD_BG;
                t.addCell(dataCell(mv.getColumn(), bg));
                PdfPCell mc = dataCell(String.valueOf(mv.getMissingCount()), bg);
                mc.setHorizontalAlignment(Element.ALIGN_CENTER);
                t.addCell(mc);
                PdfPCell pc = dataCell(String.format("%.1f%%", pct), bg);
                pc.setHorizontalAlignment(Element.ALIGN_CENTER);
                t.addCell(pc);
                Color sc = "Extreme".equals(sev) ? COL_DANGER : "High".equals(sev) ? COL_HIGH
                        : "Medium".equals(sev) ? COL_WARN : COL_SUCCESS;
                Color sb2 = "Extreme".equals(sev) ? new Color(253,234,239) : "High".equals(sev) ? new Color(255,240,235)
                        : "Medium".equals(sev) ? new Color(255,248,235) : new Color(220,252,245);
                t.addCell(badgeCell(sev, sb2, sc));
                alt = !alt;
            }
            doc.add(t);
        }

        addSpacer(doc, 16);

        // Group outliers by column
        Map<String, List<OutlierInfo>> grouped = new LinkedHashMap<>();
        for (OutlierInfo o : outliers) {
            grouped.computeIfAbsent(o.getColumn(), k -> new ArrayList<>()).add(o);
        }

        addSectionHeader(doc, "Data Quality — Outliers",
                grouped.isEmpty() ? "No significant outliers detected."
                        : grouped.size() + " column(s) contain outliers.");

        if (grouped.isEmpty()) {
            PdfPTable t = makeTable(1);
            PdfPCell c = new PdfPCell(new Phrase("✓  No significant outliers detected in any column.", fBody));
            c.setBackgroundColor(new Color(220, 252, 245));
            c.setBorderColor(COL_TEAL);
            c.setPadding(10);
            t.addCell(c);
            doc.add(t);
        } else {
            PdfPTable t = makeTable(4);
            t.setWidths(new float[]{28, 22, 28, 22});
            t.addCell(headerCell("Column"));
            t.addCell(headerCell("Count"));
            t.addCell(headerCell("Expected Range"));
            t.addCell(headerCell("Severity"));

            boolean alt = false;
            for (Map.Entry<String, List<OutlierInfo>> e : grouped.entrySet()) {
                OutlierInfo first = e.getValue().get(0);
                String range = String.format("%.2f → %.2f", first.getLowerBound(), first.getUpperBound());
                Color bg = alt ? new Color(250, 250, 255) : COL_CARD_BG;
                t.addCell(dataCell(e.getKey(), bg));
                PdfPCell cc = dataCell(String.valueOf(e.getValue().size()), bg);
                cc.setHorizontalAlignment(Element.ALIGN_CENTER);
                t.addCell(cc);
                t.addCell(dataCell(range, bg));
                t.addCell(badgeCell(first.getSeverity(), severityBg(first.getSeverity()), severityColor(first.getSeverity())));
                alt = !alt;
            }
            doc.add(t);
        }
    }

    // ── PAGE 4: Relationships ────────────────────────────────────────
    private void drawRelationshipsPage(Document doc, List<CorrelationResult> correlations) throws Exception {

        addSectionHeader(doc, "Correlations & Relationships",
                "Columns with statistically significant linear relationships");

        if (correlations.isEmpty()) {
            PdfPTable t = makeTable(1);
            PdfPCell c = new PdfPCell(new Phrase("No significant correlations found in this dataset.", fBody));
            c.setPadding(10);
            t.addCell(c);
            doc.add(t);
        } else {
            PdfPTable t = makeTable(4);
            t.setWidths(new float[]{28, 28, 18, 26});
            t.addCell(headerCell("Column A"));
            t.addCell(headerCell("Column B"));
            t.addCell(headerCell("Value"));
            t.addCell(headerCell("Strength"));

            int limit = Math.min(correlations.size(), 10);
            for (int i = 0; i < limit; i++) {
                CorrelationResult c = correlations.get(i);
                Color bg = correlationColor(c.getCorrelation());
                t.addCell(dataCell(c.getColumn1(), bg));
                t.addCell(dataCell(c.getColumn2(), bg));
                PdfPCell vc = dataCell(String.format("%.3f", c.getCorrelation()), bg);
                vc.setHorizontalAlignment(Element.ALIGN_CENTER);
                t.addCell(vc);
                Color sc = Math.abs(c.getCorrelation()) >= 0.7 ? COL_TEAL
                        : Math.abs(c.getCorrelation()) >= 0.5 ? COL_WARN : COL_DANGER;
                Color sb2 = Math.abs(c.getCorrelation()) >= 0.7 ? new Color(220,252,245)
                        : Math.abs(c.getCorrelation()) >= 0.5 ? new Color(255,248,230) : new Color(253,234,239);
                t.addCell(badgeCell(strengthLabel(c.getCorrelation()), sb2, sc));
            }
            doc.add(t);

            // Correlation heatmap (only if ≤ 12 unique columns involved)
            Set<String> colsInvolved = new LinkedHashSet<>();
            for (CorrelationResult cr : correlations) {
                colsInvolved.add(cr.getColumn1());
                colsInvolved.add(cr.getColumn2());
            }
            if (colsInvolved.size() <= 12) {
                addSpacer(doc, 16);
                addSectionHeader(doc, "Correlation Matrix", "Visual heatmap of relationships between numeric columns");
                drawCorrelationMatrix(doc, correlations, new ArrayList<>(colsInvolved));
            }
        }
    }

    private void drawCorrelationMatrix(Document doc, List<CorrelationResult> correlations, List<String> cols) throws Exception {
        // Build lookup map: col1+col2 -> correlation
        Map<String, Double> lookup = new HashMap<>();
        for (CorrelationResult c : correlations) {
            lookup.put(c.getColumn1() + "|" + c.getColumn2(), c.getCorrelation());
            lookup.put(c.getColumn2() + "|" + c.getColumn1(), c.getCorrelation());
        }

        int n = cols.size();
        int[] widths = new int[n + 1];
        widths[0] = 25;
        for (int i = 1; i <= n; i++) widths[i] = (int)Math.floor(75.0 / n);

        PdfPTable t = new PdfPTable(n + 1);
        t.setWidthPercentage(100);
        t.setWidths(widths);
        t.setSpacingBefore(6);

        // Header row
        PdfPCell corner = new PdfPCell(new Phrase("", fLabel));
        corner.setBackgroundColor(COL_HEADER_BG);
        corner.setBorderColor(COL_BORDER);
        corner.setPadding(4);
        t.addCell(corner);

        // Truncate column names for matrix headers
        for (String col : cols) {
            String abbrev = col.length() > 8 ? col.substring(0, 7) + "." : col;
            Font fH = new Font(bfBold, 7, Font.BOLD, COL_TEXT);
            PdfPCell hc = new PdfPCell(new Phrase(abbrev, fH));
            hc.setBackgroundColor(COL_HEADER_BG);
            hc.setBorderColor(COL_BORDER);
            hc.setPadding(4);
            hc.setHorizontalAlignment(Element.ALIGN_CENTER);
            t.addCell(hc);
        }

        // Data rows
        for (String row : cols) {
            String abbrev = row.length() > 8 ? row.substring(0, 7) + "." : row;
            Font fH = new Font(bfBold, 7, Font.BOLD, COL_TEXT);
            PdfPCell rc = new PdfPCell(new Phrase(abbrev, fH));
            rc.setBackgroundColor(COL_HEADER_BG);
            rc.setBorderColor(COL_BORDER);
            rc.setPadding(4);
            t.addCell(rc);

            for (String col : cols) {
                double val = row.equals(col) ? 1.0
                        : lookup.getOrDefault(row + "|" + col, 0.0);
                Color cellBg = heatColor(val);
                Font fV = new Font(bfBold, 7, Font.BOLD, row.equals(col) ? COL_PRIMARY : COL_TEXT);
                PdfPCell vc = new PdfPCell(new Phrase(String.format("%.2f", val), fV));
                vc.setBackgroundColor(cellBg);
                vc.setBorderColor(COL_BORDER);
                vc.setPadding(4);
                vc.setHorizontalAlignment(Element.ALIGN_CENTER);
                t.addCell(vc);
            }
        }
        doc.add(t);

        // Legend
        addSpacer(doc, 8);
        PdfPTable legend = makeTable(3);
        legend.setWidths(new float[]{33, 34, 33});
        legend.addCell(badgeCell("■  Strong Positive (≥0.7)",  new Color(220, 238, 255), COL_PRIMARY));
        legend.addCell(badgeCell("■  Moderate (0.5–0.7)",      new Color(255, 248, 230), COL_WARN));
        legend.addCell(badgeCell("■  Negative / Weak",          new Color(255, 230, 240), COL_DANGER));
        doc.add(legend);
    }

    // ── PAGE 5: Smart Insights ───────────────────────────────────────
    private void drawInsightsPage(Document doc, List<Insight> insights) throws Exception {
        addSectionHeader(doc, "Smart Insights", "AI-generated observations about your dataset");

        for (Insight insight : insights) {
            String msg = insight.getMessage();
            String emoji;
            Color bg;
            Color border;

            if (msg.toLowerCase().contains("relationship") || msg.toLowerCase().contains("correlation")
                    || msg.toLowerCase().contains("scatter") || msg.toLowerCase().contains("bubble")) {
                emoji  = "📈";
                bg     = new Color(220, 252, 245);
                border = COL_TEAL;
            } else if (msg.toLowerCase().contains("missing") || msg.toLowerCase().contains("outlier")
                    || msg.toLowerCase().contains("improvement")) {
                emoji  = "⚠";
                bg     = new Color(255, 248, 232);
                border = COL_WARN;
            } else {
                emoji  = "💡";
                bg     = new Color(240, 238, 255);
                border = COL_PRIMARY;
            }

            PdfPTable t = makeTable(1);
            t.setSpacingBefore(5);
            PdfPCell c = new PdfPCell();
            c.setBorder(Rectangle.LEFT | Rectangle.TOP | Rectangle.BOTTOM | Rectangle.RIGHT);
            c.setBorderColor(COL_BORDER);
            c.setBorderColorLeft(border);
            c.setBorderWidthLeft(3f);
            c.setBackgroundColor(bg);
            c.setPadding(10);
            c.addElement(new Phrase(emoji + "  " + msg, fBody));
            t.addCell(c);
            doc.add(t);
        }
    }

    // ── PAGE 6: Recommended Charts ───────────────────────────────────
    private void drawChartsPage(Document doc, List<ChartRecommendation> charts) throws Exception {
        addSectionHeader(doc, "Recommended Charts", "VizIQ's ranked chart suggestions for this dataset");

        PdfPTable t = makeTable(3);
        t.setWidths(new float[]{8, 30, 62});
        t.addCell(headerCell("#"));
        t.addCell(headerCell("Chart Type"));
        t.addCell(headerCell("Reason"));

        boolean alt = false;
        for (int i = 0; i < charts.size(); i++) {
            ChartRecommendation cr = charts.get(i);
            Color bg = alt ? new Color(250, 250, 255) : COL_CARD_BG;

            PdfPCell nc = dataCell(String.valueOf(i + 1), bg);
            nc.setHorizontalAlignment(Element.ALIGN_CENTER);
            t.addCell(nc);

            // Chart name + score badge inline
            PdfPCell typCell = new PdfPCell();
            typCell.setBackgroundColor(bg);
            typCell.setBorderColor(COL_BORDER);
            typCell.setPadding(7);
            typCell.addElement(new Phrase(formatChartName(cr.getChartType()), fBodyBold));
            Font fScore = new Font(bfBold, 8, Font.BOLD, COL_PRIMARY);
            Paragraph sp = new Paragraph("Score: " + cr.getScore(), fScore);
            sp.setSpacingBefore(2);
            typCell.addElement(sp);
            t.addCell(typCell);

            t.addCell(dataCell(cr.getReason(), bg));
            alt = !alt;
        }
        doc.add(t);
    }

    // ── PAGE 7: Chart Image ──────────────────────────────────────────
    private void drawChartPage(Document doc, byte[] chartImageBytes,
            List<ChartRecommendation> charts) throws Exception {

        addSectionHeader(doc, "Chart Visualization", "Active chart captured from the VizIQ dashboard");

        try {
            Image img = Image.getInstance(chartImageBytes);
            img.setAlignment(Image.ALIGN_CENTER);

            float maxW = doc.getPageSize().getWidth() - doc.leftMargin() - doc.rightMargin();
            float maxH = 420;
            img.scaleToFit(maxW, maxH);
            doc.add(img);
        } catch (Exception e) {
            doc.add(new Paragraph("Chart image could not be rendered.", fSmall));
        }

        addSpacer(doc, 12);

        // Caption table
        PdfPTable cap = makeTable(1);
        PdfPCell c = new PdfPCell();
        c.setBackgroundColor(COL_HEADER_BG);
        c.setBorderColor(COL_BORDER);
        c.setPadding(10);
        c.addElement(new Phrase("Generated by VizIQ Analytics Platform · " +
                LocalDate.now().format(DateTimeFormatter.ofPattern("dd MMMM yyyy")), fSmall));
        cap.addCell(c);
        doc.add(cap);
    }

    // ── Backwards-compatible overload (no chart image, no extra params) ──
    public byte[] generatePdf(
            SummaryInfo summary,
            DatasetHealth health,
            List<Insight> insights,
            List<CorrelationResult> correlations,
            List<ChartRecommendation> charts,
            List<OutlierInfo> outliers
    ) throws Exception {
        return generatePdf(summary, health, insights, correlations, charts, outliers,
                Collections.emptyList(), Collections.emptyMap(), "dataset.csv", "—", "—", null);
    }
    // Helper to draw a perfect circular background and centered score inside a table cell
    static class CircleBackgroundEvent implements PdfPCellEvent {
        private final Color bgColor;
        private final Color borderColor;
        private final int score;
        private final BaseFont scoreFont;
        private final BaseFont labelFont;

        public CircleBackgroundEvent(Color bgColor, Color borderColor, int score,
                                     BaseFont scoreFont, BaseFont labelFont) {
            this.bgColor = bgColor;
            this.borderColor = borderColor;
            this.score = score;
            this.scoreFont = scoreFont;
            this.labelFont = labelFont;
        }

        @Override
        public void cellLayout(PdfPCell cell, Rectangle position, PdfContentByte[] canvases) {
            PdfContentByte bg = canvases[PdfPTable.BACKGROUNDCANVAS];
            bg.saveState();

            float cx = (position.getLeft() + position.getRight()) / 2;
            float cy = (position.getTop() + position.getBottom()) / 2;
            float radius = Math.min(position.getWidth(), position.getHeight()) / 2f - 2f;

            bg.setColorFill(bgColor);
            bg.circle(cx, cy, radius);
            bg.fill();

            bg.setColorStroke(borderColor);
            bg.setLineWidth(2.5f);
            bg.circle(cx, cy, radius);
            bg.stroke();

            bg.restoreState();

            PdfContentByte text = canvases[PdfPTable.TEXTCANVAS];
            text.saveState();
            text.setColorFill(borderColor);
            text.beginText();
            text.setFontAndSize(scoreFont, 26);
            text.showTextAligned(
                    Element.ALIGN_CENTER,
                    String.valueOf(score),
                    cx,
                    cy + 1,
                    0
            );
            text.setFontAndSize(labelFont, 8);
            text.setColorFill(COL_MUTED);
            text.showTextAligned(
                    Element.ALIGN_CENTER,
                    "/ 100",
                    cx,
                    cy - 15,
                    0
            );
            text.endText();
            text.restoreState();
        }
    }
}
