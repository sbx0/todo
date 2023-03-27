package cn.sbx0.todo.business.user;

import cn.sbx0.todo.business.user.entity.ClientUser;
import cn.sbx0.todo.business.user.entity.CustomUser;
import cn.sbx0.todo.business.user.entity.DefaultUser;
import cn.sbx0.todo.business.user.entity.RegisterParam;
import cn.sbx0.todo.entity.DefaultPagingRequest;
import cn.sbx0.todo.repositories.ClientUserRepository;
import cn.sbx0.todo.repositories.DefaultUserRepository;
import cn.sbx0.todo.service.JpaService;
import cn.sbx0.todo.service.common.Result;
import jakarta.annotation.Resource;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.jwt.JwtClaimsSet;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.JwtEncoderParameters;
import org.springframework.security.provisioning.JdbcUserDetailsManager;
import org.springframework.stereotype.Service;

import javax.sql.DataSource;
import java.time.Instant;
import java.time.LocalDateTime;
import java.util.stream.Collectors;

/**
 * @author sbx0
 * @since 2022/12/8
 */
@Slf4j
@Service
public class ClientUserService extends JpaService<ClientUserRepository, ClientUser, Long, DefaultPagingRequest> {
    // 12h
    public static final Long EXPIRY = 43200L;
    // 1h
    public static final Long BEFORE = 3600L;
    private final JdbcUserDetailsManager jdbcUserDetailsManager;
    @Resource
    private JwtEncoder encoder;
    @Resource
    private ClientUserRepository repository;
    @Resource
    private DefaultUserRepository defaultUserRepository;
    @Resource
    private PasswordEncoder passwordEncoder;

    public ClientUserService(DataSource dataSource) {
        this.jdbcUserDetailsManager = new JdbcUserDetailsManager(dataSource);
    }

    @Override
    protected ClientUserRepository repository() {
        return this.repository;
    }

    @Override
    protected Long getId(ClientUser entity) {
        return entity.getId();
    }

    @Override
    protected ClientUser saveBefore(ClientUser entity) {
        entity.setCreateTime(LocalDateTime.now());
        return entity;
    }

    @Override
    protected ClientUser updateBefore(ClientUser entity) {
        entity.setUpdateTime(LocalDateTime.now());
        return entity;
    }

    public Result<ClientUser> register(RegisterParam param) {
        UserDetails user = User.builder()
                .username(param.getUsername())
                .password(passwordEncoder.encode(param.getPassword()))
                .roles("USER")
                .build();
        try {
            jdbcUserDetailsManager.createUser(user);
        } catch (Exception e) {
            log.error(e.getMessage());
            return Result.failure(e.getMessage());
        }
        ClientUser clientUser = new ClientUser();
        clientUser.setUsername(param.getUsername());
        clientUser.setNickname(param.getUsername());
        return this.save(clientUser);
    }

    public CustomUser findByUsername(String username) {
        DefaultUser defaultUser = defaultUserRepository.findByUsername(username);
        if (defaultUser == null) {
            return null;
        }
        Long id = repository.findIdByUsername(username);
        if (id == null) {
            return null;
        }
        return new CustomUser(defaultUser, id);
    }

    public Long getLoginUserId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null) {
            return 0L;
        }
        CustomUser customUser = this.findByUsername(authentication.getName());
        if (customUser == null) {
            return 0L;
        } else {
            return customUser.getId();
        }
    }

    public String createToken(Authentication authentication, Instant now) {
        String scope = authentication.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .collect(Collectors.joining(" "));
        JwtClaimsSet claims = JwtClaimsSet.builder()
                .issuer("self")
                .issuedAt(Instant.now())
                .expiresAt(now.plusSeconds(EXPIRY))
                .subject(authentication.getName())
                .claim("scope", scope)
                .build();
        return this.encoder.encode(JwtEncoderParameters.from(claims)).getTokenValue();
    }

    public String getToken(Authentication authentication) {
        if (!authentication.isAuthenticated()) {
            return null;
        }
        Object object = authentication.getCredentials();
        if (object == null) {
            return null;
        }
        Jwt credentials = (Jwt) (object);
        Instant expiresAt = credentials.getExpiresAt();
        if (expiresAt == null) {
            return null;
        }
        Instant now = Instant.now();
        if (now.isAfter(expiresAt.plusSeconds(BEFORE))) {
            return this.createToken(authentication, now);
        } else {
            return credentials.getTokenValue();
        }
    }
}
