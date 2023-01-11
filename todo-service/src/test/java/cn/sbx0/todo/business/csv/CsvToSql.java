package cn.sbx0.todo.business.csv;

import org.junit.jupiter.api.Test;

import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
import java.io.PrintWriter;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

/**
 * @author sbx0
 * @since 2023/1/11
 */
public class CsvToSql {
    public static final String INSERT = "INSERT INTO asset_records (type_id, record_value, record_time, create_time) VALUES (";

    public static void writeDataToFile(String path, String value) {
        FileWriter fw = null;
        try {
            File f = new File(path);
            fw = new FileWriter(f, true);
        } catch (IOException e) {
            e.printStackTrace();
        }
        PrintWriter pw = new PrintWriter(fw);
        pw.println(value);
        pw.flush();
        try {
            fw.flush();
            pw.close();
            fw.close();
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    @Test
    void readCsvDataToSQL() throws IOException {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy/M/d");
        DateTimeFormatter dateFormatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
        DateTimeFormatter datetimeFormatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
        String out = "D:\\Workspace\\IdeaProjects\\todo\\todo-service\\src\\test\\resources\\out.sql";
        Path path = Paths.get("D:\\Workspace\\IdeaProjects\\todo\\todo-service\\src\\test\\resources\\flow.csv");
        List<String> lines = Files.readAllLines(path);
        for (int i = 0, linesSize = lines.size(); i < linesSize; i++) {
            if (i == 0) {
                continue;
            }
            String line = lines.get(i);
            String[] data = line.split(",");
            String date = data[0];

            String bank = data[2];
            LocalDate localDate = LocalDate.parse(date, formatter);
            String time = localDate.format(dateFormatter);
            String sql = INSERT + "1, " + bank + ", '" + time + " 00:00:00', '" + LocalDateTime.now().format(datetimeFormatter) + "');";
            writeDataToFile(out, sql);

            String alipay = data[3];
            sql = INSERT + "2, " + alipay + ", '" + time + " 00:00:00', '" + LocalDateTime.now().format(datetimeFormatter) + "');";
            writeDataToFile(out, sql);

            String wechat = data[4];
            sql = INSERT + "3, " + wechat + ", '" + time + " 00:00:00', '" + LocalDateTime.now().format(datetimeFormatter) + "');";
            writeDataToFile(out, sql);
        }
    }
}
