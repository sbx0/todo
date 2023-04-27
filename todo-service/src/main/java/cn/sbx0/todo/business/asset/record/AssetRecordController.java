package cn.sbx0.todo.business.asset.record;

import cn.sbx0.todo.entity.DefaultPagingRequest;
import cn.sbx0.todo.service.common.Paging;
import cn.sbx0.todo.service.common.Result;
import jakarta.annotation.Resource;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * @author sbx0
 * @since 2022/12/8
 */
@RestController
@RequestMapping(("/asset/record"))
public class AssetRecordController {

    @Resource
    private AssetRecordService service;

    @GetMapping("/flow")
    public Result<List<AssetFlowRecord>> flow() {
        return service.flow();
    }

    @GetMapping("/getRecords")
    public Result<List<RecordItem>> buildDataForEChart() {
        return service.buildDataForEChart();
    }

    @GetMapping("/getRecentRecordTimeList")
    public Result<List<String>> getRecentRecordTimeList() {
        return service.getRecentRecordTimeList();
    }


    /**
     * <p>AssetRecord paging list</p>
     * <p>Unit Test is {@link  AssetRecordControllerTest#paging}</p>
     *
     * @param pagingRequest pagingRequest
     * @return AssetRecord list
     */
    @PostMapping("/paging")
    public Paging<AssetRecord> paging(@RequestBody DefaultPagingRequest pagingRequest) {
        return service.paging(pagingRequest);
    }

    /**
     * <p>Save</p>
     * <p>Unit Test is {@link  AssetRecordControllerTest#save}</p>
     *
     * @param entity entity
     * @return new entity
     */
    @PostMapping("/save")
    public Result<AssetRecord> save(@RequestBody AssetRecord entity) {
        return service.save(entity);
    }

    /**
     * <p>Update</p>
     * <p>Unit Test is {@link  AssetRecordControllerTest#update}</p>
     *
     * @param entity entity
     * @return new entity
     */
    @PostMapping("/update")
    public Result<AssetRecord> update(@RequestBody AssetRecord entity) {
        return service.update(entity);
    }
}
