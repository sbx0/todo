package cn.sbx0.todo.business.weixin.entity;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.Setter;

/**
 * @author sbx0
 * @since 2023/3/27
 */
@Getter
@Setter
public class WeChatScanResponse {
    private String ticket;
    @JsonProperty(value = "expire_seconds")
    private Long expireSeconds;
    private String url;
}
