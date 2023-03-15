package cn.sbx0.todo.business.category;

import cn.sbx0.todo.repositories.CategoryRepository;
import cn.sbx0.todo.service.JpaService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

/**
 * @author sbx0
 * @since 2022/12/8
 */
@Slf4j
@Service
public class CategoryService extends JpaService<CategoryRepository, CategoryEntity, Long> {
    @Override
    protected Long getId(CategoryEntity categoryEntity) {
        return categoryEntity.getId();
    }

    @Override
    protected CategoryEntity saveBefore(CategoryEntity categoryEntity) {
        categoryEntity.setCreateTime(LocalDateTime.now());
        return categoryEntity;
    }
}
