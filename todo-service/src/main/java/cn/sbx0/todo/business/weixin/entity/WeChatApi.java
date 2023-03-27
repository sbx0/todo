package cn.sbx0.todo.business.weixin.entity;

/**
 * https://developers.weixin.qq.com/doc/offiaccount/Message_Management/Receiving_event_pushes.html
 *
 * @author sbx0
 * @since 2023/3/22
 */
public enum WeChatApi {
    HOST("https://api.weixin.qq.com"),
    SEND_MESSAGE("/cgi-bin/message/custom/send"),
    GET_ACCESS_TOKEN("/cgi-bin/token"),
    CREATE_QRCODE("/cgi-bin/qrcode/create"),
    QRCODE_URL("https://mp.weixin.qq.com/cgi-bin/showqrcode?ticket="),
    NONE("/404");

    private final String value;

    WeChatApi(String value) {
        this.value = value;
    }

    public static WeChatApi find(String value) {
        for (WeChatApi msgType : WeChatApi.values()) {
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
