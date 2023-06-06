package cn.sbx0.todo.business.car;

import cn.sbx0.todo.business.car.entity.CarConfig;
import cn.sbx0.todo.business.car.entity.CarPlatePhoto;
import cn.sbx0.todo.business.car.entity.CarPlatePhotoResponse;
import cn.sbx0.todo.entity.DefaultPagingRequest;
import cn.sbx0.todo.entity.OrderRequest;
import cn.sbx0.todo.entity.PagingRequest;
import cn.sbx0.todo.repositories.CarPlatePhotoRepository;
import cn.sbx0.todo.scheduled.ApiParam;
import cn.sbx0.todo.service.common.Paging;
import cn.sbx0.todo.service.common.Result;
import cn.sbx0.todo.utils.CallApi;
import cn.sbx0.todo.utils.JSON;
import jakarta.annotation.Resource;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Sort;
import org.springframework.data.domain.Sort.Order;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;
import org.springframework.util.StringUtils;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

/**
 * @author sbx0
 * @since 2022/12/1
 */
@Slf4j
@Service
public class CarPlatePhotoService {

    // default order
    public static final List<Order> ORDERS = List.of(Order.desc("id"));
    @Resource
    private CarPlatePhotoRepository repository;
    @Resource
    private CarConfigService carConfigService;

    public Paging<CarPlatePhoto> paging(PagingRequest pagingRequest) {
        List<Order> orders;
        if (CollectionUtils.isEmpty(pagingRequest.getOrders())) {
            // default order when empty
            orders = ORDERS;
        } else {
            orders = new ArrayList<>();
            List<OrderRequest> requestOrders = pagingRequest.getOrders();
            for (OrderRequest requestOrder : requestOrders) {
                // todo check the parameter name is legitimate
                if (requestOrder.getDirection().equals("desc")) {
                    orders.add(Order.desc(requestOrder.getName()));
                } else {
                    orders.add(Order.asc(requestOrder.getName()));
                }
            }
        }
        Page<CarPlatePhoto> pagingData = repository.paging(pagingRequest, Paging.build(
                pagingRequest.getPage(), pagingRequest.getPageSize(), Sort.by(orders)
        ));
        return Paging.success(
                pagingData.getContent(),
                pagingData.getPageable().getPageNumber() + 1,
                pagingData.getPageable().getPageSize(),
                pagingData.getTotalElements(),
                pagingData.getTotalPages()
        );
    }

    public String getLastPhoto() {
        return repository.getLastPhoto();
    }

    public Boolean save(CarPlatePhoto entity) {
        if (entity == null) {
            return false;
        }
        entity.setCreateTime(LocalDateTime.now());
        entity = repository.save(entity);
        return entity.getId() != null;
    }

    public Result<String> update() {
        DefaultPagingRequest pagingRequest = new DefaultPagingRequest();
        pagingRequest.setPage(1);
        pagingRequest.setPageSize(1);
        Paging<CarConfig> paging = carConfigService.paging(pagingRequest);
        if (paging == null || !paging.getSuccess()) {
            return Result.failure("获取配置信息失败");
        }
        List<CarConfig> data = paging.getData();
        if (CollectionUtils.isEmpty(data)) {
            return Result.failure("请先添加配置信息");
        }
        CarConfig carConfig = data.get(0);
        ApiParam param = new ApiParam(carConfig.getLotId(), carConfig.getCarPlateNum());
        String response = CallApi.post(carConfig.getApiHost(), carConfig.getApiPath(), JSON.parse(param));
        CarPlatePhotoResponse carPlatePhoto = JSON.format(response, CarPlatePhotoResponse.class);
        if (carPlatePhoto == null) {
            return Result.failure("未读取到最新图片");
        }
        String lastPhoto = this.getLastPhoto();
        CarPlatePhotoResponse.ResponseData responseData = carPlatePhoto.getData();
        if (responseData == null) {
            return Result.failure("未读取到最新图片");
        }
        CarPlatePhotoResponse.ResponseData.CarPlaceInfo carPlaceInfo = responseData.getCarPlaceInfo();
        if (carPlaceInfo == null) {
            return Result.failure("未读取到最新图片");
        }
        String latestPhoto = carPlaceInfo.getImgUrl();
        if (!StringUtils.hasText(latestPhoto)) {
            log.info("cat plate photo not return");
            return Result.failure("未读取到最新图片");
        }
        if (latestPhoto.equals(lastPhoto)) {
            log.info("cat plate photo has not changed");
            return Result.failure("未读取到最新图片");
        }
        CarPlatePhoto newPhoto = new CarPlatePhoto();
        newPhoto.setCarPlateNum(carPlaceInfo.getCarPlateNum());
        newPhoto.setLotName(carPlaceInfo.getLotName());
        newPhoto.setFloorName(carPlaceInfo.getFloorInfo().getFloorName());
        newPhoto.setParkNo(carPlaceInfo.getParkNo());
        newPhoto.setImgUrl(carPlaceInfo.getImgUrl());
        newPhoto.setAreaName(carPlaceInfo.getAreaName());
        this.save(newPhoto);
        log.info("car plate photo has changed. [" + newPhoto.getImgUrl() + "]");
        return Result.success();
    }
}
