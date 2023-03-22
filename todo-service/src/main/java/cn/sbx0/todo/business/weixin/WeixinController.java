package cn.sbx0.todo.business.weixin;

import cn.sbx0.todo.business.weixin.utils.AesException;
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
    @Resource
    private WechatService wechatService;

    @GetMapping("/auth")
    public String auth(
            @RequestParam("signature") String signature,
            @RequestParam("timestamp") String timestamp,
            @RequestParam("nonce") String nonce,
            @RequestParam("echostr") String echostr
    ) throws AesException {
        return weixinService.auth(signature, timestamp, nonce, echostr);
    }

    @PostMapping(value = "/auth", consumes = {"application/xml", "text/xml"}, produces = "application/xml;charset=utf-8")
    public WinXinXmlMessageResponse handleMessage(@RequestBody WinXinXmlMessage msg) {
        return wechatService.processRequest(msg);
    }
}
