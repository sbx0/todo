package cn.sbx0.todo.business.task;

import cn.sbx0.todo.business.task.entity.TaskEntity;
import cn.sbx0.todo.business.task.entity.TaskPagingRequest;
import cn.sbx0.todo.business.user.ClientUserService;
import cn.sbx0.todo.entity.StatisticalIndicators;
import cn.sbx0.todo.repositories.TaskRepository;
import cn.sbx0.todo.service.JpaService;
import cn.sbx0.todo.service.common.Paging;
import cn.sbx0.todo.service.common.Result;
import jakarta.annotation.Resource;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

/**
 * @author sbx0
 * @since 2022/12/1
 */
@Slf4j
@Service
public class TaskService extends JpaService<TaskRepository, TaskEntity, Long, TaskPagingRequest> {
    @Resource
    private TaskRepository repository;
    @Resource
    private ClientUserService userService;

    @Override
    protected TaskRepository repository() {
        return this.repository;
    }

    @Override
    protected Long getId(TaskEntity taskEntity) {
        return taskEntity.getId();
    }

    @Override
    protected TaskEntity saveBefore(TaskEntity entity) {
        entity.setUserId(userService.getLoginUserId());
        entity.setTaskStatus(0);
        entity.setCreateTime(LocalDateTime.now());
        return entity;
    }

    @Override
    protected TaskEntity updateBefore(TaskEntity entity) {
        entity.setUserId(userService.getLoginUserId());
        entity.setUpdateTime(LocalDateTime.now());
        return entity;
    }

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
    public Paging<TaskEntity> paging(TaskPagingRequest pagingRequest) {
        Page<TaskEntity> pagingData;
        if (pagingRequest.getTaskStatus() == 0) {
            pagingData = repository.pagingOrderByPlanTime(pagingRequest, Paging.build(
                    pagingRequest.getPage(),
                    pagingRequest.getPageSize()
            ));
        } else {
            pagingData = repository.pagingOrderByUpdateTime(pagingRequest, Paging.build(
                    pagingRequest.getPage(),
                    pagingRequest.getPageSize()
            ));
        }
        return Paging.success(
                pagingData.getContent(),
                pagingData.getPageable().getPageNumber(),
                pagingData.getPageable().getPageSize(),
                pagingData.getTotalElements(),
                pagingData.getTotalPages()
        );
    }
}
