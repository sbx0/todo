package cn.sbx0.todo.business.user;

import cn.sbx0.todo.business.user.entity.ClientUser;
import cn.sbx0.todo.business.user.entity.RegisterParam;
import cn.sbx0.todo.service.common.Result;
import jakarta.annotation.Resource;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;

/**
 * @author sbx0
 * @since 2023/3/14
 */
@Slf4j
@RestController
@RequestMapping(("/user/client"))
public class ClientUserController {
    @Resource
    private ClientUserService service;

    @PostMapping("/handleLogin")
    public Result<String> login(Authentication authentication) {
        return Result.success(service.createToken(authentication, Instant.now()));
    }

    @GetMapping("/token")
    public Result<String> token(Authentication authentication) {
        return Result.success(service.getToken(authentication));
    }

    @PostMapping("/register")
    public Result<ClientUser> register(@RequestBody RegisterParam param) {
        return service.register(param);
    }

    @GetMapping("/info")
    public Result<ClientUser> info() {
        return service.findById(service.getLoginUserId());
    }

}
