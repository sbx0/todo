package cn.sbx0.todo.business.task;

import cn.sbx0.todo.business.task.entity.TaskEntity;
import cn.sbx0.todo.entity.OrderRequest;
import cn.sbx0.todo.entity.PagingRequest;
import cn.sbx0.todo.entity.StatisticalIndicators;
import cn.sbx0.todo.repositories.TaskRepository;
import cn.sbx0.todo.service.JpaService;
import cn.sbx0.todo.service.common.Paging;
import cn.sbx0.todo.service.common.Result;
import jakarta.annotation.Resource;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Sort;
import org.springframework.data.domain.Sort.Order;
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
public class TaskService implements JpaService<TaskEntity, Long> {

    @Resource
    private TaskRepository repository;
    // default order
    public static final List<Order> ORDERS = Arrays.asList(Order.asc("task_status"), Order.desc("id"));

    /**
     * <p>Statistical</p>
     * <p>Unit Test is {@link  TaskServiceTest#statistics}</p>
     *
     * @return Statistical Indicators
     */
    public Result<List<StatisticalIndicators>> statistics(Long categoryId) {
        List<StatisticalIndicators> list = new ArrayList<>();
        // completed
        StatisticalIndicators completed = new StatisticalIndicators();
        completed.setKey("completed");
        completed.setName("Completed");
        completed.setValue(repository.completedStatistical(categoryId));
        list.add(completed);
        // uncompleted
        StatisticalIndicators uncompleted = new StatisticalIndicators();
        uncompleted.setKey("uncompleted");
        uncompleted.setName("Uncompleted");
        uncompleted.setValue(repository.uncompletedStatistical(categoryId));
        list.add(uncompleted);
        return Result.success(list);
    }

    /**
     * <p>Task paging list</p>
     * <p>Unit Test is {@link  TaskServiceTest#paging}</p>
     *
     * @param pagingRequest pagingRequest
     * @return Task list
     */
    @Override
    public <TaskPagingRequest extends PagingRequest> Paging<TaskEntity> paging(TaskPagingRequest pagingRequest) {
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
        Page<TaskEntity> pagingData = repository.paging(pagingRequest, Paging.build(
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

    /**
     * <p>Save</p>
     * <p>Unit Test is {@link  TaskServiceTest#save}</p>
     *
     * @param entity entity
     * @return new entity
     */
    @Override
    @Transactional(rollbackFor = Exception.class)
    public Result<TaskEntity> save(TaskEntity entity) {
        if (entity == null) {
            return Result.failed();
        }
        entity.setTaskStatus(0);
        entity.setCreateTime(LocalDateTime.now());
        entity = repository.save(entity);
        if (entity.getId() != null) {
            return Result.success(entity);
        } else {
            return Result.failed();
        }
    }

    /**
     * <p>Update</p>
     * <p>Unit Test is {@link  TaskServiceTest#update}</p>
     *
     * @param entity entity
     * @return new entity
     */
    @Override
    @Transactional(rollbackFor = Exception.class)
    public Result<TaskEntity> update(TaskEntity entity) {
        if (entity == null || entity.getId() == null) {
            return Result.failed();
        }
        repository.customUpdate(entity);
        return Result.success(entity);
    }

    @Override
    public Result<TaskEntity> findById(Long id) {
        Optional<TaskEntity> result = repository.findById(id);
        return result.map(Result::success).orElseGet(Result::failed);
    }

    @Override
    public Result<Void> deleteById(Long id) {
        repository.deleteById(id);
        return Result.success();
    }
}
