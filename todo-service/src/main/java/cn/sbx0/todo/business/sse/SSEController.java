package cn.sbx0.todo.business.sse;

import jakarta.annotation.Resource;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

/**
 * @author sbx0
 * @since 2023/4/14
 */
@RestController
@RequestMapping("/sse")
public class SSEController {
    @Resource
    private SSEService sseService;

    @CrossOrigin
    @GetMapping(value = "/subscribe")
    public SseEmitter subscribe() {
        return sseService.subscribe();
    }
}
