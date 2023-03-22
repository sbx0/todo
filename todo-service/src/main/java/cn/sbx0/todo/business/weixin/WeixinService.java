package cn.sbx0.todo.business.weixin;

import cn.sbx0.todo.business.weixin.utils.AesException;
import cn.sbx0.todo.business.weixin.utils.SHA1Utils;
import cn.sbx0.todo.business.weixin.utils.WinXinMessageType;
import cn.sbx0.todo.utils.CallApi;
import cn.sbx0.todo.utils.JSON;
import com.plexpt.chatgpt.ChatGPT;
import com.plexpt.chatgpt.util.Proxys;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.net.Proxy;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

/**
 * @author sbx0
 * @since 2023/3/21
 */
@Slf4j
@Service
public class WeixinService {
    @Value("${weixin.auth.token}")
    private String token;
    @Value("${weixin.app-id}")
    private String appId;
    @Value("${weixin.app-secret}")
    private String appSecret;
    @Value("${chatgpt.api-key}")
    private String apiKey;

    public WinXinXmlMessageResponse handleMessage(WinXinXmlMessage msg) {
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

    public String getAccessToken() {
        Map<String, String> params = new HashMap<>();
        params.put("grant_type", "client_credential");
        params.put("appid", appId);
        params.put("secret", appSecret);
        String json = CallApi.get("https://api.weixin.qq.com", "/cgi-bin/token", params);
        WeixinGetAccessTokenBody tokenBody = JSON.format(json, WeixinGetAccessTokenBody.class);
        if (tokenBody == null) {
            return null;
        }
        return tokenBody.getAccessToken();
    }

    public String auth(String signature, String timestamp, String nonce, String echostr) throws AesException {
        String sha1 = SHA1Utils.getSHA1(token, timestamp, nonce);
        return signature.equals(sha1) ? echostr : null;
    }
}
