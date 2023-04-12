package cn.sbx0.todo.business.weixin;

import cn.sbx0.todo.business.chatgpt.ChatGPTMessage;
import cn.sbx0.todo.business.chatgpt.ChatGPTService;
import cn.sbx0.todo.business.user.ClientUserService;
import cn.sbx0.todo.business.user.entity.ClientUser;
import cn.sbx0.todo.business.weixin.entity.*;
import cn.sbx0.todo.service.common.Result;
import cn.sbx0.todo.utils.CallApi;
import cn.sbx0.todo.utils.JSON;
import jakarta.annotation.Resource;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.security.MessageDigest;
import java.util.Arrays;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

/**
 * @author sbx0
 * @since 2023/3/21
 */
@Slf4j
@Service
public class WeChatService {
    @Value("${weixin.auth.token}")
    private String token;
    @Value("${weixin.app-id}")
    private String appId;
    @Value("${weixin.app-secret}")
    private String appSecret;
    @Resource
    private ClientUserService userService;
    @Resource
    private ChatGPTService chatGPTService;

    public void sendMessage(WeChatMessage message) {
        String response = CallApi.post(
                WeChatApi.HOST.getValue(),
                WeChatApi.SEND_MESSAGE.getValue() + "?access_token=" + getAccessToken(),
                JSON.parse(message)
        );
        log.info(response);
    }

    public WeChatXmlMessageResponse handleMessage(WeChatXmlMessage msg) {
        WeChatXmlMessageResponse responseMessage = new WeChatXmlMessageResponse();
        responseMessage.setToUserName(msg.getFromUserName());
        responseMessage.setFromUserName(msg.getToUserName());
        responseMessage.setMsgType(WeChatMsgType.TEXT.getValue());
        responseMessage.setCreateTime(new Date().getTime());
        String message = WeChatReplyMessage.UNSUPPORTED_MESSAGE;
        switch (WeChatMsgType.find(msg.getMsgType())) {
            case TEXT -> {
                Boolean result = chatGPTService.addMessage(
                        ChatGPTMessage.builder()
                                .user(msg.getFromUserName())
                                .message(msg.getContent())
                                .build()
                );
                if (result) {
                    message = WeChatReplyMessage.WAITING_MESSAGE;
                } else {
                    message = WeChatReplyMessage.OVERLOAD_MESSAGE;
                }
            }
            case EVENT -> {
                switch (WeChatMsgEventType.find(msg.getEvent())) {
                    case SUBSCRIBE -> message = WeChatReplyMessage.WELCOME_MESSAGE;
                    case UNSUBSCRIBE -> {
                        log.info("wechat UNSUBSCRIBE event");
                        return null;
                    }
                    case SCAN -> {
                        log.info("wechat SCAN event key = " + msg.getEventKey());
                        Long userId = Long.parseLong(msg.getEventKey());
                        Result<ClientUser> userResult = userService.findById(userId);
                        if (userResult.getSuccess()) {
                            ClientUser user = userResult.getData();
                            user.setWeChatOpenId(msg.getFromUserName());
                            userService.update(user);
                            log.info("user " + user.getId() + " " + user.getUsername() + " bind wechat open id " + msg.getFromUserName());
                            message = "已绑定账户 " + user.getUsername();
                        }
                    }
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
        String json = CallApi.get(
                WeChatApi.HOST.getValue(),
                WeChatApi.GET_ACCESS_TOKEN.getValue(),
                params
        );
        WeChatGetAccessTokenBody tokenBody = JSON.format(json, WeChatGetAccessTokenBody.class);
        if (tokenBody == null) {
            return null;
        }
        return tokenBody.getAccessToken();
    }

    public String auth(String signature, String timestamp, String nonce, String echostr) {
        String[] arr = new String[]{token, timestamp, nonce};
        Arrays.sort(arr);
        StringBuilder content = new StringBuilder();
        for (String str : arr) {
            content.append(str);
        }
        try {
            MessageDigest md = MessageDigest.getInstance("SHA-1");
            md.update(content.toString().getBytes());
            byte[] digest = md.digest();
            StringBuilder hexstr = new StringBuilder();
            String shaHex;
            for (byte b : digest) {
                shaHex = Integer.toHexString(b & 0xFF);
                if (shaHex.length() < 2) {
                    hexstr.append(0);
                }
                hexstr.append(shaHex);
            }
            String cal = hexstr.toString();
            return signature.equals(cal) ? echostr : null;
        } catch (Exception e) {
            log.error(e.getMessage());
        }
        return null;
    }

    public Result<String> createQRCode(Long userId) {
        String json = """
                {"expire_seconds": 60, "action_name": "QR_SCENE", "action_info": {"scene": {"scene_id":
                """
                + userId +
                "}}}";

        String response = CallApi.post(
                WeChatApi.HOST.getValue(),
                WeChatApi.CREATE_QRCODE.getValue() + "?access_token=" + getAccessToken(),
                json
        );
        WeChatScanResponse weChatScanResponse = JSON.format(response, WeChatScanResponse.class);
        if (weChatScanResponse == null || !StringUtils.hasText(weChatScanResponse.getTicket())) {
            log.error(response);
            return Result.failure();
        }
        return Result.success(WeChatApi.QRCODE_URL.getValue() + weChatScanResponse.getTicket());
    }
}
