package cn.sbx0.todo.repositories;

import cn.sbx0.todo.entity.TaskEntity;
import org.springframework.data.repository.CrudRepository;

/**
 * @author sbx0
 * @since 2022/12/1
 */
public interface TaskCrudRepository extends CrudRepository<TaskEntity, Long> {

}
