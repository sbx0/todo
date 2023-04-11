package cn.sbx0.todo.business.chatgpt;

import cn.sbx0.todo.business.weixin.WeChatService;
import cn.sbx0.todo.business.weixin.entity.WeChatMessage;
import jakarta.annotation.Resource;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Service;

import java.util.concurrent.ArrayBlockingQueue;

/**
 * @author sbx0
 * @since 2023/3/22
 */
@Slf4j
@Service
public class ChatGPTService {
    private final Integer MAX_HANDLED = 15;
    private final ArrayBlockingQueue<ChatGPTMessage> RECEIVE_QUEUE = new ArrayBlockingQueue<>(MAX_HANDLED);
    private final ArrayBlockingQueue<ChatGPTMessage> SEND_QUEUE = new ArrayBlockingQueue<>(MAX_HANDLED * 2);
    @Lazy
    @Resource
    private WeChatService weChatService;
    @Value("${chatgpt.api-key}")
    private String apiKey;

    public Boolean addMessage(ChatGPTMessage message) {
        if (RECEIVE_QUEUE.size() == MAX_HANDLED) {
            return false;
        }
        RECEIVE_QUEUE.add(message);
        return true;
    }

    public void handleMessage() {
        if (RECEIVE_QUEUE.size() == 0) {
            return;
        }
        ChatGPTMessage message = RECEIVE_QUEUE.poll();
        if (message == null) {
            return;
        }
        if (!message.getHandled()) {
            message.setHandled(true);
            message.setResponse("余额不足");
            SEND_QUEUE.add(message);
        }
    }

    public void sendMessage() {
        if (SEND_QUEUE.size() == 0) {
            return;
        }
        ChatGPTMessage message = SEND_QUEUE.poll();
        if (message == null) {
            return;
        }
        WeChatMessage weChatMessage = new WeChatMessage();
        weChatMessage.setMsgtype("text");
        weChatMessage.setTouser(message.getUser());
        weChatMessage.setText(new WeChatMessage.WeChatMessageContext(message.getResponse()));
        weChatService.sendMessage(weChatMessage);
    }
}
