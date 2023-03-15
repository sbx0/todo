package cn.sbx0.todo.business.category;

import cn.sbx0.todo.entity.PagingRequest;
import cn.sbx0.todo.repositories.CategoryRepository;
import cn.sbx0.todo.service.JpaServiceImpl;
import cn.sbx0.todo.service.common.Paging;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Sort;
import org.springframework.data.domain.Sort.Order;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

/**
 * @author sbx0
 * @since 2022/12/8
 */
@Slf4j
@Service
public class CategoryService extends JpaServiceImpl<CategoryRepository, CategoryEntity, Long> {
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
    public <DefaultPagingRequest extends PagingRequest> Paging<CategoryEntity> paging(
            DefaultPagingRequest pagingRequest
    ) {
        Page<CategoryEntity> pagingData = r.findAll(Paging.build(
                pagingRequest.getPage(), pagingRequest.getPageSize(),
                Sort.by(Order.asc("id"))
        ));
        return Paging.success(
                pagingData.getContent(),
                pagingData.getPageable().getPageNumber(),
                pagingData.getPageable().getPageSize(),
                pagingData.getTotalElements(),
                pagingData.getTotalPages()
        );
    }
}
