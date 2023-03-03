package cn.sbx0.todo.business.car;

import cn.sbx0.todo.business.car.entity.CarPlatePhoto;
import cn.sbx0.todo.business.task.entity.TaskEntity;
import cn.sbx0.todo.entity.OrderRequest;
import cn.sbx0.todo.entity.PagingRequest;
import cn.sbx0.todo.repositories.CarPlatePhotoRepository;
import cn.sbx0.todo.service.common.Paging;
import cn.sbx0.todo.service.common.Result;
import jakarta.annotation.Resource;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Sort;
import org.springframework.data.domain.Sort.Order;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

/**
 * @author sbx0
 * @since 2022/12/1
 */
@Slf4j
@Service
public class CarPlatePhotoService {

    // default order
    public static final List<Order> ORDERS = Arrays.asList(Order.desc("id"));
    @Resource
    private CarPlatePhotoRepository repository;

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
                pagingData.getPageable().getPageNumber(),
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
}
