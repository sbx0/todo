package cn.sbx0.todo.service;

import cn.sbx0.todo.entity.CategoryEntity;
import cn.sbx0.todo.entity.PagingRequest;
import cn.sbx0.todo.repositories.CategoryRepository;
import cn.sbx0.todo.service.common.Paging;
import cn.sbx0.todo.service.common.Result;
import jakarta.annotation.Resource;
import java.time.LocalDateTime;
import java.util.Optional;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Sort;
import org.springframework.data.domain.Sort.Order;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * @author sbx0
 * @since 2022/12/8
 */
@Slf4j
@Service
public class CategoryService implements JpaService<CategoryEntity, Long> {

  @Resource
  private CategoryRepository repository;

  /**
   * <p>Category paging list</p>
   * <p>Unit Test is {@link  CategoryServiceTest#paging}</p>
   *
   * @param page     page
   * @param pageSize pageSize
   * @return Category list
   */
  @Override
  public <DefaultPagingRequest extends PagingRequest> Paging<CategoryEntity> paging(
      DefaultPagingRequest pagingRequest
  ) {
    Page<CategoryEntity> pagingData = repository.findAll(Paging.build(
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

  /**
   * <p>Save</p>
   * <p>Unit Test is {@link  CategoryServiceTest#save}</p>
   *
   * @param entity entity
   * @return new entity
   */
  @Override
  @Transactional(rollbackFor = Exception.class)
  public Result<CategoryEntity> save(CategoryEntity entity) {
    if (entity == null) {
      return Result.failed();
    }
    entity.setCreateTime(LocalDateTime.now());
    entity = repository.save(entity);
    if (entity.getId() != null) {
      return Result.success(entity);
    } else {
      return Result.failed();
    }
  }

  /**
   * <p>Update</p>
   * <p>Unit Test is {@link  CategoryServiceTest#update}</p>
   *
   * @param entity entity
   * @return new entity
   */
  @Override
  @Transactional(rollbackFor = Exception.class)
  public Result<CategoryEntity> update(CategoryEntity entity) {
    if (entity == null || entity.getId() == null) {
      return Result.failed();
    }
    repository.customUpdate(entity);
    return Result.success(entity);
  }

  @Override
  public Result<CategoryEntity> findById(Long id) {
    Optional<CategoryEntity> result = repository.findById(id);
    return result.map(Result::success).orElseGet(Result::failed);
  }

  @Override
  public Result<Void> deleteById(Long id) {
    repository.deleteById(id);
    return Result.success();
  }
}
