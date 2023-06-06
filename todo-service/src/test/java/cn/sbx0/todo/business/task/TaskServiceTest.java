package cn.sbx0.todo.business.task;

import cn.sbx0.todo.business.category.CategoryService;
import cn.sbx0.todo.business.task.entity.TaskEntity;
import cn.sbx0.todo.business.task.entity.TaskPagingRequest;
import cn.sbx0.todo.business.user.ClientUserService;
import cn.sbx0.todo.business.weixin.WeChatService;
import cn.sbx0.todo.entity.StatisticalIndicators;
import cn.sbx0.todo.repositories.TaskRepository;
import cn.sbx0.todo.service.common.Code;
import cn.sbx0.todo.service.common.Paging;
import cn.sbx0.todo.service.common.Paging.PagingCommon;
import cn.sbx0.todo.service.common.Result;
import jakarta.annotation.Resource;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentMatchers;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.context.SpringBootTest.WebEnvironment;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.util.CollectionUtils;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.BDDMockito.given;

/**
 * @author sbx0
 * @since 2022/12/1
 */
@MockBean(classes = {TaskRepository.class, ClientUserService.class, WeChatService.class, CategoryService.class})
@SpringBootTest(webEnvironment = WebEnvironment.NONE, classes = {TaskService.class})
class TaskServiceTest {

    @Autowired
    private TaskService service;

    @Resource
    private TaskRepository repository;

    @Resource
    private ClientUserService userService;

    @Test
    public void handleReminderTimeWithNullTasks() {
        given(repository.getHaveReminderTimeTask()).willReturn(null);

        service.handleReminderTime();
    }

    @Test
    public void handleReminderTimeWithEmptyTasks() {
        TaskService.REMINDER_IDS.add(1L);
        assertNotNull(TaskService.REMINDER_IDS);
        assertFalse(CollectionUtils.isEmpty(TaskService.REMINDER_IDS));
        assertEquals(1, TaskService.REMINDER_IDS.size());

        given(repository.getHaveReminderTimeTask()).willReturn(Collections.EMPTY_LIST);

        service.handleReminderTime();
        assertNotNull(TaskService.REMINDER_IDS);
        assertTrue(CollectionUtils.isEmpty(TaskService.REMINDER_IDS));
        assertEquals(0, TaskService.REMINDER_IDS.size());

        TaskService.REMINDER_IDS.clear();
    }

    @Test
    public void handleReminderTimeWithTasks() {
        TaskService.REMINDER_IDS.add(1L);
        assertNotNull(TaskService.REMINDER_IDS);
        assertFalse(CollectionUtils.isEmpty(TaskService.REMINDER_IDS));
        assertEquals(1, TaskService.REMINDER_IDS.size());

        List<TaskEntity> tasks = new ArrayList<>();
        tasks.add(TaskEntity.builder()
                .id(1L)
                .reminderTime(LocalDateTime.now())
                .build());

        given(userService.findWeChatOpenIdById(2L)).willReturn("2toUser");

        tasks.add(TaskEntity.builder()
                .id(2L)
                .userId(2L)
                .taskName("taskName")
                .reminderTime(LocalDateTime.now())
                .planTime(LocalDateTime.now())
                .build());

        tasks.add(TaskEntity.builder()
                .id(3L)
                .userId(3L)
                .reminderTime(LocalDateTime.now())
                .build());

        given(repository.getHaveReminderTimeTask()).willReturn(tasks);

        service.handleReminderTime();
        assertNotNull(TaskService.REMINDER_IDS);
        assertFalse(CollectionUtils.isEmpty(TaskService.REMINDER_IDS));
        assertEquals(2, TaskService.REMINDER_IDS.size());

        TaskService.REMINDER_IDS.clear();
    }

    @Test
    public void statistics() {
        given(userService.getLoginUserId()).willReturn(1L);

        given(repository.completedStatistical(anyLong(), anyLong())).willReturn(1L);
        given(repository.uncompletedStatistical(anyLong(), anyLong())).willReturn(2L);

        Result<List<StatisticalIndicators>> result = service.statistics(1L);
        assertNotNull(result);
        assertTrue(result.getSuccess());
        assertEquals(Code.SUCCESS, result.getCode());

        List<StatisticalIndicators> data = result.getData();
        assertNotNull(data);
        assertFalse(CollectionUtils.isEmpty(data));
        assertEquals(2, data.size());
        StatisticalIndicators completed = data.get(0);
        assertEquals(1L, completed.getValue());
        StatisticalIndicators uncompleted = data.get(1);
        assertEquals(2L, uncompleted.getValue());
    }

    @Test
    public void paging() {
        TaskPagingRequest pagingRequest = new TaskPagingRequest(1, 1);

        List<TaskEntity> data = new ArrayList<>();
        data.add(new TaskEntity("test"));
        Page<TaskEntity> pagingData = new PageImpl<>(data,
                Paging.build(pagingRequest.getPage(), pagingRequest.getPageSize()),
                data.size()
        );
        given(repository.pagingOrderByPlanTime(any(), ArgumentMatchers.any(Pageable.class))).willReturn(pagingData);
        given(repository.pagingOrderByUpdateTime(any(), ArgumentMatchers.any(Pageable.class))).willReturn(pagingData);

        Paging<TaskEntity> paging = service.paging(pagingRequest);
        assertNotNull(paging);
        assertTrue(paging.getSuccess());
        assertEquals(Code.SUCCESS, paging.getCode());

        PagingCommon common = paging.getCommon();
        assertNotNull(common);
        assertEquals(pagingRequest.getPage(), common.getPage());
        assertEquals(pagingRequest.getPageSize(), common.getPageSize());
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
    void update() {
        // id is null
        TaskEntity entity = new TaskEntity("test");
        given(repository.save(any())).willReturn(entity);

        Result<TaskEntity> result = service.update(entity);
        assertNotNull(result);
        assertFalse(result.getSuccess());
        assertEquals(Code.FAILED, result.getCode());

        assertNull(result.getData());

        // id is 1L after save
        Long id = 1L;
        entity.setId(id);
        given(repository.save(any())).willReturn(entity);

        result = service.update(entity);
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
