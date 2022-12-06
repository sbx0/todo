package cn.sbx0.todo.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.BDDMockito.given;

import cn.sbx0.todo.entity.TaskEntity;
import cn.sbx0.todo.repositories.TaskRepository;
import cn.sbx0.todo.service.common.Code;
import cn.sbx0.todo.service.common.Paging;
import cn.sbx0.todo.service.common.Paging.PagingCommon;
import cn.sbx0.todo.service.common.Result;
import jakarta.annotation.Resource;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentMatchers;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.context.SpringBootTest.WebEnvironment;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;

/**
 * @author sbx0
 * @since 2022/12/1
 */
@MockBean(classes = {TaskRepository.class})
@SpringBootTest(webEnvironment = WebEnvironment.NONE)
class TaskServiceImplTest {

  @Autowired
  private TaskServiceImpl service;

  @Resource
  private TaskRepository repository;

  @Test
  public void paging() {
    int page = 1;
    int pageSize = 10;

    List<TaskEntity> data = new ArrayList<>();
    data.add(new TaskEntity("test"));
    Page<TaskEntity> pagingData = new PageImpl<>(data, Paging.build(page, pageSize), data.size());
    given(repository.findAll(ArgumentMatchers.any(Pageable.class))).willReturn(pagingData);

    Paging<TaskEntity> paging = service.paging(page, pageSize);
    assertNotNull(paging);
    assertTrue(paging.getSuccess());
    assertEquals(Code.SUCCESS, paging.getCode());

    PagingCommon common = paging.getCommon();
    assertNotNull(common);
    assertEquals(Paging.adjustPage(page), common.getPage());
    assertEquals(Paging.adjustPageSize(pageSize), common.getPageSize());
    assertEquals(data.size(), common.getTotal());
  }

  @Test
  void save() {
    // id is null after save
    TaskEntity entity = new TaskEntity("test");
    given(repository.save(any())).willReturn(entity);

    Result<TaskEntity> result = service.save(entity);
    assertNotNull(result);
    assertFalse(result.getSuccess());
    assertEquals(Code.FAILED, result.getCode());

    assertNull(result.getData());

    // id is 1L after save
    Long id = 1L;
    entity.setId(id);
    given(repository.save(any())).willReturn(entity);

    result = service.save(entity);
    assertNotNull(result);
    assertTrue(result.getSuccess());
    assertEquals(Code.SUCCESS, result.getCode());
    assertEquals(id, result.getData().getId());
  }

  @Test
  void findById() {
    Long id = 1L;
    TaskEntity entity = new TaskEntity(id, "test");
    given(repository.findById(id)).willReturn(Optional.of(entity));

    Result<TaskEntity> result = service.findById(1L);
    assertNotNull(result);
    assertTrue(result.getSuccess());
    assertEquals(Code.SUCCESS, result.getCode());
    assertNotNull(result.getData());
    assertEquals(id, result.getData().getId());
    assertEquals(entity.getTaskName(), result.getData().getTaskName());
  }

  @Test
  void deleteById() {
    Long id = 1L;
    Result<Void> result = service.deleteById(id);
    assertNotNull(result);
    assertTrue(result.getSuccess());
    assertEquals(Code.SUCCESS, result.getCode());
  }
}
