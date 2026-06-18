package com.viziq.backend.controller;
import java.util.TreeMap;
import java.util.HashMap;
import java.util.Collections;
import com.viziq.backend.service.ChartRecommendationService;
import com.viziq.backend.service.ColumnDetectorService;
import com.viziq.backend.service.CsvParserService;
import com.viziq.backend.service.StatsService;
import com.viziq.backend.service.DatasetService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.util.HashMap;
import java.util.Map;
import java.io.File;
import java.util.List;
import java.util.ArrayList;
import java.util.List;
import java.util.HashSet;
import java.util.Set;
import java.util.Collections;
import java.util.HashMap;
import java.util.Map;
@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api")
public class FileController {

    @Autowired
    private CsvParserService csvParserService;

    @Autowired
    private ColumnDetectorService columnDetectorService;

    @Autowired
    private StatsService statsService;

    @Autowired
    private ChartRecommendationService chartRecommendationService;

    @Autowired
    private DatasetService datasetService;

    @PostMapping("/upload")
    public String upload(
            @RequestParam("file") MultipartFile file
    ) throws Exception {

        System.out.println("UPLOAD API HIT");
        System.out.println("FILE = " + file.getOriginalFilename());

        File folder = new File("D:/VizIQ/uploads");

        if (!folder.exists()) {
            folder.mkdirs();
        }

        File destination =
                new File(folder, file.getOriginalFilename());

        file.transferTo(destination);

        datasetService.setCurrentDatasetPath(
                destination.getAbsolutePath()
        );

        System.out.println("PATH = " + destination.getAbsolutePath());

        return "Uploaded : " + file.getOriginalFilename();
    }

    @GetMapping("/scatter-data")
    public List<Map<String, Double>> scatterData(
            @RequestParam String xColumn,
            @RequestParam String yColumn
    ) throws Exception {

        List<String[]> rows =
                csvParserService.readCsv(
                        datasetService.getCurrentDatasetPath()
                );

        String[] headers = rows.get(0);

        int xIndex = -1;
        int yIndex = -1;

        for (int i = 0; i < headers.length; i++) {

            if (headers[i].equals(xColumn)) {
                xIndex = i;
            }

            if (headers[i].equals(yColumn)) {
                yIndex = i;
            }
        }

        List<Map<String, Double>> result =
                new ArrayList<>();

        for (int i = 1; i < rows.size(); i++) {

            try {

                double x =
                        Double.parseDouble(
                                rows.get(i)[xIndex]
                        );

                double y =
                        Double.parseDouble(
                                rows.get(i)[yIndex]
                        );

                Map<String, Double> point =
                        new HashMap<>();

                point.put("x", x);
                point.put("y", y);

                result.add(point);

            } catch (Exception e) {

            }
        }

        return result;
    }
    @GetMapping("/line-data")
    public List<Map<String, Double>> lineData(
            @RequestParam String xColumn,
            @RequestParam String yColumn
    ) throws Exception {

        List<String[]> rows =
                csvParserService.readCsv(
                        datasetService.getCurrentDatasetPath()
                );

        String[] headers = rows.get(0);

        int xIndex = -1;
        int yIndex = -1;

        for (int i = 0; i < headers.length; i++) {

            if (headers[i].equals(xColumn)) {
                xIndex = i;
            }

            if (headers[i].equals(yColumn)) {
                yIndex = i;
            }

        }

        Map<Integer, List<Double>> groups =
                new TreeMap<>();

        for (int i = 1; i < rows.size(); i++) {

            try {

                int x =
                        (int) Double.parseDouble(
                                rows.get(i)[xIndex]
                        );

                double y =
                        Double.parseDouble(
                                rows.get(i)[yIndex]
                        );

                groups
                        .computeIfAbsent(
                                x,
                                k -> new ArrayList<>()
                        )
                        .add(y);

            } catch (Exception e) {

            }

        }

        List<Map<String, Double>> result =
                new ArrayList<>();

        for (Integer x : groups.keySet()) {

            List<Double> values =
                    groups.get(x);

            double avg =
                    values.stream()
                            .mapToDouble(Double::doubleValue)
                            .average()
                            .orElse(0);

            Map<String, Double> point =
                    new HashMap<>();

            point.put("x", x.doubleValue());
            point.put("y", avg);

            result.add(point);

        }

        return result;
    }
    @GetMapping("/preview")
    public List<String[]> preview()
            throws Exception {

        return csvParserService.readCsv(
                datasetService.getCurrentDatasetPath()
        );
    }

    @GetMapping("/columns")
    public Map<String, String> columns()
            throws Exception {

        List<String[]> rows =
                csvParserService.readCsv(
                        datasetService.getCurrentDatasetPath()
                );

        return columnDetectorService.detectColumns(rows);
    }

    @GetMapping("/stats")
    public Map<String, Map<String, Double>> stats()
            throws Exception {

        List<String[]> rows =
                csvParserService.readCsv(
                        datasetService.getCurrentDatasetPath()
                );

        return statsService.calculateStats(rows);
    }

    @GetMapping("/charts")
    public List<String> charts()
            throws Exception {

        List<String[]> rows =
                csvParserService.readCsv(
                        datasetService.getCurrentDatasetPath()
                );

        Map<String, String> columns =
                columnDetectorService.detectColumns(rows);

        return chartRecommendationService
                .recommendCharts(columns);


    }
    @GetMapping("/city-chart")
    public Map<String, Integer> cityChart()
            throws Exception {

        List<String[]> rows =
                csvParserService.readCsv(
                        datasetService.getCurrentDatasetPath()
                );

        Map<String,Integer> cityCounts =
                new HashMap<>();

        for(int i = 1; i < rows.size(); i++) {

            String city = rows.get(i)[2];

            cityCounts.put(
                    city,
                    cityCounts.getOrDefault(city,0) + 1
            );
        }

        return cityCounts;
    }

    @GetMapping("/recommend-chart")
    public String recommendChart(
            @RequestParam String column
    ) throws Exception {

        List<String[]> rows =
                csvParserService.readCsv(
                        datasetService.getCurrentDatasetPath()
                );

        Map<String, String> columns =
                columnDetectorService.detectColumns(rows);

        String type = columns.get(column);

        if ("NUMBER".equals(type)) {
            return "HISTOGRAM";
        }

        Set<String> uniqueValues =
                new HashSet<>();

        String[] headers = rows.get(0);

        int columnIndex = -1;

        for (int i = 0; i < headers.length; i++) {

            if (headers[i].equals(column)) {
                columnIndex = i;
                break;
            }
        }

        for (int i = 1; i < rows.size(); i++) {

            uniqueValues.add(
                    rows.get(i)[columnIndex]
            );
        }

        if (uniqueValues.size() <= 8) {
            return "PIE_CHART";
        }

        return "BAR_CHART";
    }
    @GetMapping("/chart-data")
    public Map<String, Integer> chartData(
            @RequestParam String column
    ) throws Exception {

        String path = datasetService.getCurrentDatasetPath();

        System.out.println("PATH = " + path);

        if (path == null) {
            throw new RuntimeException(
                    "No dataset uploaded yet."
            );
        }

        List<String[]> rows =
                csvParserService.readCsv(path);

        int columnIndex = -1;

        String[] headers = rows.get(0);

        for (int i = 0; i < headers.length; i++) {

            if (headers[i]
                    .trim()
                    .equalsIgnoreCase(column.trim())) {

                columnIndex = i;
                break;
            }
        }

        System.out.println("Selected Column = " + column);
        System.out.println("Column Index = " + columnIndex);

        if (columnIndex == -1) {
            throw new RuntimeException(
                    "Column not found: " + column
            );
        }

        Map<String, Integer> counts =
                new HashMap<>();

        for (int i = 1; i < rows.size(); i++) {

            if (columnIndex >= rows.get(i).length) {
                continue;
            }

            String value =
                    rows.get(i)[columnIndex];

            counts.put(
                    value,
                    counts.getOrDefault(value, 0) + 1
            );
        }

        return counts;
    }
    @GetMapping("/numeric-data")
    public List<Double> numericData(
            @RequestParam String column
    ) throws Exception {

        List<String[]> rows =
                csvParserService.readCsv(
                        datasetService.getCurrentDatasetPath()
                );

        String[] headers = rows.get(0);

        int columnIndex = -1;

        for (int i = 0; i < headers.length; i++) {

            if (headers[i].equals(column)) {
                columnIndex = i;
                break;
            }
        }

        List<Double> numbers =
                new ArrayList<>();

        for (int i = 1; i < rows.size(); i++) {

            try {

                numbers.add(
                        Double.parseDouble(
                                rows.get(i)[columnIndex]
                        )
                );

            } catch (Exception e) {

            }
        }

        return numbers;
    }
    @GetMapping("/bubble-data")
    public List<Map<String, Double>> bubbleData(
            @RequestParam String xColumn,
            @RequestParam String yColumn,
            @RequestParam String sizeColumn
    ) throws Exception {

        List<String[]> rows =
                csvParserService.readCsv(
                        datasetService.getCurrentDatasetPath()
                );

        String[] headers = rows.get(0);

        int xIndex = -1;
        int yIndex = -1;
        int zIndex = -1;

        for (int i = 0; i < headers.length; i++) {

            if (headers[i].equals(xColumn))
                xIndex = i;

            if (headers[i].equals(yColumn))
                yIndex = i;

            if (headers[i].equals(sizeColumn))
                zIndex = i;

        }

        List<Map<String, Double>> result =
                new ArrayList<>();

        for (int i = 1; i < rows.size(); i++) {

            try {

                double x =
                        Double.parseDouble(
                                rows.get(i)[xIndex]
                        );

                double y =
                        Double.parseDouble(
                                rows.get(i)[yIndex]
                        );

                double z =
                        Double.parseDouble(
                                rows.get(i)[zIndex]
                        );

                Map<String, Double> point =
                        new HashMap<>();

                point.put("x", x);
                point.put("y", y);
                point.put("z", z);

                result.add(point);

            } catch (Exception e) {

            }

        }

        return result;
    }
    @GetMapping("/boxplot-data")
    public Map<String, Double> boxplotData(
            @RequestParam String column
    ) throws Exception {

        List<String[]> rows =
                csvParserService.readCsv(
                        datasetService.getCurrentDatasetPath()
                );

        String[] headers = rows.get(0);

        int columnIndex = -1;

        for (int i = 0; i < headers.length; i++) {

            if (headers[i].equals(column)) {
                columnIndex = i;
                break;
            }

        }

        List<Double> values =
                new ArrayList<>();

        for (int i = 1; i < rows.size(); i++) {

            try {

                values.add(
                        Double.parseDouble(
                                rows.get(i)[columnIndex]
                        )
                );

            } catch (Exception e) {

            }

        }

        Collections.sort(values);

        int n = values.size();

        double min =
                values.get(0);

        double max =
                values.get(n - 1);

        double q1 =
                values.get(n / 4);

        double median =
                values.get(n / 2);

        double q3 =
                values.get(
                        (3 * n) / 4
                );

        Map<String, Double> result =
                new HashMap<>();

        result.put("min", min);
        result.put("q1", q1);
        result.put("median", median);
        result.put("q3", q3);
        result.put("max", max);

        return result;
    }
    @GetMapping("/heatmap-data")
    public List<Map<String, Double>> heatmapData(
            @RequestParam String xColumn,
            @RequestParam String yColumn
    ) throws Exception {

        List<String[]> rows =
                csvParserService.readCsv(
                        datasetService.getCurrentDatasetPath()
                );

        String[] headers = rows.get(0);

        int xIndex = -1;
        int yIndex = -1;

        for (int i = 0; i < headers.length; i++) {

            if (headers[i].equals(xColumn))
                xIndex = i;

            if (headers[i].equals(yColumn))
                yIndex = i;

        }
        System.out.println(
                "X Index = " + xIndex
        );

        System.out.println(
                "Y Index = " + yIndex
        );

        List<Map<String, Double>> result =
                new ArrayList<>();

        for (int i = 1; i < rows.size(); i++) {

            try {
                System.out.println(
                        rows.get(i)[xIndex]
                                + " | " +
                                rows.get(i)[yIndex]
                );

                double x =
                        Double.parseDouble(
                                rows.get(i)[xIndex]
                        );

                double y =
                        Double.parseDouble(
                                rows.get(i)[yIndex]
                        );

                Map<String, Double> point =
                        new HashMap<>();

                point.put("x", x);
                point.put("y", y);

                result.add(point);

            } catch (Exception e) {

                System.out.println(
                        "Skipped row: " + i
                );

            }

        }

        return result;
    }

    @GetMapping("/histogram-data")
    public List<Map<String, Object>> histogramData(
            @RequestParam String column
    ) throws Exception {

        List<Double> numbers =
                numericData(column);

        double min = Collections.min(numbers);
        double max = Collections.max(numbers);

        int bins = 10;

        double binSize =
                (max - min) / bins;

        List<Map<String, Object>> result =
                new ArrayList<>();

        for (int i = 0; i < bins; i++) {

            double start =
                    min + (i * binSize);

            double end =
                    start + binSize;

            int count = 0;

            for (Double value : numbers) {

                if (value >= start &&
                        value < end) {

                    count++;
                }
            }

            Map<String, Object> row =
                    new HashMap<>();

            row.put(
                    "range",
                    String.format(
                            "%.1f - %.1f",
                            start,
                            end
                    )
            );

            row.put(
                    "count",
                    count
            );

            result.add(row);
        }

        return result;
    }
    }
