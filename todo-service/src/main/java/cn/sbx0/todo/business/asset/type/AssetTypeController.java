package cn.sbx0.todo.business.asset.type;

import cn.sbx0.todo.entity.PagingRequest;
import cn.sbx0.todo.service.common.Paging;
import cn.sbx0.todo.service.common.Result;
import jakarta.annotation.Resource;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * @author sbx0
 * @since 2022/12/8
 */
@RestController
@RequestMapping(("/asset/type"))
public class AssetTypeController {

    @Resource
    private AssetTypeService service;

    /**
     * <p>AssetType paging list</p>
     * <p>Unit Test is {@link  AssetTypeControllerTest#paging}</p>
     *
     * @param pagingRequest pagingRequest
     * @return AssetType list
     */
    @PostMapping("/paging")
    public Paging<AssetType> paging(@RequestBody PagingRequest pagingRequest) {
        return service.paging(pagingRequest);
    }

    /**
     * <p>Save</p>
     * <p>Unit Test is {@link  AssetTypeControllerTest#save}</p>
     *
     * @param entity entity
     * @return new entity
     */
    @PostMapping("/save")
    public Result<AssetType> save(@RequestBody AssetType entity) {
        return service.save(entity);
    }

    /**
     * <p>Update</p>
     * <p>Unit Test is {@link  AssetTypeControllerTest#update}</p>
     *
     * @param entity entity
     * @return new entity
     */
    @PostMapping("/update")
    public Result<AssetType> update(@RequestBody AssetType entity) {
        return service.update(entity);
    }
}
