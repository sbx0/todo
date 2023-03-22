package cn.sbx0.todo.business.weixin;

import cn.sbx0.todo.business.weixin.utils.WinXinMessageType;
import com.plexpt.chatgpt.ChatGPT;
import com.plexpt.chatgpt.util.Proxys;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.net.Proxy;
import java.util.Date;

/**
 * @author sbx0
 * @since 2023/3/22
 */
@Slf4j
@Service
public class WechatService {
    @Value("${chatgpt.api-key}")
    private String apiKey;

    public WinXinXmlMessageResponse processRequest(WinXinXmlMessage msg) {
        WinXinXmlMessageResponse responseMessage = new WinXinXmlMessageResponse();
        responseMessage.setToUserName(msg.getFromUserName());
        responseMessage.setFromUserName(msg.getToUserName());
        responseMessage.setMsgType(WinXinMessageType.TEXT);
        responseMessage.setCreateTime(new Date().getTime());
        String message = "";
        switch (msg.getMsgType()) {
            case WinXinMessageType.TEXT -> {
                Proxy proxy = Proxys.http("win.sbx0.cn", 11114);
                ChatGPT chatGPT = ChatGPT.builder()
                        .apiKey(apiKey)
                        .proxy(proxy)
                        .apiHost("https://api.openai.com/")
                        .build()
                        .init();
                message = chatGPT.chat(msg.getContent());
            }
            case WinXinMessageType.IMAGE, WinXinMessageType.LINK, WinXinMessageType.LOCATION, WinXinMessageType.SHORTVIDEO, WinXinMessageType.VIDEO, WinXinMessageType.VOICE ->
                    message = "暂不支持此类消息。";
            case WinXinMessageType.EVENT -> {
                switch (msg.getEvent()) {
                    case WinXinMessageType.EVENT_SUBSCRIBE:
                        message = "欢迎关注，我是ChatGPT。";
                        break;
                    case WinXinMessageType.EVENT_UNSUBSCRIBE, WinXinMessageType.EVENT_CLICK, WinXinMessageType.EVENT_LOCATION, WinXinMessageType.EVENT_SCAN:
                        break;
                }
            }
        }
        responseMessage.setContent(message);
        return responseMessage;
    }
}
