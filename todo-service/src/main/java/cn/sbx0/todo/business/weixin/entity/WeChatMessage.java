package cn.sbx0.todo.business.weixin.entity;

import lombok.Getter;
import lombok.Setter;

/**
 * @author sbx0
 * @since 2023/3/22
 */
@Getter
@Setter
public class WeChatMessage {
    private String touser;
    private String msgtype;
    private WeChatMessageContext text;

    @Getter
    @Setter
    public static class WeChatMessageContext {
        private String content;

        public WeChatMessageContext(String content) {
            this.content = content;
        }
    }
}
