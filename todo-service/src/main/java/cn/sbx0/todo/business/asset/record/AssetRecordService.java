package cn.sbx0.todo.business.asset.record;

import cn.sbx0.todo.business.asset.type.AssetType;
import cn.sbx0.todo.business.user.ClientUserService;
import cn.sbx0.todo.entity.DefaultPagingRequest;
import cn.sbx0.todo.exception.NoPermissionException;
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
    @Resource
    private ClientUserService clientUserService;

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
        Long loginUserId = clientUserService.getLoginUserId();
        // find one by record time and typeId
        AssetRecord assetRecord = repository().findByTypeIdAndRecordTime(entity, loginUserId);
        if (assetRecord != null) {
            assetRecord.setRecordValue(entity.getRecordValue());
            entity = assetRecord;
        } else {
            entity.setCreateTime(LocalDateTime.now());
        }
        entity.setUserId(loginUserId);
        return entity;
    }

    @Override
    protected AssetRecord updateBefore(AssetRecord entity) {
        Long loginUserId = clientUserService.getLoginUserId();
        if (!loginUserId.equals(entity.getUserId())) {
            throw new NoPermissionException();
        }
        entity.setUpdateTime(LocalDateTime.now());
        return entity;
    }

    public Result<List<RecordItem>> buildDataForEChart() {
        Long loginUserId = clientUserService.getLoginUserId();
        List<RecordItem> records = new ArrayList<>();
        List<AssetType> types = assetTypeRepository.getTypes();
        List<BigDecimal> totalData = new ArrayList<>();
        List<String> recordTimeList = repository().getRecentRecordTimeList(loginUserId);
        for (int i = 0; i < recordTimeList.size(); i++) {
            totalData.add(new BigDecimal(0));
        }
        for (AssetType type : types) {
            List<AssetRecord> assetRecords = repository().getRecordsByTypeId(type.getId(), loginUserId);
            List<BigDecimal> data = new ArrayList<>();
            for (int i = 0; i < assetRecords.size(); i++) {
                AssetRecord assetRecord = assetRecords.get(i);
                data.add(assetRecord.getRecordValue());
                BigDecimal bigDecimal = totalData.get(i);
                bigDecimal = bigDecimal.add(assetRecord.getRecordValue());
                totalData.set(i, bigDecimal);
            }
            records.add(RecordItem.builder()
                    .name(type.getTypeName())
                    .type("line")
                    .stack("Total")
                    .smooth(false)
                    .showSymbol(false)
                    .yAxisIndex((type.getId().intValue() - 1))
                    .data(data)
                    .build());
        }
        records.add(RecordItem.builder()
                .name("Total")
                .type("line")
                .stack("Total")
                .yAxisIndex(0)
                .smooth(false)
                .showSymbol(false)
                .data(totalData)
                .build());
        return Result.success(records);
    }

    public Result<List<String>> getRecentRecordTimeList() {
        Long loginUserId = clientUserService.getLoginUserId();
        return Result.success(repository().getRecentRecordTimeList(loginUserId));
    }
}
