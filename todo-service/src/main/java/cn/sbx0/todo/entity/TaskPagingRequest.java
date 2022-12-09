package cn.sbx0.todo.entity;

import lombok.Getter;
import lombok.Setter;

/**
 * @author sbx0
 * @since 2022/12/8
 */
@Getter
@Setter
public class TaskPagingRequest extends PagingRequest {

  // category id
  private Long categoryId;

  public TaskPagingRequest() {
  }

  public TaskPagingRequest(Integer page, Integer pageSize) {
    super(page, pageSize);
  }
}
