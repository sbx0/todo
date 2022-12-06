package cn.sbx0.todo.controller;

import cn.sbx0.todo.entity.TaskEntity;
import cn.sbx0.todo.service.TaskServiceImpl;
import cn.sbx0.todo.service.common.Paging;
import cn.sbx0.todo.service.common.Result;
import jakarta.annotation.Resource;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

/**
 * @author sbx0
 * @since 2022/12/2
 */
@RestController
@RequestMapping(("/task"))
public class TaskController {

  @Resource
  private TaskServiceImpl service;

  /**
   * <p>Task paging list</p>
   * <p>Unit Test is {@link  TaskControllerTest#paging}</p>
   *
   * @param page     page
   * @param pageSize pageSize
   * @return Task list
   */
  @GetMapping("/paging")
  public Paging<TaskEntity> paging(
      @RequestParam(value = "page", required = false, defaultValue = "1") int page,
      @RequestParam(value = "pageSize", required = false, defaultValue = "10") int pageSize
  ) {
    return service.paging(page, pageSize);
  }

  /**
   * <p>Save</p>
   * <p>Unit Test is {@link  TaskControllerTest#save}</p>
   *
   * @param entity entity
   * @return ID
   */
  @PostMapping("/save")
  public Result<TaskEntity> save(@RequestBody TaskEntity entity) {
    return service.save(entity);
  }
}
