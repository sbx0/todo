package cn.sbx0.todo.business.weixin;

import cn.sbx0.todo.business.chatgpt.ChatGPTMessage;
import cn.sbx0.todo.business.chatgpt.ChatGPTService;
import cn.sbx0.todo.business.weixin.entity.WeChatMsgEventType;
import cn.sbx0.todo.business.weixin.entity.WeChatMsgType;
import cn.sbx0.todo.utils.CallApi;
import cn.sbx0.todo.utils.JSON;
import jakarta.annotation.Resource;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.util.*;

/**
 * @author sbx0
 * @since 2023/3/21
 */
@Slf4j
@Service
public class WeChatService {
    @Resource
    private ChatGPTService chatGPTService;
    @Value("${weixin.auth.token}")
    private String token;
    @Value("${weixin.app-id}")
    private String appId;
    @Value("${weixin.app-secret}")
    private String appSecret;

    private static String byteToHex(final byte[] hash) {
        Formatter formatter = new Formatter();
        for (byte b : hash) {
            formatter.format("%02x", b);
        }
        String result = formatter.toString();
        formatter.close();
        return result;
    }

    public void sendMessage(WeChatMessage message) {
        String response = CallApi.post("https://api.weixin.qq.com", "/cgi-bin/message/custom/send?access_token=" + getAccessToken(), JSON.parse(message));
        log.info(response);
    }

    public WeChatXmlMessageResponse handleMessage(WeChatXmlMessage msg) {
        WeChatXmlMessageResponse responseMessage = new WeChatXmlMessageResponse();
        responseMessage.setToUserName(msg.getFromUserName());
        responseMessage.setFromUserName(msg.getToUserName());
        responseMessage.setMsgType(WeChatMsgType.TEXT.getValue());
        responseMessage.setCreateTime(new Date().getTime());
        String message = "暂不支持此类消息。";
        switch (WeChatMsgType.find(msg.getMsgType())) {
            case TEXT -> {
                Boolean result = chatGPTService.addMessage(new ChatGPTMessage(msg.getFromUserName(), msg.getContent()));
                if (!result) {
                    message = "系统超负荷，请稍后重试";
                } else {
                    message = "正在思考，请耐心等待...";
                }
            }
            case EVENT -> {
                switch (WeChatMsgEventType.find(msg.getEvent())) {
                    case SUBSCRIBE -> message = "欢迎关注，我是ChatGPT。";
                    case UNSUBSCRIBE -> log.info("wechat UNSUBSCRIBE event");
                    case SCAN -> log.info("wechat SCAN event");
                    case LOCATION -> log.info("wechat LOCATION event");
                    case CLICK -> log.info("wechat CLICK event");
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
        WeChatGetAccessTokenBody tokenBody = JSON.format(json, WeChatGetAccessTokenBody.class);
        if (tokenBody == null) {
            return null;
        }
        return tokenBody.getAccessToken();
    }

    public String auth(String signature, String timestamp, String nonce, String echostr) {
        if (signature == null || timestamp == null || nonce == null) {
            return null;
        }
        String[] arr = new String[]{token, timestamp, nonce};
        Arrays.sort(arr);
        StringBuilder content = new StringBuilder();
        for (String str : arr) {
            content.append(str);
        }
        String tmpStr;
        try {
            MessageDigest md = MessageDigest.getInstance("SHA-1");
            byte[] digest = md.digest(content.toString().getBytes(StandardCharsets.UTF_8));
            tmpStr = byteToHex(digest);
            return tmpStr.equals(signature) ? echostr : null;
        } catch (Exception e) {
            log.error(e.getMessage());
        }
        return null;
    }
}
