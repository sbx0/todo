package cn.sbx0.todo.business.asset.type;

import cn.sbx0.todo.entity.DefaultPagingRequest;
import cn.sbx0.todo.repositories.AssetTypeRepository;
import cn.sbx0.todo.service.JpaService;
import jakarta.annotation.Resource;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

/**
 * @author sbx0
 * @since 2022/12/8
 */
@Slf4j
@Service
public class AssetTypeService extends JpaService<AssetTypeRepository, AssetType, Long, DefaultPagingRequest> {
    @Resource
    private AssetTypeRepository repository;

    @Override
    protected AssetTypeRepository repository() {
        return this.repository;
    }

    @Override
    protected Long getId(AssetType assetType) {
        return assetType.getId();
    }

    @Override
    protected AssetType saveBefore(AssetType assetType) {
        assetType.setCreateTime(LocalDateTime.now());
        return assetType;
    }

    @Override
    protected AssetType updateBefore(AssetType entity) {
        entity.setUpdateTime(LocalDateTime.now());
        return entity;
    }
}
