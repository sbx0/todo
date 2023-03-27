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
    private String FromUserName;
    @JacksonXmlProperty(localName = "ToUserName")
    private String ToUserName;
    @JacksonXmlProperty(localName = "CreateTime")
    private Long CreateTime;
    @JacksonXmlProperty(localName = "MsgType")
    private String MsgType;
    @JacksonXmlProperty(localName = "MsgId")
    private Long MsgId;
    @JacksonXmlProperty(localName = "Content")
    private String Content;
    @JacksonXmlProperty(localName = "Event")
    private String Event;
}