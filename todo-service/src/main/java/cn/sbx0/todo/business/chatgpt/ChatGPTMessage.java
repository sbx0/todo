package cn.sbx0.todo.business.chatgpt;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

/**
 * @author sbx0
 * @since 2023/3/22
 */
@Getter
@Setter
@Builder
public class ChatGPTMessage {
    private Boolean handled;
    private String user;
    private String message;
    private String response;
}
