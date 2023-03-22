package cn.sbx0.todo.business.chatgpt;

import cn.sbx0.todo.business.weixin.WeixinService;
import cn.sbx0.todo.business.weixin.WinXinMessage;
import com.plexpt.chatgpt.ChatGPT;
import com.plexpt.chatgpt.util.Proxys;
import jakarta.annotation.Resource;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Service;

import java.net.Proxy;
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
    private final Proxy PROXY = Proxys.http("win.sbx0.cn", 11114);
    @Lazy
    @Resource
    private WeixinService weixinService;
    @Value("${chatgpt.api-key}")
    private String apiKey;
    private ChatGPT chatGPT;

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
            log.info("send message to chatgpt:" + message.getMessage());
            if (chatGPT == null) {
                chatGPT = ChatGPT.builder()
                        .apiKey(apiKey)
                        .proxy(PROXY)
                        .apiHost("https://api.openai.com/")
                        .build()
                        .init();
            }
            String response = chatGPT.chat(message.getMessage());
            log.info("receive message from chatgpt:" + response);
            message.setHandled(true);
            message.setResponse(response);
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
        WinXinMessage winXinMessage = new WinXinMessage();
        winXinMessage.setMsgtype("text");
        winXinMessage.setTouser(message.getUser());
        winXinMessage.setText(new WinXinMessage.WinXinMessageContext(message.getMessage()));
        log.info("send message to user " + message.getUser() + " " + message.getMessage());
        weixinService.sendMessage(winXinMessage);
    }
}
