package cn.sbx0.todo.entity;

/**
 * @author sbx0
 * @since 2022/12/8
 */
public class DefaultPagingRequest extends PagingRequest {

  public DefaultPagingRequest() {
  }

  public DefaultPagingRequest(Integer page, Integer pageSize) {
    super(page, pageSize);
  }
}
