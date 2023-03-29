package cn.sbx0.todo.business.task;

import cn.sbx0.todo.business.task.entity.TaskEntity;
import cn.sbx0.todo.business.task.entity.TaskPagingRequest;
import cn.sbx0.todo.business.user.ClientUserService;
import cn.sbx0.todo.business.user.entity.ClientUser;
import cn.sbx0.todo.business.weixin.WeChatService;
import cn.sbx0.todo.business.weixin.entity.WeChatMessage;
import cn.sbx0.todo.entity.StatisticalIndicators;
import cn.sbx0.todo.repositories.TaskRepository;
import cn.sbx0.todo.service.JpaService;
import cn.sbx0.todo.service.common.Paging;
import cn.sbx0.todo.service.common.Result;
import jakarta.annotation.Resource;
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
    public static final Set<Long> REMINDER_DIS = new CopyOnWriteArraySet<>();
    @Resource
    private TaskRepository repository;
    @Resource
    private ClientUserService userService;
    @Resource
    private WeChatService weChatService;

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
                pagingData.getPageable().getPageNumber(),
                pagingData.getPageable().getPageSize(),
                pagingData.getTotalElements(),
                pagingData.getTotalPages()
        );
    }

    public void handleReminderTime() {
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime begin = now.minusMinutes(2);
        LocalDateTime end = now.plusMinutes(2);
        List<TaskEntity> tasks = repository.getHaveReminderTimeTask();
        tasks = tasks.stream().filter((t) -> t.getReminderTime().isAfter(begin) && t.getReminderTime().isBefore(end)).collect(Collectors.toList());
        if (CollectionUtils.isEmpty(tasks)) {
            if (!CollectionUtils.isEmpty(REMINDER_DIS)) {
                REMINDER_DIS.clear();
            }
            return;
        }
        Map<Long, String> userWeChatOpenIdCache = new HashMap<>();
        for (TaskEntity task : tasks) {
            if (REMINDER_DIS.contains(task.getId())) {
                continue;
            }
            String weChatOpenId = userWeChatOpenIdCache.get(task.getUserId());
            String toUser = null;
            if (StringUtils.hasText(weChatOpenId)) {
                toUser = weChatOpenId;
            } else {
                Result<ClientUser> clientUserResult = userService.findById(task.getUserId());
                if (clientUserResult.getSuccess()) {
                    ClientUser data = clientUserResult.getData();
                    if (data == null) {
                        log.error("client user not found");
                        continue;
                    }
                    if (StringUtils.hasText(data.getWeChatOpenId())) {
                        userWeChatOpenIdCache.put(data.getId(), data.getWeChatOpenId());
                        toUser = data.getWeChatOpenId();
                    }
                } else {
                    log.error("task id " + task.getId() + " can't find it user");
                }
            }
            if (StringUtils.hasText(toUser)) {
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
                REMINDER_DIS.add(task.getId());
            }
        }
    }
}
