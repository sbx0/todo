package cn.sbx0.todo.business.car;

import cn.sbx0.todo.business.car.entity.CarConfig;
import cn.sbx0.todo.business.task.entity.TaskEntity;
import cn.sbx0.todo.entity.OrderRequest;
import cn.sbx0.todo.entity.PagingRequest;
import cn.sbx0.todo.repositories.CarConfigRepository;
import cn.sbx0.todo.service.JpaService;
import cn.sbx0.todo.service.common.Paging;
import cn.sbx0.todo.service.common.Result;
import jakarta.annotation.Resource;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.CollectionUtils;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

/**
 * @author sbx0
 * @since 2022/12/1
 */
@Slf4j
@Service
public class CarConfigService implements JpaService<CarConfig, Long> {
    public static final List<Sort.Order> ORDERS = Arrays.asList(Sort.Order.desc("id"));

    @Resource
    private CarConfigRepository repository;

    @Override
    @Transactional(rollbackFor = Exception.class)
    public Result<CarConfig> save(CarConfig entity) {
        if (entity == null) {
            return Result.failed();
        }
        entity.setCreateTime(LocalDateTime.now());
        entity = repository.save(entity);
        if (entity.getId() != null) {
            return Result.success(entity);
        } else {
            return Result.failed();
        }
    }

    @Override
    public Result<CarConfig> update(CarConfig entity) {
        if (entity == null || entity.getId() == null) {
            return Result.failed();
        }
        repository.save(entity);
        return Result.success(entity);
    }

    @Override
    public Result<CarConfig> findById(Long id) {
        Optional<CarConfig> result = repository.findById(id);
        return result.map(Result::success).orElseGet(Result::failed);
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

    @Override
    public Result<Void> deleteById(Long id) {
        repository.deleteById(id);
        return Result.success();
    }
}
