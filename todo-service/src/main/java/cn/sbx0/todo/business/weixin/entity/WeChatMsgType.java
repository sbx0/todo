package cn.sbx0.todo.business.weixin.entity;

/**
 * https://developers.weixin.qq.com/doc/offiaccount/Message_Management/Receiving_standard_messages.html
 *
 * @author sbx0
 * @since 2023/3/22
 */
public enum WeChatMsgType {
    TEXT("text"),
    IMAGE("image"),
    VOICE("voice"),
    VIDEO("video"),
    SHORTVIDEO("shortvideo"),
    LOCATION("location"),
    LINK("link"),
    EVENT("EVENT"),
    NONE("none");

    private final String value;

    WeChatMsgType(String value) {
        this.value = value;
    }

    public static WeChatMsgType find(String value) {
        for (WeChatMsgType msgType : WeChatMsgType.values()) {
            if (msgType.getValue().equals(value)) {
                return msgType;
            }
        }
        return NONE;
    }

    public String getValue() {
        return value;
    }
}
