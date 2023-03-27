package cn.sbx0.todo.business.weixin;

import jakarta.annotation.Resource;
import org.springframework.web.bind.annotation.*;

/**
 * @author sbx0
 * @since 2023/3/21
 */
@RestController
@RequestMapping("/wechat")
public class WeChatController {
    @Resource
    private WeChatService weChatService;

    @GetMapping("/auth")
    public String auth(
            @RequestParam("signature") String signature,
            @RequestParam("timestamp") String timestamp,
            @RequestParam("nonce") String nonce,
            @RequestParam("echostr") String echostr
    ) {
        return weChatService.auth(signature, timestamp, nonce, echostr);
    }

    @PostMapping(value = "/auth", consumes = {"application/xml", "text/xml"}, produces = "application/xml;charset=utf-8")
    public WeChatXmlMessageResponse handleMessage(@RequestBody WeChatXmlMessage message) {
        return weChatService.handleMessage(message);
    }
}
