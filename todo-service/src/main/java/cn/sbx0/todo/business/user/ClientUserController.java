package cn.sbx0.todo.business.user;

import cn.sbx0.todo.business.user.entity.ClientUser;
import cn.sbx0.todo.business.user.entity.RegisterParam;
import cn.sbx0.todo.service.common.Result;
import jakarta.annotation.Resource;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.oauth2.jwt.JwtClaimsSet;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.JwtEncoderParameters;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.util.stream.Collectors;

/**
 * @author sbx0
 * @since 2023/3/14
 */
@RestController
@RequestMapping(("/user/client"))
public class ClientUserController {
    public static final Long EXPIRY = 36000L;
    @Resource
    private ClientUserService service;
    @Resource
    private JwtEncoder encoder;

    @PostMapping("/login")
    public Result<String> login(Authentication authentication) {
        Instant now = Instant.now();
        String scope = authentication.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .collect(Collectors.joining(" "));
        JwtClaimsSet claims = JwtClaimsSet.builder()
                .issuer("self")
                .issuedAt(now)
                .expiresAt(now.plusSeconds(EXPIRY))
                .subject(authentication.getName())
                .claim("scope", scope)
                .build();
        return Result.success(this.encoder.encode(JwtEncoderParameters.from(claims)).getTokenValue());
    }

    @PostMapping("/register")
    public Result<ClientUser> register(@RequestBody RegisterParam param) {
        return service.register(param);
    }

    @GetMapping("/")
    public String hello(Authentication authentication) {
        return "Hello, " + authentication.getName() + "!";
    }

}