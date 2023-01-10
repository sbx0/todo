package cn.sbx0.todo.repositories;

import cn.sbx0.todo.business.asset.record.AssetRecord;
import org.springframework.data.jpa.repository.JpaRepository;

/**
 * @author sbx0
 * @since 2022/12/8
 */
public interface AssetRecordRepository extends JpaRepository<AssetRecord, Long> {

}
