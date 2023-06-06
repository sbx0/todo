package cn.sbx0.todo.business.category;

import lombok.Getter;
import lombok.Setter;

/**
 * @author sbx0
 * @since 2023/6/6
 */
@Getter
@Setter
public class CategoryEntitySimple {
    private Long id;
    // category name
    private String categoryName;

    public CategoryEntitySimple() {
    }

    public CategoryEntitySimple(Long id, String categoryName) {
        this.id = id;
        this.categoryName = categoryName;
    }
}
