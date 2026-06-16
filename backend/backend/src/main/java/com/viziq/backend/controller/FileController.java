package com.viziq.backend.controller;
import java.util.HashMap;
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
    }
