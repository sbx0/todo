package cn.sbx0.todo.repositories;

import cn.sbx0.todo.business.task.entity.TaskEntity;
import cn.sbx0.todo.entity.PagingRequest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

/**
 * @author sbx0
 * @since 2022/12/1
 */
public interface TaskRepository extends JpaRepository<TaskEntity, Long> {

    //language=MySQL
    String CUSTOM_UPDATE_SQL = """
            UPDATE tasks
            SET task_name   = :#{#entity.taskName},
                task_status = :#{#entity.taskStatus},
                plan_time   = :#{#entity.planTime},
                task_remark = :#{#entity.taskRemark}
            WHERE id = :#{#entity.id}""";

    @Modifying
    @Query(value = CUSTOM_UPDATE_SQL, nativeQuery = true)
    void customUpdate(TaskEntity entity);

    //language=MySQL
    String CUSTOM_PAGING_SQL = """
            SELECT id,
                   task_name,
                   task_remark,
                   task_status,
                   plan_time,
                   category_id,
                   create_time,
                   update_time
            FROM tasks
            where ((:#{#pagingRequest.categoryId} = 0)
                or (:#{#pagingRequest.categoryId} <> 0 and category_id = :#{#pagingRequest.categoryId}))
              and ((:#{#pagingRequest.taskStatus} < 0)
                or (:#{#pagingRequest.taskStatus} >= 0 and task_status = :#{#pagingRequest.taskStatus}))
            order by if(plan_time is null, '9999-12-31', plan_time), id desc
            """;
    //language=MySQL
    String CUSTOM_PAGING_COUNT_SQL = """
            SELECT COUNT(*)
            FROM tasks
            where ((:#{#pagingRequest.categoryId} = 0)
               or (:#{#pagingRequest.categoryId} <> 0 and category_id = :#{#pagingRequest.categoryId}))
                and ((:#{#pagingRequest.taskStatus} < 0)
               or (:#{#pagingRequest.taskStatus} >= 0 and task_status = :#{#pagingRequest.taskStatus}))""";

    @Query(value = CUSTOM_PAGING_SQL, countQuery = CUSTOM_PAGING_COUNT_SQL, nativeQuery = true)
    <T extends PagingRequest> Page<TaskEntity> paging(T pagingRequest, Pageable pageable);

    //language=MySQL
    String CUSTOM_COMPLETED_STATISTICAL = """
            SELECT COUNT(*)
            FROM tasks
            WHERE task_status = 1
              and ((?1 = 0) or (?1 <> 0 and category_id = ?1))""";

    @Query(value = CUSTOM_COMPLETED_STATISTICAL, nativeQuery = true)
    Long completedStatistical(Long categoryId);

    //language=MySQL
    String CUSTOM_UNCOMPLETED_STATISTICAL = """
            SELECT COUNT(*)
            FROM tasks
            WHERE task_status = 0
              and ((?1 = 0) or (?1 <> 0 and category_id = ?1))""";

    @Query(value = CUSTOM_UNCOMPLETED_STATISTICAL, nativeQuery = true)
    Long uncompletedStatistical(Long categoryId);
}
