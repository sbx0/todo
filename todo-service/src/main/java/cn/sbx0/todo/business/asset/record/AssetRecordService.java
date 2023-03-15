package cn.sbx0.todo.business.asset.record;

import cn.sbx0.todo.business.asset.type.AssetType;
import cn.sbx0.todo.entity.PagingRequest;
import cn.sbx0.todo.repositories.AssetRecordRepository;
import cn.sbx0.todo.repositories.AssetTypeRepository;
import cn.sbx0.todo.service.JpaServiceImpl;
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
public class AssetRecordService extends JpaServiceImpl<AssetRecordRepository, AssetRecord, Long> {
    @Resource
    private AssetTypeRepository assetTypeRepository;

    @Override
    protected Long getId(AssetRecord assetRecord) {
        return assetRecord.getId();
    }

    @Override
    protected AssetRecord saveBefore(AssetRecord assetRecord) {
        assetRecord.setCreateTime(LocalDateTime.now());
        return assetRecord;
    }

    public Result<List<RecordItem>> getRecords() {
        List<RecordItem> records = new ArrayList<>();
        List<AssetType> types = assetTypeRepository.getTypes();
        RecordItem totalRecordItem = new RecordItem();
        totalRecordItem.setName("Total");
        totalRecordItem.setType("line");
        totalRecordItem.setStack("Total");
        totalRecordItem.setYAxisIndex(0);
        totalRecordItem.setSmooth(false);
        totalRecordItem.setShowSymbol(false);
        List<BigDecimal> totalData = new ArrayList<>();
        List<String> recordTimeList = r.getRecentRecordTimeList();
        for (int i = 0; i < recordTimeList.size(); i++) {
            totalData.add(new BigDecimal(0));
        }
        for (AssetType type : types) {
            RecordItem record = new RecordItem();
            record.setName(type.getTypeName());
            record.setType("line");
            record.setStack("Total");
            record.setSmooth(false);
            record.setShowSymbol(false);
            record.setYAxisIndex((type.getId().intValue() - 1));
            List<AssetRecord> assetRecords = r.getRecordsByTypeId(type.getId());
            List<BigDecimal> data = new ArrayList<>();
            for (int i = 0; i < assetRecords.size(); i++) {
                AssetRecord assetRecord = assetRecords.get(i);
                data.add(assetRecord.getRecordValue());
                BigDecimal bigDecimal = totalData.get(i);
                bigDecimal = bigDecimal.add(assetRecord.getRecordValue());
                totalData.set(i, bigDecimal);
            }
            record.setData(data);
            records.add(record);
        }
        totalRecordItem.setData(totalData);
        records.add(totalRecordItem);
        return Result.success(records);
    }

    public Result<List<String>> getRecentRecordTimeList() {
        return Result.success(r.getRecentRecordTimeList());
    }

    @Override
    public <DefaultPagingRequest extends PagingRequest> Paging<AssetRecord> paging(DefaultPagingRequest pagingRequest) {
        Page<AssetRecord> pagingData = r.findAll(Paging.build(
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
        // find one by record time and typeId
        AssetRecord assetRecord = r.findByTypeIdAndRecordTime(entity);
        if (assetRecord != null) {
            assetRecord.setRecordValue(entity.getRecordValue());
            entity = assetRecord;
        } else {
            entity.setCreateTime(LocalDateTime.now());
        }
        entity = r.save(entity);
        if (entity.getId() != null) {
            return Result.success(entity);
        } else {
            return Result.failed();
        }
    }
}
