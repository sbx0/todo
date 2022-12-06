package cn.sbx0.todo.repositories;

import cn.sbx0.todo.entity.TaskEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

/**
 * @author sbx0
 * @since 2022/12/1
 */
public interface TaskRepository extends JpaRepository<TaskEntity, Long> {

  @Modifying
  @Query(value = "insert into tasks (task_name) values (:#{#entity.taskName})", nativeQuery = true)
  void customSave(TaskEntity entity);

  @Modifying
  @Query(value = "UPDATE tasks\n"
      + "SET task_name   = :#{#entity.taskName}\n"
      + ", task_status = :#{#entity.taskStatus}\n"
      + ", plan_time   = :#{#entity.planTime}\n"
      + ", task_remark = :#{#entity.taskRemark}\n"
      + "WHERE id = :#{#entity.id}", nativeQuery = true)
  void customUpdate(TaskEntity entity);
}
