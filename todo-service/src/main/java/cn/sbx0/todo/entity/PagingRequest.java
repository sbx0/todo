package cn.sbx0.todo.entity;

import lombok.*;

import java.util.List;

/**
 * @author sbx0
 * @since 2022/12/8
 */
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class PagingRequest {

    protected Integer page;
    protected Integer pageSize;

    List<OrderRequest> orders;

    public PagingRequest(Integer page, Integer pageSize) {
        this.page = page;
        this.pageSize = pageSize;
    }
}
