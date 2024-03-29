package cn.sbx0.todo.repositories;

import cn.sbx0.todo.business.task.entity.TaskEntity;
import cn.sbx0.todo.entity.IdParam;
import cn.sbx0.todo.entity.PagingRequest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

/**
 * @author sbx0
 * @since 2022/12/1
 */
public interface TaskRepository extends JpaRepository<TaskEntity, Long> {

    @Modifying
    @Query(
            value = """
                    UPDATE tasks
                    SET task_name   = :#{#entity.taskName},
                        task_status = :#{#entity.taskStatus},
                        plan_time   = :#{#entity.planTime},
                        task_remark = :#{#entity.taskRemark}
                    WHERE id = :#{#entity.id}""",
            nativeQuery = true
    )
    void customUpdate(TaskEntity entity);

    @Query(
            value = """
                    SELECT *
                    FROM tasks
                    WHERE user_id = :#{#pagingRequest.userId}
                      AND position is null
                      AND ((:#{#pagingRequest.categoryId} = 0)
                        OR (:#{#pagingRequest.categoryId} <> 0 AND category_id = :#{#pagingRequest.categoryId}))
                      AND ((:#{#pagingRequest.taskStatus} < 0)
                        OR (:#{#pagingRequest.taskStatus} >= 0 AND task_status = :#{#pagingRequest.taskStatus}))
                    ORDER BY IF(plan_time IS NULL, '9999-12-31', plan_time), id DESC""",
            countQuery = """
                    SELECT COUNT(*)
                    FROM tasks
                    WHERE user_id = :#{#pagingRequest.userId}
                      AND position is null
                      AND ((:#{#pagingRequest.categoryId} = 0)
                        OR (:#{#pagingRequest.categoryId} <> 0 AND category_id = :#{#pagingRequest.categoryId}))
                      AND ((:#{#pagingRequest.taskStatus} < 0)
                        OR (:#{#pagingRequest.taskStatus} >= 0 AND task_status = :#{#pagingRequest.taskStatus}))""",
            nativeQuery = true
    )
    <T extends PagingRequest> Page<TaskEntity> pagingOrderByPlanTime(T pagingRequest, Pageable pageable);

    @Query(
            value = """
                    SELECT *
                    FROM tasks
                    WHERE user_id = :#{#pagingRequest.userId}
                      AND position is null
                      AND ((:#{#pagingRequest.categoryId} = 0)
                        OR (:#{#pagingRequest.categoryId} <> 0 AND category_id = :#{#pagingRequest.categoryId}))
                      AND ((:#{#pagingRequest.taskStatus} < 0)
                        OR (:#{#pagingRequest.taskStatus} >= 0 AND task_status = :#{#pagingRequest.taskStatus}))
                    ORDER BY IF(update_time IS NULL, '0000-01-31', update_time) DESC, id DESC""",
            countQuery = """
                    SELECT COUNT(*)
                    FROM tasks
                    WHERE user_id = :#{#pagingRequest.userId}
                      AND position is null
                      AND ((:#{#pagingRequest.categoryId} = 0)
                        OR (:#{#pagingRequest.categoryId} <> 0 AND category_id = :#{#pagingRequest.categoryId}))
                      AND ((:#{#pagingRequest.taskStatus} < 0)
                        OR (:#{#pagingRequest.taskStatus} >= 0 AND task_status = :#{#pagingRequest.taskStatus}))""",
            nativeQuery = true
    )
    <T extends PagingRequest> Page<TaskEntity> pagingOrderByUpdateTime(T pagingRequest, Pageable pageable);

    @Query(
            value = """
                    SELECT COUNT(*)
                    FROM tasks
                    WHERE task_status = 1
                      AND user_id = ?2
                      AND ((?1 = 0) or (?1 <> 0 AND category_id = ?1))""",
            nativeQuery = true
    )
    Long completedStatistical(Long categoryId, Long userId);

    @Query(
            value = """
                    SELECT COUNT(*)
                    FROM tasks
                    WHERE task_status = 0
                      AND user_id = ?2
                      AND ((?1 = 0) or (?1 <> 0 AND category_id = ?1))""",
            nativeQuery = true
    )
    Long uncompletedStatistical(Long categoryId, Long userId);

    @Query(
            value = """
                    SELECT *
                    FROM tasks
                    WHERE task_status = 0
                      AND reminder_time IS NOT NULL""",
            nativeQuery = true
    )
    List<TaskEntity> getHaveReminderTimeTask();

    @Modifying
    @Query(value = "UPDATE TaskEntity SET taskStatus = 1 WHERE id = :#{#param.id}")
    int complete(IdParam param);

    @Query(
            value = """
                    SELECT *
                    FROM tasks
                    WHERE task_status = 0
                      AND position is not null
                      AND user_id = :#{#pagingRequest.userId}
                      AND ((:#{#pagingRequest.categoryId} = 0)
                        OR (:#{#pagingRequest.categoryId} <> 0 AND category_id = :#{#pagingRequest.categoryId}))
                    ORDER BY position DESC""",
            countQuery = """
                    SELECT COUNT(*)
                    FROM tasks
                    WHERE task_status = 0
                      AND position is not null
                      AND user_id = :#{#pagingRequest.userId}
                      AND ((:#{#pagingRequest.categoryId} = 0)
                        OR (:#{#pagingRequest.categoryId} <> 0 AND category_id = :#{#pagingRequest.categoryId}))""",
            nativeQuery = true
    )
    <T extends PagingRequest> Page<TaskEntity> sortedPaging(T pagingRequest, Pageable pageable);
}
