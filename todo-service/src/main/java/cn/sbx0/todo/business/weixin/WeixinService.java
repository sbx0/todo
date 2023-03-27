package cn.sbx0.todo.business.weixin;

import cn.sbx0.todo.business.chatgpt.ChatGPTMessage;
import cn.sbx0.todo.business.chatgpt.ChatGPTService;
import cn.sbx0.todo.business.weixin.utils.WinXinMessageType;
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
public class WeixinService {
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

    public void sendMessage(WinXinMessage message) {
        String response = CallApi.post("https://api.weixin.qq.com", "/cgi-bin/message/custom/send?access_token=" + getAccessToken(), JSON.parse(message));
        log.info(response);
    }

    public WinXinXmlMessageResponse handleMessage(WinXinXmlMessage msg) {
        WinXinXmlMessageResponse responseMessage = new WinXinXmlMessageResponse();
        responseMessage.setToUserName(msg.getFromUserName());
        responseMessage.setFromUserName(msg.getToUserName());
        responseMessage.setMsgType(WinXinMessageType.TEXT);
        responseMessage.setCreateTime(new Date().getTime());
        String message = "";
        switch (msg.getMsgType()) {
            case WinXinMessageType.TEXT -> {
                Boolean result = chatGPTService.addMessage(new ChatGPTMessage(msg.getFromUserName(), msg.getContent()));
                if (!result) {
                    message = "系统超负荷，请稍后重试";
                } else {
                    message = "正在思考，请耐心等待...";
                }
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
