package cn.sbx0.todo.business.car;

import cn.sbx0.todo.business.car.entity.CarConfig;
import cn.sbx0.todo.entity.OrderRequest;
import cn.sbx0.todo.entity.PagingRequest;
import cn.sbx0.todo.repositories.CarConfigRepository;
import cn.sbx0.todo.service.JpaService;
import cn.sbx0.todo.service.common.Paging;
import jakarta.annotation.Resource;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

/**
 * @author sbx0
 * @since 2022/12/1
 */
@Slf4j
@Service
public class CarConfigService extends JpaService<CarConfigRepository, CarConfig, Long> {
    public static final List<Sort.Order> ORDERS = List.of(Sort.Order.desc("id"));
    @Resource
    private CarConfigRepository repository;

    @Override
    protected CarConfigRepository repository() {
        return this.repository;
    }

    @Override
    protected Long getId(CarConfig carConfig) {
        return carConfig.getId();
    }

    @Override
    protected CarConfig saveBefore(CarConfig carConfig) {
        carConfig.setCreateTime(LocalDateTime.now());
        return carConfig;
    }

    @Override
    public <C extends PagingRequest> Paging<CarConfig> paging(C pagingRequest) {
        List<Sort.Order> orders;
        if (CollectionUtils.isEmpty(pagingRequest.getOrders())) {
            // default order when empty
            orders = ORDERS;
        } else {
            orders = new ArrayList<>();
            List<OrderRequest> requestOrders = pagingRequest.getOrders();
            for (OrderRequest requestOrder : requestOrders) {
                // todo check the parameter name is legitimate
                if (requestOrder.getDirection().equals("desc")) {
                    orders.add(Sort.Order.desc(requestOrder.getName()));
                } else {
                    orders.add(Sort.Order.asc(requestOrder.getName()));
                }
            }
        }
        Page<CarConfig> pagingData = repository.paging(pagingRequest, Paging.build(
                pagingRequest.getPage(), pagingRequest.getPageSize(), Sort.by(orders)
        ));
        return Paging.success(
                pagingData.getContent(),
                pagingData.getPageable().getPageNumber(),
                pagingData.getPageable().getPageSize(),
                pagingData.getTotalElements(),
                pagingData.getTotalPages()
        );
    }
}
