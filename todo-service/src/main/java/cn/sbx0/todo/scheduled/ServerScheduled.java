package cn.sbx0.todo.scheduled;

import cn.sbx0.todo.business.car.CarConfigService;
import cn.sbx0.todo.business.car.CarPlatePhotoService;
import cn.sbx0.todo.business.car.entity.CarConfig;
import cn.sbx0.todo.business.car.entity.CarPlatePhoto;
import cn.sbx0.todo.business.car.entity.CarPlatePhotoResponse;
import cn.sbx0.todo.entity.DefaultPagingRequest;
import cn.sbx0.todo.service.common.Paging;
import cn.sbx0.todo.utils.CallApi;
import cn.sbx0.todo.utils.JSON;
import jakarta.annotation.Resource;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.util.CollectionUtils;
import org.springframework.util.StringUtils;

import java.util.List;

/**
 * @author sbx0
 * @since 2023/3/3
 */
@Slf4j
@Component
public class ServerScheduled {
    @Resource
    private CarConfigService carConfigService;
    @Resource
    private CarPlatePhotoService carPlatePhotoService;

    // 30min @Scheduled(fixedRate = 1800000)
    // 1min @Scheduled(fixedRate = 60000)
    @Scheduled(fixedRate = 1800000)
    public void getCarPlatePhoto() {
        DefaultPagingRequest pagingRequest = new DefaultPagingRequest();
        pagingRequest.setPage(1);
        pagingRequest.setPageSize(1);
        Paging<CarConfig> paging = carConfigService.paging(pagingRequest);
        if (paging != null && paging.getSuccess()) {
            List<CarConfig> data = paging.getData();
            if (!CollectionUtils.isEmpty(data)) {
                CarConfig carConfig = data.get(0);
                ApiParam param = new ApiParam(carConfig.getLotId(), carConfig.getCarPlateNum());
                String response = CallApi.post(carConfig.getApiHost(), carConfig.getApiPath(), JSON.parse(param));
                CarPlatePhotoResponse carPlatePhoto = JSON.format(response, CarPlatePhotoResponse.class);
                String lastPhoto = carPlatePhotoService.getLastPhoto();
                CarPlatePhotoResponse.ResponseData responseData = carPlatePhoto.getData();
                if (responseData != null) {
                    CarPlatePhotoResponse.ResponseData.CarPlaceInfo carPlaceInfo = responseData.getCarPlaceInfo();
                    if (carPlaceInfo != null) {
                        String latestPhoto = carPlaceInfo.getImgUrl();
                        if (StringUtils.hasText(latestPhoto)) {
                            if (!latestPhoto.equals(lastPhoto)) {
                                CarPlatePhoto newPhoto = new CarPlatePhoto();
                                newPhoto.setCarPlateNum(carPlaceInfo.getCarPlateNum());
                                newPhoto.setLotName(carPlaceInfo.getLotName());
                                newPhoto.setFloorName(carPlaceInfo.getFloorInfo().getFloorName());
                                newPhoto.setParkNo(carPlaceInfo.getParkNo());
                                newPhoto.setImgUrl(carPlaceInfo.getImgUrl());
                                newPhoto.setAreaName(carPlaceInfo.getAreaName());
                                carPlatePhotoService.save(newPhoto);
                                log.info("car plate photo has changed. [" + newPhoto.getImgUrl() + "]");
                            }
                        }
                    }
                }
            }
        }
    }

    @Data
    @AllArgsConstructor
    public static class ApiParam {
        private String lotId;
        private String carPlateNum;
    }
}
