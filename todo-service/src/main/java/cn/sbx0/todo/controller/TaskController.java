package cn.sbx0.todo.controller;

import cn.sbx0.todo.entity.TaskEntity;
import cn.sbx0.todo.service.TaskServiceImpl;
import cn.sbx0.todo.service.common.Paging;
import jakarta.annotation.Resource;
import org.springframework.web.bind.annotation.GetMapping;
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

  @GetMapping("/paging")
  public Paging<TaskEntity> paging(
      @RequestParam(value = "page", required = false, defaultValue = "1") int page,
      @RequestParam(value = "pageSize", required = false, defaultValue = "10") int pageSize
  ) {
    return service.paging(page, pageSize);
  }
}
