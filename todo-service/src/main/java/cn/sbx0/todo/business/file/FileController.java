package cn.sbx0.todo.business.file;

import cn.sbx0.todo.service.common.Result;
import cn.sbx0.todo.utils.JSON;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.io.FileSystemResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Slf4j
@RestController
@RequestMapping(("/file"))
public class FileController {

    private static final String UPLOAD_DIR = "C:\\Users\\winmj\\Pictures\\Upload\\";
    public static final String JSON_TYPE = ".json";

    @PostMapping("/upload")
    public Result<FileInfoEntity> handleFileUpload(@RequestParam("file") MultipartFile file) {
        String newFileName = UUID.randomUUID().toString();
        try {
            // 保存文件信息
            FileInfoEntity fileInfo = new FileInfoEntity();
            // 新的文件名
            fileInfo.setFileName(newFileName);
            // 原始文件名
            String fileName = file.getOriginalFilename();
            fileInfo.setOriginalFileName(fileName);
            // MD5
            String md5 = calculateMD5(file.getBytes());
            fileInfo.setMd5(md5);
            Files.writeString(Paths.get(UPLOAD_DIR, newFileName + JSON_TYPE), JSON.parse(fileInfo));

            // 保存文件
            Path filePath = Paths.get(UPLOAD_DIR, newFileName);
            Files.write(filePath, file.getBytes());

            return Result.success(fileInfo);
        } catch (IOException | NoSuchAlgorithmException e) {
            log.error(e.getMessage(), e);
            return Result.failure("Uploading Failed");
        }
    }

    @GetMapping("/download/{fileName}")
    public ResponseEntity<FileSystemResource> downloadFile(@PathVariable String fileName) throws IOException {
        String filePath = UPLOAD_DIR + fileName;
        // 文件信息的地址
        String jsonFilePath = filePath + JSON_TYPE;
        // 读取文件原始信息
        FileInfoEntity fileInfo = JSON.readFromFile(jsonFilePath, FileInfoEntity.class);

        FileSystemResource fileSystemResource = new FileSystemResource(filePath);

        HttpHeaders headers = new HttpHeaders();
        headers.add(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=" + fileInfo.getOriginalFileName());
        headers.add(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_OCTET_STREAM_VALUE);

        return ResponseEntity.ok()
                .headers(headers)
                .contentLength(fileSystemResource.contentLength())
                .contentType(MediaType.APPLICATION_OCTET_STREAM)
                .body(fileSystemResource);
    }

    @GetMapping("/list")
    public Result<List<FileInfoEntity>> fileList() {
        File folder = new File(UPLOAD_DIR);
        File[] files = folder.listFiles();
        List<FileInfoEntity> fileInfos = new ArrayList<>();
        if (files != null) {
            for (File file : files) {
                if (file.isDirectory()) {
                    continue;
                }
                String name = file.getName();
                if (name.contains(JSON_TYPE)) {
                    continue;
                }
                fileInfos.add(new FileInfoEntity(name));
            }
        }
        return Result.success(fileInfos);
    }

    private String calculateMD5(byte[] fileBytes) throws NoSuchAlgorithmException {
        MessageDigest md = MessageDigest.getInstance("MD5");
        byte[] digest = md.digest(fileBytes);

        StringBuilder result = new StringBuilder();
        for (byte b : digest) {
            result.append(String.format("%02x", b));
        }

        return result.toString();
    }
}