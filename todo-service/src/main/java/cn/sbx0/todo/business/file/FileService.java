package cn.sbx0.todo.business.file;

import cn.sbx0.todo.entity.DefaultPagingRequest;
import cn.sbx0.todo.repositories.FileInfoRepository;
import cn.sbx0.todo.service.JpaService;
import cn.sbx0.todo.utils.JSON;
import jakarta.annotation.Resource;
import lombok.extern.slf4j.Slf4j;
import org.jetbrains.annotations.NotNull;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.List;
import java.util.UUID;

/**
 * @author sbx0
 * @since 2024/1/12
 */
@Slf4j
@Service
public class FileService extends JpaService<FileInfoRepository, FileInfoEntity, Long, DefaultPagingRequest> {
    static final String UPLOAD_DIR = "C:\\Users\\winmj\\Pictures\\Upload\\";
    @Resource
    private FileInfoRepository repository;

    static String generateNewFileName() {
        return UUID.randomUUID().toString();
    }

    @Override
    protected FileInfoRepository repository() {
        return this.repository;
    }

    @Override
    protected Long getId(FileInfoEntity categoryEntity) {
        return categoryEntity.getId();
    }

    @Override
    protected FileInfoEntity saveBefore(FileInfoEntity categoryEntity) {
        return categoryEntity;
    }

    @Override
    protected FileInfoEntity updateBefore(FileInfoEntity entity) {
        return entity;
    }

    String calculateMD5(byte[] fileBytes) throws NoSuchAlgorithmException {
        MessageDigest md = MessageDigest.getInstance("MD5");
        byte[] digest = md.digest(fileBytes);

        StringBuilder result = new StringBuilder();
        for (byte b : digest) {
            result.append(String.format("%02x", b));
        }

        return result.toString();
    }

    @NotNull
    FileInfoEntity handleUpload(MultipartFile file, Long userId, String md5) throws NoSuchAlgorithmException, IOException {
        // 生成新的文件名
        String newFileName = generateNewFileName();

        // 保存文件信息
        FileInfoEntity fileInfo = new FileInfoEntity();
        fileInfo.setUserId(userId);
        fileInfo.setMd5(md5);
        // 文件大小
        fileInfo.setSize(file.getSize());
        // 新的文件名
        fileInfo.setName(newFileName);
        // 原始文件名
        fileInfo.setOriginalName(file.getOriginalFilename());
        // 默认路径
        fileInfo.setPath(File.separator);
        // 实际路径
        fileInfo.setRealPath(UPLOAD_DIR + newFileName);
        // 加密方法
        fileInfo.setEncryptionType(FileEncryptionType.SIMPLE.getValue());

        // 保存文件
        Path filePath = Paths.get(UPLOAD_DIR, newFileName);
        Files.write(filePath, file.getBytes());
        // 保存文件信息 JSON
        Files.writeString(Paths.get(UPLOAD_DIR, newFileName + FileController.JSON_TYPE), JSON.parse(fileInfo));
        // 保存文件信息到 DB
        repository.save(fileInfo);
        return fileInfo;
    }

    public boolean handleRepeat(MultipartFile file, Long userId, String md5) throws IOException, NoSuchAlgorithmException {
        // 检验秒传
        List<FileInfoEntity> existFileInfos = repository.findAllByMd5(userId, md5);
        if (!existFileInfos.isEmpty()) {
            // 文件大小
            long size = file.getSize();
            for (FileInfoEntity existFileInfo : existFileInfos) {
                if (existFileInfo.getSize() == size) {
                    return true;
                }
            }
        }
        return false;
    }
}
