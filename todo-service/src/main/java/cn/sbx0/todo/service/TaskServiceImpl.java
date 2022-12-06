package cn.sbx0.todo.service;

import cn.sbx0.todo.entity.TaskEntity;
import cn.sbx0.todo.repositories.TaskRepository;
import cn.sbx0.todo.service.common.IBaseService;
import cn.sbx0.todo.service.common.Paging;
import cn.sbx0.todo.service.common.Result;
import jakarta.annotation.Resource;
import java.time.LocalDateTime;
import java.util.Optional;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Sort;
import org.springframework.data.domain.Sort.Direction;
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
  private TaskRepository repository;

  @Override
  public Paging<TaskEntity> paging(int page, int pageSize) {
    Page<TaskEntity> pagingData = repository.findAll(Paging.build(
        page, pageSize, Sort.by(Direction.DESC, "id")
    ));
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
    entity.setTaskStatus(0);
    entity.setCreateTime(LocalDateTime.now());
    entity = repository.save(entity);
    if (entity.getId() != null) {
      return Result.success(entity);
    } else {
      return Result.failed();
    }
  }

  @Override
  public Result<TaskEntity> findById(Long id) {
    Optional<TaskEntity> result = repository.findById(id);
    return result.map(Result::success).orElseGet(Result::failed);
  }

  @Override
  public Result<Void> deleteById(Long id) {
    repository.deleteById(id);
    return Result.success();
  }
}
