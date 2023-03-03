package cn.sbx0.todo.scheduled;

import cn.sbx0.todo.business.car.CarConfigService;
import cn.sbx0.todo.business.car.CarPlatePhotoService;
import cn.sbx0.todo.business.car.entity.CarConfig;
import cn.sbx0.todo.entity.DefaultPagingRequest;
import cn.sbx0.todo.service.common.Paging;
import cn.sbx0.todo.utils.JSON;
import jakarta.annotation.Resource;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.util.CollectionUtils;

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

    // 30min @Scheduled(fixedRate = 1800000)
    // 1min @Scheduled(fixedRate = 60000)
    @Scheduled(fixedRate = 60000)
    public void getCarPlatePhoto() {
        DefaultPagingRequest pagingRequest = new DefaultPagingRequest();
        pagingRequest.setPage(1);
        pagingRequest.setPageSize(1);
        Paging<CarConfig> paging = carConfigService.paging(pagingRequest);
        if (paging != null && paging.getSuccess()) {
            List<CarConfig> data = paging.getData();
            if (!CollectionUtils.isEmpty(data)) {
                CarConfig carConfig = data.get(0);
                log.info(JSON.parse(carConfig));
            }
        }
    }
}
