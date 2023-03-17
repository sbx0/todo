package cn.sbx0.todo.business.category;

import cn.sbx0.todo.entity.DefaultPagingRequest;
import cn.sbx0.todo.repositories.CategoryRepository;
import cn.sbx0.todo.service.JpaService;
import jakarta.annotation.Resource;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

/**
 * @author sbx0
 * @since 2022/12/8
 */
@Slf4j
@Service
public class CategoryService extends JpaService<CategoryRepository, CategoryEntity, Long, DefaultPagingRequest> {
    @Resource
    private CategoryRepository repository;

    @Override
    protected CategoryRepository repository() {
        return this.repository;
    }

    @Override
    protected Long getId(CategoryEntity categoryEntity) {
        return categoryEntity.getId();
    }

    @Override
    protected CategoryEntity saveBefore(CategoryEntity categoryEntity) {
        categoryEntity.setCreateTime(LocalDateTime.now());
        return categoryEntity;
    }

    @Override
    protected CategoryEntity updateBefore(CategoryEntity entity) {
        entity.setUpdateTime(LocalDateTime.now());
        return entity;
    }
}
