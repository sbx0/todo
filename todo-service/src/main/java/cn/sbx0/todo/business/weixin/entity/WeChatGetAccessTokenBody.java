package cn.sbx0.todo.business.weixin.entity;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

/**
 * @author sbx0
 * @since 2022/8/24
 */
@Data
public class WeChatGetAccessTokenBody {
    @JsonProperty(value = "access_token")
    private String accessToken;
    @JsonProperty(value = "expires_in")
    private Long expiresIn;
}
