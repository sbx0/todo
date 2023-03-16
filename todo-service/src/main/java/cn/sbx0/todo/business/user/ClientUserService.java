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
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCrypt;
import org.springframework.security.provisioning.JdbcUserDetailsManager;
import org.springframework.stereotype.Service;
import org.springframework.util.DigestUtils;

import javax.sql.DataSource;
import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;

/**
 * @author sbx0
 * @since 2022/12/8
 */
@Slf4j
@Service
public class ClientUserService extends JpaService<ClientUserRepository, ClientUser, Long> {
    @Resource
    private ClientUserRepository repository;
    @Resource
    private DataSource dataSource;

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
                .password(BCrypt.hashpw(param.getPassword(), BCrypt.gensalt()))
                .roles("USER")
                .build();
        new JdbcUserDetailsManager(dataSource).createUser(user);
        return Result.success();
    }
}
