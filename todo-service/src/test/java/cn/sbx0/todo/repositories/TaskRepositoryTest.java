package cn.sbx0.todo.repositories;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

import cn.sbx0.todo.entity.TaskEntity;
import java.util.List;
import java.util.Optional;
import lombok.extern.slf4j.Slf4j;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;

/**
 * @author sbx0
 * @since 2022/12/1
 */
@Slf4j
@DataJpaTest
class TaskRepositoryTest {

  @Autowired
  private TaskRepository repository;

  @Test
  public void testCRUD() {
    TaskEntity entity = new TaskEntity();
    entity.setTaskName("test1");
    repository.save(entity);
    entity = new TaskEntity();
    entity.setTaskName("test2");
    repository.save(entity);

    Page<TaskEntity> page = repository.findAll(PageRequest.of(0, 10));
    assertEquals(2L, page.getTotalElements());

    List<TaskEntity> content = page.getContent();
    entity = content.get(0);
    entity.setTaskName("test");
    repository.customUpdate(entity);

    page = repository.findAll(PageRequest.of(1, 10));
    assertEquals(2L, page.getTotalElements());

    Optional<TaskEntity> one = repository.findById(entity.getId());
    assertFalse(one.isEmpty());
    assertEquals("test", one.get().getTaskName());

    repository.delete(entity);
    one = repository.findById(entity.getId());
    assertTrue(one.isEmpty());
  }
}
