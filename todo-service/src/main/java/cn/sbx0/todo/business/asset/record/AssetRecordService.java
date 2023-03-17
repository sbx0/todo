package cn.sbx0.todo.business.asset.record;

import cn.sbx0.todo.business.asset.type.AssetType;
import cn.sbx0.todo.entity.DefaultPagingRequest;
import cn.sbx0.todo.repositories.AssetRecordRepository;
import cn.sbx0.todo.repositories.AssetTypeRepository;
import cn.sbx0.todo.service.JpaService;
import cn.sbx0.todo.service.common.Result;
import jakarta.annotation.Resource;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

/**
 * @author sbx0
 * @since 2022/12/8
 */
@Slf4j
@Service
public class AssetRecordService extends JpaService<AssetRecordRepository, AssetRecord, Long, DefaultPagingRequest> {
    @Resource
    private AssetRecordRepository repository;
    @Resource
    private AssetTypeRepository assetTypeRepository;

    @Override
    protected AssetRecordRepository repository() {
        return this.repository;
    }

    @Override
    protected Long getId(AssetRecord assetRecord) {
        return assetRecord.getId();
    }

    @Override
    protected AssetRecord saveBefore(AssetRecord entity) {
        // find one by record time and typeId
        AssetRecord assetRecord = repository().findByTypeIdAndRecordTime(entity);
        if (assetRecord != null) {
            assetRecord.setRecordValue(entity.getRecordValue());
            entity = assetRecord;
        } else {
            entity.setCreateTime(LocalDateTime.now());
        }
        return entity;
    }

    @Override
    protected AssetRecord updateBefore(AssetRecord entity) {
        entity.setUpdateTime(LocalDateTime.now());
        return entity;
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
        List<String> recordTimeList = repository().getRecentRecordTimeList();
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
            List<AssetRecord> assetRecords = repository().getRecordsByTypeId(type.getId());
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
        return Result.success(repository().getRecentRecordTimeList());
    }
}
