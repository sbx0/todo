package cn.sbx0.todo.business.weixin.utils;

/**
 * https://developers.weixin.qq.com/doc/offiaccount/Message_Management/Receiving_event_pushes.html
 *
 * @author sbx0
 * @since 2023/3/22
 */
public enum WeChatMsgEventType {
    SUBSCRIBE("subscribe"),
    UNSUBSCRIBE("unsubscribe"),
    SCAN("SCAN"),
    LOCATION("LOCATION"),
    CLICK("CLICK"),
    NONE("none");

    private final String value;

    WeChatMsgEventType(String value) {
        this.value = value;
    }

    public static WeChatMsgEventType find(String value) {
        for (WeChatMsgEventType msgType : WeChatMsgEventType.values()) {
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
