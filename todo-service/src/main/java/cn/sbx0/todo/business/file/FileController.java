package cn.sbx0.todo.business.file;

import cn.sbx0.todo.service.common.Result;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

@Slf4j
@RestController
@RequestMapping(("/file"))
public class FileController {

    private static final String UPLOAD_DIR = "C:\\Users\\winmj\\Pictures\\Upload\\";

    @PostMapping("/upload")
    public Result<String> handleFileUpload(@RequestParam("file") MultipartFile file) {
        try {
            // 获取文件名
            String fileName = file.getOriginalFilename();

            // 构建文件路径
            Path filePath = Paths.get(UPLOAD_DIR, fileName);

            // 保存文件到服务器
            Files.write(filePath, file.getBytes());

            return Result.success("File uploaded successfully!");
        } catch (IOException e) {
            log.error(e.getMessage(), e);
            return Result.failure("Error uploading file");
        }
    }
}