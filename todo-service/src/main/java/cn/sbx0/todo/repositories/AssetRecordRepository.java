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
            select distinct record_time
                  from asset_records
                  order by record_time desc
                  limit 1000
            """, nativeQuery = true)
    List<String> getRecentRecordTimeList();
}
