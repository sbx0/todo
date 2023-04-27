package cn.sbx0.todo;

import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
import java.io.PrintWriter;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

/**
 * beta
 *
 * @author sbx0
 * @since 2023/4/12
 */
public class AutoGenerateReadmeCodeCoverageBadgeFromJacocoReport {

    public static void main(String[] args) throws IOException {
        String currentPath = System.getProperty("user.dir");
        Path path = Paths.get(currentPath + "\\todo-service\\build\\reports\\jacoco\\test\\html\\index.html");
        String content = Files.readString(path);
        String head = "</thead><tfoot><tr><td>Total</td><td class=\"bar\">";
        int beginIndex = content.indexOf(head);
        String newContent = content.substring(beginIndex + head.length());
        String end = "</td><td class=\"bar\">";
        int endIndex = newContent.indexOf(end);
        String last = newContent.substring(0, endIndex);
        String replace = last.replace("</td><td class=\"ctr2\">", "-");
        String[] split = replace.split("-");
        System.out.println("increase test coverage to " + split[1]);
        String url = "https://img.shields.io/badge/coverage-" + split[1] + "25-red.svg";
        path = Paths.get(currentPath + "\\README.md");
        String readme = Files.readString(path);
        String str = "[![coverage](";
        beginIndex = readme.indexOf(str);
        String newReadme = readme.substring(0, beginIndex + str.length());
        endIndex = readme.indexOf(")](https://todo-code-coverage.sbx0.cn/)");
        newReadme += url;
        newReadme += readme.substring(endIndex);
        newReadme = newReadme.trim();
        write(currentPath + "\\README.md", newReadme);
    }

    public static void write(String file, String content) throws IOException {
        FileWriter fw = null;
        try {
            File f = new File(file);
            fw = new FileWriter(f, false);
        } catch (IOException e) {
            e.printStackTrace();
        }
        if (fw != null) {
            PrintWriter pw = new PrintWriter(fw);
            pw.println(content);
            pw.flush();
            fw.flush();
            pw.close();
            fw.close();
        }
    }
}
