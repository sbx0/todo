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

  //language=MySQL
  String CUSTOM_SAVE_SQL = """
      insert into tasks (task_name)
      values (:#{#entity.taskName})
            """;

  @Modifying
  @Query(value = CUSTOM_SAVE_SQL, nativeQuery = true)
  @Deprecated
  void customSave(TaskEntity entity);

  //language=MySQL
  String CUSTOM_UPDATE_SQL = """
      UPDATE tasks
      SET task_name   = :#{#entity.taskName},
          task_status = :#{#entity.taskStatus},
          plan_time   = :#{#entity.planTime},
          task_remark = :#{#entity.taskRemark}
      WHERE id = :#{#entity.id}
            """;

  @Modifying
  @Query(value = CUSTOM_UPDATE_SQL, nativeQuery = true)
  void customUpdate(TaskEntity entity);
}
