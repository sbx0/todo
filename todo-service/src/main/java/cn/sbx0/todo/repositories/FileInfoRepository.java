package cn.sbx0.todo.repositories;

import cn.sbx0.todo.business.file.FileInfoEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

/**
 * @author sbx0
 * @since 2024/1/12
 */
public interface FileInfoRepository extends JpaRepository<FileInfoEntity, Long> {
    @Query(value = """
            SELECT *
            FROM file_info
            """, nativeQuery = true)
    List<FileInfoEntity> getList();

    @Query(value = """
            SELECT id, user_id, name, original_name, path, real_path, md5, size, type, encryption_type, created_at, updated_at
            FROM file_info
            WHERE user_id = ?1 and md5 = ?2
            """, nativeQuery = true)
    List<FileInfoEntity> findAllByMd5(Long userId, String md5);
}
