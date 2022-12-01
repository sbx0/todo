package cn.sbx0.todo.service;

import cn.sbx0.todo.entity.TaskEntity;
import cn.sbx0.todo.repositories.TaskCrudRepository;
import cn.sbx0.todo.repositories.TaskPagingRepository;
import cn.sbx0.todo.service.common.IBaseService;
import cn.sbx0.todo.service.common.Paging;
import cn.sbx0.todo.service.common.Result;
import jakarta.annotation.Resource;
import java.util.List;
import java.util.Optional;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Service;

/**
 * @author sbx0
 * @since 2022/12/1
 */
@Slf4j
@Service
public class TaskServiceImpl implements IBaseService<TaskEntity, Long> {

  @Resource
  private TaskCrudRepository crudRepository;
  @Resource
  private TaskPagingRepository pagingRepository;

  @Override
  public Paging<List<TaskEntity>> paging(int page, int pageSize) {
    Page<TaskEntity> pagingData = pagingRepository.findAll(Paging.build(page, pageSize));
    return Paging.success(
        pagingData.getContent(),
        pagingData.getPageable().getPageNumber(),
        pagingData.getPageable().getPageSize(),
        pagingData.getTotalPages(),
        pagingData.getTotalElements()
    );
  }

  @Override
  public Result<Long> save(TaskEntity entity) {
    TaskEntity result = crudRepository.save(entity);
    if (result.getId() != null) {
      return Result.success(result.getId());
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
