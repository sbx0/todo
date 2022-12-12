package cn.sbx0.todo.repositories;

import cn.sbx0.todo.entity.PagingRequest;
import cn.sbx0.todo.entity.TaskEntity;
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
                or (:#{#pagingRequest.taskStatus} >= 0 and task_status = :#{#pagingRequest.taskStatus}))""";
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
}
