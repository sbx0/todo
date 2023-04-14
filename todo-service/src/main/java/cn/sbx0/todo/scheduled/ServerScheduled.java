package cn.sbx0.todo.scheduled;

import cn.sbx0.todo.business.chatgpt.ChatGPTService;
import cn.sbx0.todo.business.sse.SSEService;
import cn.sbx0.todo.business.task.TaskService;
import jakarta.annotation.Resource;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

/**
 * @author sbx0
 * @since 2023/3/3
 */
@Slf4j
@Component
public class ServerScheduled {
    @Resource
    private ChatGPTService chatGPTService;
    @Resource
    private TaskService taskService;
    @Resource
    private SSEService sseService;

    @Scheduled(fixedRate = 1000)
    public void handleReminderTime() {
        taskService.handleReminderTime();
    }

    @Scheduled(fixedRate = 1000)
    public void handleMessage() {
        chatGPTService.handleMessage();
    }

    @Scheduled(fixedRate = 1000)
    public void sendMessage() {
        chatGPTService.sendMessage();
    }

    @Scheduled(fixedRate = 1000)
    public void heartbeat() {
        sseService.heartbeat();
    }
}
