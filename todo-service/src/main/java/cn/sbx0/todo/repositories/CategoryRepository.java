package cn.sbx0.todo.repositories;

import cn.sbx0.todo.business.category.CategoryEntity;
import cn.sbx0.todo.business.category.CategoryEntitySimple;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Set;

/**
 * @author sbx0
 * @since 2022/12/8
 */
public interface CategoryRepository extends JpaRepository<CategoryEntity, Long> {

    //language=MySQL
    String CUSTOM_UPDATE_SQL = """
            UPDATE categories
            SET category_name   = :#{#entity.categoryName},
                category_remark = :#{#entity.categoryRemark}
            WHERE id = :#{#entity.id}
                  """;

    @Modifying
    @Query(value = CUSTOM_UPDATE_SQL, nativeQuery = true)
    void customUpdate(CategoryEntity entity);

    @Query(value = "SELECT new cn.sbx0.todo.business.category.CategoryEntitySimple(id, categoryName) FROM CategoryEntity WHERE id IN :ids")
    List<CategoryEntitySimple> mapByIds(Set<Long> ids);
}
