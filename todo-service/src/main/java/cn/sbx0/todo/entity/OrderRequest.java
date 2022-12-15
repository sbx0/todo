package cn.sbx0.todo.entity;

import lombok.Getter;
import lombok.Setter;

/**
 * @author sbx0
 * @since 2022/12/15
 */
@Getter
@Setter
public class OrderRequest {
    private String name;
    private String direction;

    public OrderRequest() {
    }

    public OrderRequest(String name, String direction) {
        this.name = name;
        this.direction = direction;
    }
}
