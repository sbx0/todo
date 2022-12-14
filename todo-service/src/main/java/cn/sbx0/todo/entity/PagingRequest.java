package cn.sbx0.todo.entity;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

/**
 * @author sbx0
 * @since 2022/12/8
 */
@Getter
@Setter
public class PagingRequest {

    protected Integer page;
    protected Integer pageSize;

    List<OrderRequest> orders;

    public PagingRequest() {
    }

    public PagingRequest(Integer page, Integer pageSize) {
        this.page = page;
        this.pageSize = pageSize;
    }
}
