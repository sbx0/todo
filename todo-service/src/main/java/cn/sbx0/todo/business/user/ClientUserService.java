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
import org.springframework.security.oauth2.jwt.*;
import org.springframework.security.provisioning.JdbcUserDetailsManager;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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
    // 24h
    public static final Long EXPIRY = 86400L;
    // 12h
    public static final Long BEFORE = 43200L;
    private final JdbcUserDetailsManager jdbcUserDetailsManager;
    private final JwtEncoder encoder;
    private final JwtDecoder decoder;
    private final ClientUserRepository repository;
    private final DefaultUserRepository defaultUserRepository;
    @Resource
    private PasswordEncoder passwordEncoder;

    public ClientUserService(DataSource dataSource, JwtEncoder encoder, JwtDecoder decoder, ClientUserRepository clientUserRepository, DefaultUserRepository defaultUserRepository) {
        this.jdbcUserDetailsManager = new JdbcUserDetailsManager(dataSource);
        this.encoder = encoder;
        this.decoder = decoder;
        this.repository = clientUserRepository;
        this.defaultUserRepository = defaultUserRepository;
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

    @Transactional(rollbackFor = Exception.class)
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

    public String createToken(String subject, String scope, Instant issuedAt, Instant expiresAt) {
        JwtClaimsSet claims = JwtClaimsSet.builder()
                .issuer("self")
                .issuedAt(issuedAt)
                .expiresAt(expiresAt)
                .subject(subject)
                .claim("scope", scope)
                .build();
        return this.encoder.encode(JwtEncoderParameters.from(claims)).getTokenValue();
    }

    public Jwt getToken(String token) {
        return this.decoder.decode(token);
    }

    public String createToken(Authentication authentication, Instant now) {
        String scope = authentication.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .collect(Collectors.joining(" "));
        return this.createToken(authentication.getName(), scope, now, now.plusSeconds(EXPIRY));
    }

    public String getToken(Authentication authentication) {
        if (!authentication.isAuthenticated()) {
            return null;
        }
        Object credentials = authentication.getCredentials();
        if (credentials == null) {
            return null;
        }
        Jwt jwt = (Jwt) (credentials);
        Instant expiresAt = jwt.getExpiresAt();
        if (expiresAt == null) {
            return null;
        }
        Instant now = Instant.now();
        if (now.isAfter(expiresAt.minusSeconds(BEFORE))) {
            log.info("recreate token");
            return this.createToken(authentication, now);
        } else {
            return jwt.getTokenValue();
        }
    }
}
