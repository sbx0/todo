package cn.sbx0.todo.business.task;

import cn.sbx0.todo.business.task.entity.TaskEntity;
import cn.sbx0.todo.business.task.entity.TaskPagingRequest;
import cn.sbx0.todo.business.user.ClientUserService;
import cn.sbx0.todo.entity.StatisticalIndicators;
import cn.sbx0.todo.service.common.Paging;
import cn.sbx0.todo.service.common.Result;
import jakarta.annotation.Resource;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * @author sbx0
 * @since 2022/12/2
 */
@Slf4j
@RestController
@RequestMapping(("/task"))
public class TaskController {

    @Resource
    private TaskService service;
    @Resource
    private ClientUserService userService;

    /**
     * <p>Statistical</p>
     * <p>Unit Test is {@link  TaskControllerTest#statistics}</p>
     *
     * @return Statistical Indicators
     */
    @GetMapping("/statistics")
    public Result<List<StatisticalIndicators>> statistics(@RequestParam(value = "categoryId", required = false) Long categoryId) {
        return service.statistics(categoryId);
    }

    /**
     * <p>Task paging list</p>
     * <p>Unit Test is {@link  TaskControllerTest#paging}</p>
     *
     * @param pagingRequest pagingRequest
     * @return Task list
     */
    @PostMapping("/paging")
    public Paging<TaskEntity> paging(@RequestBody TaskPagingRequest pagingRequest) {
        pagingRequest.setUserId(userService.getLoginUserId());
        return service.paging(pagingRequest);
    }

    /**
     * <p>Save</p>
     * <p>Unit Test is {@link  TaskControllerTest#save}</p>
     *
     * @param entity entity
     * @return new entity
     */
    @PostMapping("/save")
    public Result<TaskEntity> save(@RequestBody TaskEntity entity) {
        return service.save(entity);
    }

    /**
     * <p>Update</p>
     * <p>Unit Test is {@link  TaskControllerTest#update}</p>
     *
     * @param entity entity
     * @return new entity
     */
    @PostMapping("/update")
    public Result<TaskEntity> update(@RequestBody TaskEntity entity) {
        return service.update(entity);
    }
}
