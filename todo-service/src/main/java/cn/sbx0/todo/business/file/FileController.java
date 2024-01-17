package cn.sbx0.todo.business.file;

import cn.sbx0.todo.business.user.ClientUserService;
import cn.sbx0.todo.entity.DefaultPagingRequest;
import cn.sbx0.todo.service.common.Paging;
import cn.sbx0.todo.service.common.Result;
import cn.sbx0.todo.utils.JSON;
import jakarta.annotation.Resource;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.io.FileSystemResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.security.NoSuchAlgorithmException;
import java.time.Instant;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Comparator;
import java.util.List;

@Slf4j
@RestController
@RequestMapping(("/file"))
public class FileController {
    @Resource
    private FileService service;
    @Resource
    private ClientUserService userService;
    @Resource
    private JwtDecoder jwtDecoder;

    public static final String JSON_TYPE = ".json";

    @PostMapping("/upload")
    public Result<FileInfoEntity> handleFileUpload(@RequestParam("file") MultipartFile file) {
        try {
            String md5 = service.calculateMD5(file.getBytes());
            boolean repeat = service.handleRepeat(file, userService.getLoginUserId(), md5);
            if (repeat) {
                return Result.failure("重复上传");
            }
            return Result.success(service.handleUpload(file, userService.getLoginUserId(), md5));
        } catch (IOException | NoSuchAlgorithmException e) {
            log.error(e.getMessage(), e);
            return Result.failure("Uploading Failed");
        }
    }

    @GetMapping("/download/{fileName}")
    public ResponseEntity<FileSystemResource> downloadFile(@PathVariable String fileName, @RequestParam(value = "token") String token) throws IOException {
        Jwt jwt = jwtDecoder.decode(token);
        Instant expiresAt = jwt.getExpiresAt();
        if (expiresAt == null) {
            return ResponseEntity.ok()
                    .body(null);
        }
        Instant now = Instant.now();
        if (now.isAfter(expiresAt)) {
            return ResponseEntity.ok()
                    .body(null);
        }

        String filePath = FileService.UPLOAD_DIR + fileName;
        // 文件信息的地址
        String jsonFilePath = filePath + JSON_TYPE;
        // 读取文件原始信息
        FileInfoEntity fileInfo = JSON.readFromFile(jsonFilePath, FileInfoEntity.class);
        if (fileInfo == null) {
            return ResponseEntity.ok()
                    .body(null);
        }

        FileSystemResource fileSystemResource = new FileSystemResource(filePath);

        HttpHeaders headers = new HttpHeaders();
        headers.add(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=" + fileInfo.getOriginalName());
        headers.add(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_OCTET_STREAM_VALUE);

        return ResponseEntity.ok()
                .headers(headers)
                .contentLength(fileSystemResource.contentLength())
                .contentType(MediaType.APPLICATION_OCTET_STREAM)
                .body(fileSystemResource);
    }

    @GetMapping("/list")
    public Result<List<FileInfoEntity>> fileList() {
        File folder = new File(FileService.UPLOAD_DIR);
        File[] files = folder.listFiles();
        List<FileInfoEntity> fileInfos = new ArrayList<>();
        if (files != null) {
            // 按照创建时间排序文件
            Arrays.sort(files, (f1, f2) -> {
                long timestamp1 = f1.lastModified();
                long timestamp2 = f2.lastModified();
                return Long.compare(timestamp1, timestamp2);
            });
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

    @PostMapping("/paging")
    public Paging<FileInfoEntity> paging(@RequestBody DefaultPagingRequest pagingRequest) {
        return service.paging(pagingRequest);
    }

}