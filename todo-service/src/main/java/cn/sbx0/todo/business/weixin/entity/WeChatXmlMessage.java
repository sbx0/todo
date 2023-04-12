package cn.sbx0.todo.business.weixin.entity;

import com.fasterxml.jackson.dataformat.xml.annotation.JacksonXmlProperty;
import com.fasterxml.jackson.dataformat.xml.annotation.JacksonXmlRootElement;
import lombok.Data;

/**
 * @author sbx0
 * @since 2023/3/22
 */
@Data
@JacksonXmlRootElement(localName = "xml")
public class WeChatXmlMessage {
    @JacksonXmlProperty(localName = "FromUserName")
    private String fromUserName;
    @JacksonXmlProperty(localName = "ToUserName")
    private String toUserName;
    @JacksonXmlProperty(localName = "CreateTime")
    private Long createTime;
    @JacksonXmlProperty(localName = "MsgType")
    private String msgType;
    @JacksonXmlProperty(localName = "MsgId")
    private Long msgId;
    @JacksonXmlProperty(localName = "Content")
    private String content;
    @JacksonXmlProperty(localName = "Event")
    private String event;
    @JacksonXmlProperty(localName = "EventKey")
    private String eventKey;

    public WeChatXmlMessage() {
    }

    public WeChatXmlMessage(Builder builder) {
        this.fromUserName = builder.fromUserName;
        this.toUserName = builder.toUserName;
        this.createTime = builder.createTime;
        this.msgType = builder.msgType;
        this.msgId = builder.msgId;
        this.content = builder.content;
        this.event = builder.event;
        this.eventKey = builder.eventKey;
    }

    public static class Builder {
        private String fromUserName;
        private String toUserName;
        private Long createTime;
        private String msgType;
        private Long msgId;
        private String content;
        private String event;
        private String eventKey;

        public Builder fromUserName(String fromUserName) {
            this.fromUserName = fromUserName;
            return this;
        }

        public Builder toUserName(String toUserName) {
            this.toUserName = toUserName;
            return this;
        }

        public Builder createTime(Long createTime) {
            this.createTime = createTime;
            return this;
        }

        public Builder msgType(String msgType) {
            this.msgType = msgType;
            return this;
        }

        public Builder msgId(Long msgId) {
            this.msgId = msgId;
            return this;
        }

        public Builder content(String content) {
            this.content = content;
            return this;
        }

        public Builder event(String event) {
            this.event = event;
            return this;
        }

        public Builder eventKey(String eventKey) {
            this.eventKey = eventKey;
            return this;
        }

        public WeChatXmlMessage build() {
            return new WeChatXmlMessage(this);
        }
    }
}