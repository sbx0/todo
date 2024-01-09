package cn.sbx0.todo.business.file;

import cn.sbx0.todo.service.common.Result;
import cn.sbx0.todo.utils.JSON;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@Slf4j
@RestController
@RequestMapping(("/file"))
public class FileController {

    private static final String UPLOAD_DIR = "C:\\Users\\winmj\\Pictures\\Upload\\";
    public static final String ORIGINAL_FILE_NAME = "original_file_name";
    public static final String MD5 = "md5";
    public static final String JSON_TYPE = ".json";

    @PostMapping("/upload")
    public Result<String> handleFileUpload(@RequestParam("file") MultipartFile file) {
        String newFileName = UUID.randomUUID().toString();
        try {
            // 保存文件信息
            Map<String, String> info = new HashMap<>();
            // 原始文件名
            String fileName = file.getOriginalFilename();
            info.put(ORIGINAL_FILE_NAME, fileName);
            // MD5
            String md5 = calculateMD5(file.getBytes());
            info.put(MD5, md5);
            Files.writeString(Paths.get(UPLOAD_DIR, newFileName + JSON_TYPE), JSON.parse(info));

            // 保存文件
            Path filePath = Paths.get(UPLOAD_DIR, newFileName);
            Files.write(filePath, file.getBytes());

            return Result.success("Uploaded");
        } catch (IOException | NoSuchAlgorithmException e) {
            log.error(e.getMessage(), e);
            return Result.failure("Uploading Failed");
        }
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