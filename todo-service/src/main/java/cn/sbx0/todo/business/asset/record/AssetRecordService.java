package cn.sbx0.todo.business.asset.record;

import cn.sbx0.todo.business.asset.type.AssetType;
import cn.sbx0.todo.entity.PagingRequest;
import cn.sbx0.todo.repositories.AssetRecordRepository;
import cn.sbx0.todo.repositories.AssetTypeRepository;
import cn.sbx0.todo.service.JpaService;
import cn.sbx0.todo.service.common.Paging;
import cn.sbx0.todo.service.common.Result;
import jakarta.annotation.Resource;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Sort;
import org.springframework.data.domain.Sort.Order;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

/**
 * @author sbx0
 * @since 2022/12/8
 */
@Slf4j
@Service
public class AssetRecordService implements JpaService<AssetRecord, Long> {

    @Resource
    private AssetRecordRepository repository;
    @Resource
    private AssetTypeRepository assetTypeRepository;

    public Result<List<RecordItem>> getRecords() {
        List<RecordItem> records = new ArrayList<>();
        List<AssetType> types = assetTypeRepository.getTypes();
        for (AssetType type : types) {
            RecordItem record = new RecordItem();
            record.setName(type.getTypeName());
            record.setType("line");
            record.setStack("Total");
            record.setYAxisIndex((type.getId().intValue() - 1));
            List<AssetRecord> assetRecords = repository.getRecordsByTypeId(type.getId());
            List<BigDecimal> data = new ArrayList<>();
            for (AssetRecord assetRecord : assetRecords) {
                data.add(assetRecord.getRecordValue());
            }
            record.setData(data);
            records.add(record);
        }
        return Result.success(records);
    }

    public Result<List<String>> getRecentRecordTimeList() {
        return Result.success(repository.getRecentRecordTimeList());
    }

    /**
     * <p>Paging list</p>
     * <p>Unit Test is {@link  AssetRecordServiceTest#paging}</p>
     *
     * @param page     page
     * @param pageSize pageSize
     * @return Paging list
     */
    @Override
    public <DefaultPagingRequest extends PagingRequest> Paging<AssetRecord> paging(DefaultPagingRequest pagingRequest) {
        Page<AssetRecord> pagingData = repository.findAll(Paging.build(
                pagingRequest.getPage(), pagingRequest.getPageSize(),
                Sort.by(Order.asc("id"))
        ));
        return Paging.success(
                pagingData.getContent(),
                pagingData.getPageable().getPageNumber(),
                pagingData.getPageable().getPageSize(),
                pagingData.getTotalElements(),
                pagingData.getTotalPages()
        );
    }

    /**
     * <p>Save</p>
     * <p>Unit Test is {@link  AssetRecordServiceTest#save}</p>
     *
     * @param entity entity
     * @return new entity
     */
    @Override
    @Transactional(rollbackFor = Exception.class)
    public Result<AssetRecord> save(AssetRecord entity) {
        if (entity == null) {
            return Result.failed();
        }
        entity.setCreateTime(LocalDateTime.now());
        entity = repository.save(entity);
        if (entity.getId() != null) {
            return Result.success(entity);
        } else {
            return Result.failed();
        }
    }

    /**
     * <p>Update</p>
     * <p>Unit Test is {@link  AssetRecordServiceTest#update}</p>
     *
     * @param entity entity
     * @return new entity
     */
    @Override
    @Transactional(rollbackFor = Exception.class)
    public Result<AssetRecord> update(AssetRecord entity) {
        if (entity == null || entity.getId() == null) {
            return Result.failed();
        }
        repository.save(entity);
        return Result.success(entity);
    }

    @Override
    public Result<AssetRecord> findById(Long id) {
        Optional<AssetRecord> result = repository.findById(id);
        return result.map(Result::success).orElseGet(Result::failed);
    }

    @Override
    public Result<Void> deleteById(Long id) {
        repository.deleteById(id);
        return Result.success();
    }
}
