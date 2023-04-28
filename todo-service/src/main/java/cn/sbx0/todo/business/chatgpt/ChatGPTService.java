package cn.sbx0.todo.business.chatgpt;

import cn.sbx0.todo.business.weixin.WeChatService;
import cn.sbx0.todo.business.weixin.entity.WeChatMessage;
import com.theokanning.openai.completion.chat.ChatCompletionChoice;
import com.theokanning.openai.completion.chat.ChatCompletionRequest;
import com.theokanning.openai.completion.chat.ChatMessage;
import com.theokanning.openai.completion.chat.ChatMessageRole;
import com.theokanning.openai.service.OpenAiService;
import jakarta.annotation.Resource;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.concurrent.ArrayBlockingQueue;
import java.util.concurrent.atomic.AtomicReference;

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
    private OpenAiService openAiService;

    public void setOpenAiService(OpenAiService openAiService) {
        this.openAiService = openAiService;
    }

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
            final List<ChatMessage> messages = new ArrayList<>();
            log.info("ChatGPT receive = " + message.getMessage());
            final ChatMessage systemMessage = new ChatMessage(ChatMessageRole.USER.value(), message.getMessage().trim());
            messages.add(systemMessage);
            if (openAiService == null) {
                openAiService = new OpenAiService(apiKey);
            }
            ChatCompletionRequest chatCompletionRequest = ChatCompletionRequest
                    .builder()
                    .model("gpt-3.5-turbo")
                    .messages(messages)
                    .n(1)
                    .logitBias(new HashMap<>())
                    .stream(true)
                    .build();
            AtomicReference<String> response = new AtomicReference<>("");
            openAiService.streamChatCompletion(chatCompletionRequest).blockingForEach((one -> response.updateAndGet(v -> {
                AtomicReference<String> result = new AtomicReference<>("");
                List<ChatCompletionChoice> choices = one.getChoices();
                choices.forEach(choice -> result.updateAndGet(v1 -> {
                    String content = choice.getMessage().getContent();
                    if (content != null) {
                        return v1 + content;
                    } else {
                        return v1;
                    }
                }));
                return v + result;
            })));
            log.info("ChatGPT response = " + response);
            message.setResponse(response.toString().trim());
            message.setHandled(true);
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
