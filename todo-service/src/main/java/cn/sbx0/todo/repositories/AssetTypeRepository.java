package cn.sbx0.todo.repositories;

import cn.sbx0.todo.business.asset.type.AssetType;
import org.springframework.data.jpa.repository.JpaRepository;

/**
 * @author sbx0
 * @since 2022/12/8
 */
public interface AssetTypeRepository extends JpaRepository<AssetType, Long> {

}
