package cn.sbx0.todo.repositories;

import cn.sbx0.todo.entity.CategoryEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

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
}
