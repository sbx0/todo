package cn.sbx0.todo.controller;

import cn.sbx0.todo.entity.CategoryEntity;
import cn.sbx0.todo.service.CategoryService;
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
 * @since 2022/12/8
 */
@RestController
@RequestMapping(("/category"))
public class CategoryController {

  @Resource
  private CategoryService service;

  /**
   * <p>Category paging list</p>
   * <p>Unit Test is {@link  CategoryControllerTest#paging}</p>
   *
   * @param page     page
   * @param pageSize pageSize
   * @return Category list
   */
  @GetMapping("/paging")
  public Paging<CategoryEntity> paging(
      @RequestParam(value = "page", required = false, defaultValue = "1") int page,
      @RequestParam(value = "pageSize", required = false, defaultValue = "10") int pageSize
  ) {
    return service.paging(page, pageSize);
  }

  /**
   * <p>Save</p>
   * <p>Unit Test is {@link  CategoryControllerTest#save}</p>
   *
   * @param entity entity
   * @return new entity
   */
  @PostMapping("/save")
  public Result<CategoryEntity> save(@RequestBody CategoryEntity entity) {
    return service.save(entity);
  }

  /**
   * <p>Update</p>
   * <p>Unit Test is {@link  CategoryControllerTest#update}</p>
   *
   * @param entity entity
   * @return new entity
   */
  @PostMapping("/update")
  public Result<CategoryEntity> update(@RequestBody CategoryEntity entity) {
    return service.update(entity);
  }
}
