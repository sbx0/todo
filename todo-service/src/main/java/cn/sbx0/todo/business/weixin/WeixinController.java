package cn.sbx0.todo.business.weixin;

import jakarta.annotation.Resource;
import org.springframework.web.bind.annotation.*;

/**
 * @author sbx0
 * @since 2023/3/21
 */
@RestController
@RequestMapping("/weixin")
public class WeixinController {
    @Resource
    private WeixinService weixinService;

    @GetMapping("/auth")
    public String auth(
            @RequestParam("signature") String signature,
            @RequestParam("timestamp") String timestamp,
            @RequestParam("nonce") String nonce,
            @RequestParam("echostr") String echostr
    ) {
        return weixinService.auth(signature, timestamp, nonce, echostr);
    }

    @PostMapping(value = "/auth", consumes = {"application/xml", "text/xml"}, produces = "application/xml;charset=utf-8")
    public WinXinXmlMessageResponse handleMessage(@RequestBody WinXinXmlMessage message) {
        return weixinService.handleMessage(message);
    }
}
