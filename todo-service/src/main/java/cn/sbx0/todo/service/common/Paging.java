package cn.sbx0.todo.service.common;

import java.util.List;
import lombok.Getter;
import lombok.Setter;
import org.springframework.data.domain.PageRequest;

/**
 * @author sbx0
 * @since 2022/12/1
 */
@Getter
@Setter
public class Paging<T> {

  private Integer code;
  private Boolean success;
  private String message;
  private List<T> data;
  private PagingCommon common;

  public static <T> Paging<T> success(
      List<T> data,
      int page,
      int pageSize,
      long total,
      long totalPage
  ) {
    Paging<T> result = new Paging<>();
    result.setCode(Code.SUCCESS);
    result.setSuccess(true);
    result.setData(data);
    result.setCommon(new PagingCommon(page, pageSize, total, totalPage));
    return result;
  }

  public static PageRequest build(int page, int pageSize) {
    return PageRequest.of(
        adjustPage(page),
        adjustPageSize(pageSize)
    );
  }

  public static int adjustPage(int page) {
    if (page < 1) {
      page = 1;
    }
    if (page > 10000) {
      page = 10000;
    }
    return page - 1;
  }

  public static int adjustPageSize(int pageSize) {
    if (pageSize < 1) {
      pageSize = 1;
    }
    if (pageSize > 1000) {
      pageSize = 1000;
    }
    return pageSize;
  }

  @Getter
  @Setter
  public static class PagingCommon {

    private Integer page;
    private Integer pageSize;
    private Long total;
    private Long totalPage;

    public PagingCommon() {
    }

    public PagingCommon(Integer page, Integer pageSize, Long total, Long totalPage) {
      this.page = page;
      this.pageSize = pageSize;
      this.total = total;
      this.totalPage = totalPage;
    }
  }
}
