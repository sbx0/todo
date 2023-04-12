package cn.sbx0.todo.business.weixin;

import cn.sbx0.todo.business.chatgpt.ChatGPTService;
import cn.sbx0.todo.business.user.ClientUserService;
import cn.sbx0.todo.business.weixin.entity.WeChatMessage;
import cn.sbx0.todo.utils.CallApi;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.MockedStatic;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.context.SpringBootTest.WebEnvironment;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.boot.test.system.CapturedOutput;
import org.springframework.boot.test.system.OutputCaptureExtension;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.mockStatic;


/**
 * @author sbx0
 * @since 2023/4/12
 */
@ExtendWith(OutputCaptureExtension.class)
@MockBean(classes = {ChatGPTService.class, ClientUserService.class})
@SpringBootTest(classes = {WeChatService.class}, webEnvironment = WebEnvironment.NONE)
class WeChatServiceTest {
    @Autowired
    private WeChatService weChatService;

    @Test
    void sendMessage(CapturedOutput output) {
        MockedStatic<CallApi> callApiMockedStatic = mockStatic(CallApi.class);
        String postResponse = """
                {
                  "errcode": 0,
                  "errmsg": "ok"
                }
                """;
        callApiMockedStatic.when(() -> CallApi.post(anyString(), anyString(), anyString())).thenReturn(postResponse);

        callApiMockedStatic.when(() -> CallApi.get(anyString(), anyString(), any())).thenReturn("""
                {
                  "access_token": "asfasdfasdfasdfasfasdf",
                  "expires_in": 1000
                }
                """);

        weChatService.sendMessage(new WeChatMessage());
        assertThat(output).contains(postResponse);
    }
}