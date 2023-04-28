package cn.sbx0.todo.business.chatgpt;

import cn.sbx0.todo.business.weixin.WeChatService;
import com.theokanning.openai.completion.chat.ChatCompletionChoice;
import com.theokanning.openai.completion.chat.ChatCompletionChunk;
import com.theokanning.openai.completion.chat.ChatMessage;
import com.theokanning.openai.service.OpenAiService;
import io.reactivex.BackpressureStrategy;
import io.reactivex.Flowable;
import jakarta.annotation.Resource;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;

import java.util.ArrayList;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.BDDMockito.given;

/**
 * @author sbx0
 * @since 2023/4/28
 */
@MockBean(classes = {WeChatService.class, OpenAiService.class})
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.NONE, classes = {ChatGPTService.class})
class ChatGPTServiceTest {
    @Resource
    private ChatGPTService service;
    @Resource
    private WeChatService weChatService;
    @Resource
    private OpenAiService openAiService;

    @Test
    public void testQueue() {
        ChatGPTMessage message = ChatGPTMessage.builder()
                .message("你好")
                .handled(false)
                .user("user")
                .build();
        for (int i = 0; i < 15; i++) {
            assertTrue(service.addMessage(message));
        }
        assertFalse(service.addMessage(message));

        ChatCompletionChunk chunk = new ChatCompletionChunk();
        ChatCompletionChoice choice = new ChatCompletionChoice();
        List<ChatCompletionChoice> choices = new ArrayList<>();
        ChatMessage chatMessage = new ChatMessage();
        chatMessage.setContent("test");
        chatMessage.setRole("role");
        choice.setMessage(chatMessage);
        choices.add(choice);
        chunk.setChoices(choices);
        given(openAiService.streamChatCompletion(any())).willReturn(Flowable.create(emitter -> {
            emitter.onNext(chunk);
            emitter.onNext(chunk);
            emitter.onComplete();
        }, BackpressureStrategy.BUFFER));

        service.setOpenAiService(openAiService);

        service.handleMessage();

        service.sendMessage();
    }

}
