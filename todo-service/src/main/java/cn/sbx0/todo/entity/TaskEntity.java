package cn.sbx0.todo.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import java.time.LocalDateTime;
import lombok.Getter;
import lombok.Setter;

/**
 * @author sbx0
 * @since 2022/12/1
 */
@Getter
@Setter
@Entity
public class TaskEntity {

  @Id
  @GeneratedValue(strategy = GenerationType.AUTO)
  private Long id;
  // task name
  private String taskName;
  // task remark
  private String taskRemark;
  // task status
  private Integer taskStatus;
  // plan time
  private LocalDateTime planTime;
  // when create
  private LocalDateTime createTime;
  // when update
  private LocalDateTime updateTime;
}
