package cn.sbx0.todo.business.weixin;

import lombok.Data;

/**
 * @author sbx0
 * @since 2023/3/22
 */
@Data
public class WinXinMessage {
    private String touser;
    private String msgtype;
    private WinXinMessageContext text;

    @Data
    public static class WinXinMessageContext {
        private String content;

        public WinXinMessageContext() {
        }

        public WinXinMessageContext(String content) {
            this.content = content;
        }
    }
}