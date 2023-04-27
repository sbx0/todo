package cn.sbx0.todo.repositories;

import cn.sbx0.todo.business.asset.record.AssetRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

/**
 * @author sbx0
 * @since 2022/12/8
 */
public interface AssetRecordRepository extends JpaRepository<AssetRecord, Long> {
    @Query(value = """
            SELECT DISTINCT record_time
            FROM asset_records
            WHERE user_id = ?1
            ORDER BY record_time
            LIMIT 1000""", nativeQuery = true)
    List<String> getRecentRecordTimeList(Long userId);

    @Query(value = """
            SELECT *
            FROM asset_records
            WHERE user_id = ?2
            AND type_id = ?1
            ORDER by record_time
            """, nativeQuery = true)
    List<AssetRecord> getRecordsByTypeId(Long typeId, Long userId);

    @Query(value = """
            SELECT *
            FROM asset_records
            WHERE user_id = ?1
            ORDER by record_time
            limit 1000
            """, nativeQuery = true)
    List<AssetRecord> getRecordsByUser(Long userId);

    @Query(value = """
            SELECT *
            FROM asset_records
            WHERE user_id = :#{#userId}
            AND type_id = :#{#entity.typeId}
            AND record_time = :#{#entity.recordTime}
            """, nativeQuery = true)
    AssetRecord findByTypeIdAndRecordTime(AssetRecord entity, Long userId);


}
