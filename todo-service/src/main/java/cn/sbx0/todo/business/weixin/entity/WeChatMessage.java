package cn.sbx0.todo.business.weixin.entity;

import lombok.Data;

/**
 * @author sbx0
 * @since 2023/3/22
 */
@Data
public class WeChatMessage {
    private String touser;
    private String msgtype;
    private WeChatMessageContext text;

    @Data
    public static class WeChatMessageContext {
        private String content;

        public WeChatMessageContext() {
        }

        public WeChatMessageContext(String content) {
            this.content = content;
        }
    }
}