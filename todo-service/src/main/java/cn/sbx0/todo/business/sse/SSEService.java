package cn.sbx0.todo.business.sse;

import cn.sbx0.todo.business.user.ClientUserService;
import jakarta.annotation.Resource;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

/**
 * @author sbx0
 * @since 2023/4/14
 */
@Service
@Slf4j
public class SSEService {
    @Resource
    private ClientUserService clientUserService;
    private final List<SseEmitter> emitters = new ArrayList<>();

    public SseEmitter subscribe() {
        Long userId = clientUserService.getLoginUserId();
        SseEmitter emitter = new SseEmitter(0L);

        emitter.onCompletion(() -> {
            log.info(userId + " sse completion");
            emitters.remove(emitter);
        });

        emitter.onTimeout(() -> {
            log.info(userId + " sse timeout");
            emitters.remove(emitter);
        });

        emitter.onError((e) -> {
            log.info(userId + " sse error");
            emitters.remove(emitter);
        });

        emitters.add(emitter);

        return emitter;
    }

    public void heartbeat() {
        for (SseEmitter emitter : emitters) {
            try {
                emitter.send(SseEmitter.event().name("HEARTBEAT").data("HEARTBEAT"));
            } catch (IOException e) {
                e.printStackTrace();
                emitter.completeWithError(e);
                emitters.remove(emitter);
            }
        }
    }
}
