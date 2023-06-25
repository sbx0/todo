package cn.sbx0.todo.business.task.entity;

import cn.sbx0.todo.entity.PagingRequest;
import lombok.Setter;

import java.util.Objects;

/**
 * @author sbx0
 * @since 2022/12/8
 */
@Setter
public class TaskSortedPagingRequest extends PagingRequest {

    // category id
    private Long categoryId;
    private Long userId;

    public TaskSortedPagingRequest() {
    }

    public TaskSortedPagingRequest(Integer page, Integer pageSize) {
        super(page, pageSize);
    }

    public Long getCategoryId() {
        return Objects.requireNonNullElse(this.categoryId, 0L);
    }

    public Long getUserId() {
        return Objects.requireNonNullElse(this.userId, 0L);
    }
}
