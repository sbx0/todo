package cn.sbx0.todo.business.weixin;

import cn.sbx0.todo.business.chatgpt.ChatGPTService;
import cn.sbx0.todo.business.user.ClientUserService;
import cn.sbx0.todo.business.weixin.entity.*;
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
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.mockStatic;
import static org.mockito.Mockito.when;


/**
 * @author sbx0
 * @since 2023/4/12
 */
@ExtendWith(OutputCaptureExtension.class)
@MockBean(classes = {ChatGPTService.class, ClientUserService.class})
@SpringBootTest(classes = {WeChatService.class}, webEnvironment = WebEnvironment.NONE)
class WeChatServiceTest {
    @Autowired
    private WeChatService service;
    @Autowired
    private ChatGPTService chatGPTService;

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

        service.sendMessage(new WeChatMessage());
        assertThat(output).contains(postResponse);
    }

    @Test
    void handleWeChatSubscribeMessage() {
        String fromUserName = "fromUserName";
        String toUserName = "toUserName";
        WeChatXmlMessage msg = new WeChatXmlMessage.Builder()
                .fromUserName(fromUserName)
                .toUserName(toUserName)
                .createTime(100000L)
                .msgType(WeChatMsgType.EVENT.getValue())
                .msgId(1L)
                .content("content")
                .event(WeChatMsgEventType.SUBSCRIBE.getValue())
                .eventKey("eventKey")
                .build();
        WeChatXmlMessageResponse response = service.handleMessage(msg);
        assertNotNull(response);
        assertEquals(fromUserName, response.getToUserName());
        assertEquals(toUserName, response.getFromUserName());
        assertEquals(WeChatReplyMessage.WELCOME_MESSAGE, response.getContent());
        assertEquals(WeChatMsgType.TEXT.getValue(), response.getMsgType());
    }

    @Test
    void handleWeChatTextMessage() {
        when(chatGPTService.addMessage(any())).thenReturn(true);

        String fromUserName = "fromUserName";
        String toUserName = "toUserName";
        WeChatXmlMessage msg = new WeChatXmlMessage.Builder()
                .fromUserName(fromUserName)
                .toUserName(toUserName)
                .createTime(100000L)
                .msgType(WeChatMsgType.TEXT.getValue())
                .msgId(1L)
                .content("content")
                .event("event")
                .eventKey("eventKey")
                .build();
        WeChatXmlMessageResponse response = service.handleMessage(msg);
        assertNotNull(response);
        assertEquals(fromUserName, response.getToUserName());
        assertEquals(toUserName, response.getFromUserName());
        assertEquals(WeChatReplyMessage.WAITING_MESSAGE, response.getContent());
        assertEquals(WeChatMsgType.TEXT.getValue(), response.getMsgType());
    }

    @Test
    void handleWeChatOverloadTextMessage() {
        when(chatGPTService.addMessage(any())).thenReturn(false);

        String fromUserName = "fromUserName";
        String toUserName = "toUserName";
        WeChatXmlMessage msg = new WeChatXmlMessage.Builder()
                .fromUserName(fromUserName)
                .toUserName(toUserName)
                .createTime(100000L)
                .msgType(WeChatMsgType.TEXT.getValue())
                .msgId(1L)
                .content("content")
                .event("event")
                .eventKey("eventKey")
                .build();
        WeChatXmlMessageResponse response = service.handleMessage(msg);
        assertNotNull(response);
        assertEquals(fromUserName, response.getToUserName());
        assertEquals(toUserName, response.getFromUserName());
        assertEquals(WeChatReplyMessage.OVERLOAD_MESSAGE, response.getContent());
        assertEquals(WeChatMsgType.TEXT.getValue(), response.getMsgType());
    }
}