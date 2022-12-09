package cn.sbx0.todo.controller;

import cn.sbx0.todo.entity.TaskEntity;
import cn.sbx0.todo.entity.TaskPagingRequest;
import cn.sbx0.todo.service.TaskService;
import cn.sbx0.todo.service.common.Paging;
import cn.sbx0.todo.service.common.Result;
import jakarta.annotation.Resource;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * @author sbx0
 * @since 2022/12/2
 */
@RestController
@RequestMapping(("/task"))
public class TaskController {

  @Resource
  private TaskService service;

  /**
   * <p>Task paging list</p>
   * <p>Unit Test is {@link  TaskControllerTest#paging}</p>
   *
   * @param pagingRequest pagingRequest
   * @return Task list
   */
  @PostMapping("/paging")
  public Paging<TaskEntity> paging(@RequestBody TaskPagingRequest pagingRequest) {
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
