package cn.sbx0.todo.business.weixin;

import cn.sbx0.todo.business.weixin.utils.AesException;
import cn.sbx0.todo.business.weixin.utils.SHA1Utils;
import cn.sbx0.todo.utils.CallApi;
import cn.sbx0.todo.utils.JSON;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

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
