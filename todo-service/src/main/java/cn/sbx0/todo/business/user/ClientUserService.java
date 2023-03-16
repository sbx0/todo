package cn.sbx0.todo.business.user;

import cn.sbx0.todo.business.user.entity.ClientUser;
import cn.sbx0.todo.business.user.entity.RegisterParam;
import cn.sbx0.todo.repositories.ClientUserRepository;
import cn.sbx0.todo.service.JpaService;
import cn.sbx0.todo.service.common.Result;
import jakarta.annotation.Resource;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.provisioning.JdbcUserDetailsManager;
import org.springframework.stereotype.Service;

import javax.sql.DataSource;
import java.time.LocalDateTime;

/**
 * @author sbx0
 * @since 2022/12/8
 */
@Slf4j
@Service
public class ClientUserService extends JpaService<ClientUserRepository, ClientUser, Long> {
    private final JdbcUserDetailsManager jdbcUserDetailsManager;
    @Resource
    private ClientUserRepository repository;
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

    public Result<Long> register(RegisterParam param) {
        UserDetails user = User.builder()
                .username(param.getEmail())
                .password(passwordEncoder.encode(param.getPassword()))
                .roles("USER")
                .build();
        try {
            jdbcUserDetailsManager.createUser(user);
        } catch (Exception e) {
            log.error(e.getMessage());
            return Result.failure(e.getMessage());
        }
        return Result.success();
    }
}
