package cn.sbx0.todo.business.task.entity;

import cn.sbx0.todo.entity.PagingRequest;
import lombok.Setter;

import java.util.Objects;

/**
 * @author sbx0
 * @since 2022/12/8
 */
@Setter
public class TaskPagingRequest extends PagingRequest {

    // category id
    private Long categoryId;
    // task status
    private Integer taskStatus;

    public Long getCategoryId() {
        return Objects.requireNonNullElse(this.categoryId, 0L);
    }

    public Integer getTaskStatus() {
        return Objects.requireNonNullElse(this.taskStatus, -1);
    }

    public TaskPagingRequest() {
    }

    public TaskPagingRequest(Integer page, Integer pageSize) {
        super(page, pageSize);
    }
}
