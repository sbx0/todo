package cn.sbx0.todo.business.task;

import cn.sbx0.todo.business.category.CategoryService;
import cn.sbx0.todo.business.task.entity.*;
import cn.sbx0.todo.business.user.ClientUserService;
import cn.sbx0.todo.business.weixin.WeChatService;
import cn.sbx0.todo.business.weixin.entity.WeChatMessage;
import cn.sbx0.todo.entity.IdParam;
import cn.sbx0.todo.entity.StatisticalIndicators;
import cn.sbx0.todo.repositories.TaskRepository;
import cn.sbx0.todo.service.JpaService;
import cn.sbx0.todo.service.common.Paging;
import cn.sbx0.todo.service.common.Result;
import jakarta.annotation.Resource;
import jakarta.transaction.Transactional;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;
import org.springframework.util.StringUtils;

import java.time.LocalDateTime;
import java.util.*;
import java.util.concurrent.CopyOnWriteArraySet;
import java.util.stream.Collectors;

/**
 * @author sbx0
 * @since 2022/12/1
 */
@Slf4j
@Service
public class TaskService extends JpaService<TaskRepository, TaskEntity, Long, TaskPagingRequest> {
    public static final Set<Long> REMINDER_IDS = new CopyOnWriteArraySet<>();
    public static final Double DEFAULT_POSITION = 5000.0;
    public static final Double STEP_POSITION = 2500.0;
    public static final double DENOMINATOR = 2.0;
    private final CategoryService categoryService;
    @Resource
    private TaskRepository repository;
    @Resource
    private ClientUserService userService;
    @Resource
    private WeChatService weChatService;

    public TaskService(CategoryService categoryService) {
        this.categoryService = categoryService;
    }


    @Override
    protected TaskRepository repository() {
        return this.repository;
    }

    @Override
    protected Long getId(TaskEntity taskEntity) {
        return taskEntity.getId();
    }

    @Override
    protected TaskEntity saveBefore(TaskEntity entity) {
        entity.setUserId(userService.getLoginUserId());
        entity.setTaskStatus(0);
        entity.setCreateTime(LocalDateTime.now());
        return entity;
    }

    @Override
    protected TaskEntity updateBefore(TaskEntity entity) {
        entity.setUserId(userService.getLoginUserId());
        entity.setUpdateTime(LocalDateTime.now());
        return entity;
    }

    /**
     * <p>Statistical</p>
     * <p>Unit Test is {@link  TaskServiceTest#statistics}</p>
     *
     * @return Statistical Indicators
     */
    public Result<List<StatisticalIndicators>> statistics(Long categoryId) {
        Long loginUserId = userService.getLoginUserId();
        List<StatisticalIndicators> list = new ArrayList<>();
        // completed
        StatisticalIndicators completed = new StatisticalIndicators();
        completed.setKey("completed");
        completed.setName("Completed");
        completed.setValue(repository.completedStatistical(categoryId, loginUserId));
        list.add(completed);
        // uncompleted
        StatisticalIndicators uncompleted = new StatisticalIndicators();
        uncompleted.setKey("uncompleted");
        uncompleted.setName("Uncompleted");
        uncompleted.setValue(repository.uncompletedStatistical(categoryId, loginUserId));
        list.add(uncompleted);
        return Result.success(list);
    }

    /**
     * <p>Task paging list</p>
     * <p>Unit Test is {@link  TaskServiceTest#paging}</p>
     *
     * @param pagingRequest pagingRequest
     * @return Task list
     */
    @Override
    public Paging<TaskEntity> paging(TaskPagingRequest pagingRequest) {
        Page<TaskEntity> pagingData;
        if (pagingRequest.getTaskStatus() == 0) {
            pagingData = repository.pagingOrderByPlanTime(pagingRequest, Paging.build(
                    pagingRequest.getPage(),
                    pagingRequest.getPageSize()
            ));
        } else {
            pagingData = repository.pagingOrderByUpdateTime(pagingRequest, Paging.build(
                    pagingRequest.getPage(),
                    pagingRequest.getPageSize()
            ));
        }
        return Paging.success(
                pagingData.getContent(),
                pagingData.getPageable().getPageNumber() + 1,
                pagingData.getPageable().getPageSize(),
                pagingData.getTotalElements(),
                pagingData.getTotalPages()
        );
    }

    public Paging<TaskView> pagingView(TaskPagingRequest pagingRequest) {
        Paging<TaskEntity> paging = this.paging(pagingRequest);
        return Paging.success(
                buildTaskView(paging.getData()),
                paging.getCommon().getPage(),
                paging.getCommon().getPageSize(),
                paging.getCommon().getTotal(),
                paging.getCommon().getTotalPage()
        );
    }

    public void handleReminderTime() {
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime begin = now.minusMinutes(2);
        LocalDateTime end = now.plusMinutes(2);
        List<TaskEntity> tasks = repository.getHaveReminderTimeTask();
        if (tasks == null) {
            log.error("task have reminder time list is null");
            return;
        }
        tasks = tasks.stream().filter((t) -> t.getReminderTime().isAfter(begin) && t.getReminderTime().isBefore(end)).collect(Collectors.toList());
        if (CollectionUtils.isEmpty(tasks)) {
            if (!CollectionUtils.isEmpty(REMINDER_IDS)) {
                REMINDER_IDS.clear();
            }
            return;
        }
        for (TaskEntity task : tasks) {
            if (REMINDER_IDS.contains(task.getId())) {
                continue;
            }
            String toUser = userService.findWeChatOpenIdById(task.getUserId());
            if (!StringUtils.hasText(toUser)) {
                continue;
            }
            String message = task.getTaskName() + " 尚未完成！";
            if (task.getPlanTime() != null) {
                message += "截至时间：" + task.getPlanTime();
            }
            WeChatMessage weChatMessage = new WeChatMessage();
            weChatMessage.setMsgtype("text");
            weChatMessage.setTouser(toUser);
            weChatMessage.setText(new WeChatMessage.WeChatMessageContext(message));
            log.info("send message to user " + weChatMessage.getTouser() + " " + weChatMessage.getText());
            weChatService.sendMessage(weChatMessage);
            REMINDER_IDS.add(task.getId());
        }
    }

    @Transactional
    public Result<Void> complete(IdParam param) {
        return Result.judge(repository().complete(param));
    }

    public Result<Void> sort(SortParam param) {
        Long currentId = param.getCurrentId();
        Optional<TaskEntity> taskEntityOptional = repository().findById(currentId);
        if (taskEntityOptional.isEmpty()) {
            return Result.failure("任务[" + currentId + "]不存在");
        }
        TaskEntity taskEntity = taskEntityOptional.get();
        taskEntity.setPrevId(param.getPrevId());
        taskEntity.setNextId(param.getNextId());
        if (param.getPrevId() == null && param.getNextId() == null) {
            // first and only
            taskEntity.setPosition(DEFAULT_POSITION);
        } else if (param.getPrevId() == null) {
            // first and not only
            Optional<TaskEntity> nextOptional = repository().findById(param.getNextId());
            if (nextOptional.isEmpty()) {
                return Result.failure("任务[" + param.getNextId() + "]不存在");
            }
            TaskEntity nextTask = nextOptional.get();
            taskEntity.setPosition(nextTask.getPosition() + STEP_POSITION);
        } else if (param.getNextId() == null) {
            // last and not only
            Optional<TaskEntity> prevOptional = repository().findById(param.getPrevId());
            if (prevOptional.isEmpty()) {
                return Result.failure("任务[" + param.getPrevId() + "]不存在");
            }
            TaskEntity prevTask = prevOptional.get();
            taskEntity.setPosition(prevTask.getPosition() - STEP_POSITION);
        } else {
            // center
            Optional<TaskEntity> prevOptional = repository().findById(param.getPrevId());
            if (prevOptional.isEmpty()) {
                return Result.failure("任务[" + param.getPrevId() + "]不存在");
            }
            TaskEntity prevTask = prevOptional.get();
            Optional<TaskEntity> nextOptional = repository().findById(param.getNextId());
            if (nextOptional.isEmpty()) {
                return Result.failure("任务[" + param.getNextId() + "]不存在");
            }
            TaskEntity nextTask = nextOptional.get();
            taskEntity.setPosition((prevTask.getPosition() + nextTask.getPosition()) / DENOMINATOR);
        }
        repository().save(taskEntity);
        return Result.success();
    }

    public List<TaskView> buildTaskView(List<TaskEntity> tasks) {
        Set<Long> categoryIds = new HashSet<>();
        Set<Long> userIds = new HashSet<>();
        for (TaskEntity task : tasks) {
            if (task.getCategoryId() != null) {
                categoryIds.add(task.getCategoryId());
            }
            if (task.getUserId() != null) {
                userIds.add(task.getUserId());
            }
        }
        Map<Long, String> categories = categoryService.mapByIds(categoryIds);
        Map<Long, String> users = userService.mapByIds(userIds);
        List<TaskView> newTasks = new ArrayList<>();
        for (TaskEntity task : tasks) {
            TaskView newTask = TaskMapper.INSTANCE.toView(
                    task,
                    users.getOrDefault(task.getUserId(), ""),
                    categories.getOrDefault(task.getCategoryId(), "")
            );
            newTasks.add(newTask);
        }
        return newTasks;
    }

    public Paging<TaskView> sortedPagingView(TaskSortedPagingRequest pagingRequest) {
        Paging<TaskEntity> paging = this.sortedPaging(pagingRequest);
        return Paging.success(
                buildTaskView(paging.getData()),
                paging.getCommon().getPage(),
                paging.getCommon().getPageSize(),
                paging.getCommon().getTotal(),
                paging.getCommon().getTotalPage()
        );
    }

    private Paging<TaskEntity> sortedPaging(TaskSortedPagingRequest pagingRequest) {
        Page<TaskEntity> pagingData = repository.sortedPaging(pagingRequest, Paging.build(
                pagingRequest.getPage(),
                pagingRequest.getPageSize()
        ));
        return Paging.success(
                pagingData.getContent(),
                pagingData.getPageable().getPageNumber() + 1,
                pagingData.getPageable().getPageSize(),
                pagingData.getTotalElements(),
                pagingData.getTotalPages()
        );
    }
}
