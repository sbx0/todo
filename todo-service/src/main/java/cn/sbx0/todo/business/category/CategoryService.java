package cn.sbx0.todo.business.category;

import cn.sbx0.todo.entity.DefaultPagingRequest;
import cn.sbx0.todo.repositories.CategoryRepository;
import cn.sbx0.todo.service.JpaService;
import cn.sbx0.todo.service.common.Paging;
import jakarta.annotation.Resource;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

/**
 * @author sbx0
 * @since 2022/12/8
 */
@Slf4j
@Service
public class CategoryService extends JpaService<CategoryRepository, CategoryEntity, Long, DefaultPagingRequest> {
    public static final CategoryEntity ALL = new CategoryEntity(0L, "全部");
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

    @Override
    public Paging<CategoryEntity> paging(DefaultPagingRequest pagingRequest) {
        Paging<CategoryEntity> paging = super.paging(pagingRequest);
        List<CategoryEntity> data = paging.getData();
        List<CategoryEntity> newData = new ArrayList<>();
        newData.add(ALL);
        newData.addAll(data);
        paging.setData(newData);
        return paging;
    }

    public Map<Long, String> mapByIds(Set<Long> ids) {
        List<CategoryEntitySimple> categories = repository().mapByIds(ids);
        return categories.stream().collect(Collectors.toMap(CategoryEntitySimple::getId, CategoryEntitySimple::getCategoryName, (a, b) -> b));
    }
}
