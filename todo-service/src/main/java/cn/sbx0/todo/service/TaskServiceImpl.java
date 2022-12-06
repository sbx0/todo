package cn.sbx0.todo.service;

import cn.sbx0.todo.entity.TaskEntity;
import cn.sbx0.todo.repositories.TaskRepository;
import cn.sbx0.todo.service.common.IBaseService;
import cn.sbx0.todo.service.common.Paging;
import cn.sbx0.todo.service.common.Result;
import jakarta.annotation.Resource;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import java.util.Optional;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * @author sbx0
 * @since 2022/12/1
 */
@Slf4j
@Service
public class TaskServiceImpl implements IBaseService<TaskEntity, Long> {

  @Resource
  private TaskRepository crudRepository;
  @PersistenceContext
  private EntityManager entityManager;

  @Override
  public Paging<TaskEntity> paging(int page, int pageSize) {
    Page<TaskEntity> pagingData = crudRepository.findAll(Paging.build(page, pageSize));
    return Paging.success(
        pagingData.getContent(),
        pagingData.getPageable().getPageNumber(),
        pagingData.getPageable().getPageSize(),
        pagingData.getTotalPages(),
        pagingData.getTotalElements()
    );
  }

  @Override
  @Transactional(rollbackFor = Exception.class)
  public Result<TaskEntity> save(TaskEntity entity) {
    entityManager.persist(entity);
    crudRepository.customSave(entity);
    if (entity.getId() != null) {
      return Result.success(entity);
    } else {
      return Result.failed();
    }
  }

  @Override
  public Result<TaskEntity> findById(Long id) {
    Optional<TaskEntity> result = crudRepository.findById(id);
    return result.map(Result::success).orElseGet(Result::failed);
  }

  @Override
  public Result<Void> deleteById(Long id) {
    crudRepository.deleteById(id);
    return Result.success();
  }
}
