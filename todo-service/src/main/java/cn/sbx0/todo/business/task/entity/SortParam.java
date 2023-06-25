package cn.sbx0.todo.business.task.entity;

import lombok.Getter;
import lombok.Setter;

/**
 * @author sbx0
 * @since 2023/6/25
 */
@Getter
@Setter
public class SortParam {
    private Long prevId;
    private Long currentId;
    private Long nextId;
    private Boolean reset = false;
}
