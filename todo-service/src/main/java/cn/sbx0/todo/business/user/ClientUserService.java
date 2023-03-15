package cn.sbx0.todo.business.user;

import cn.sbx0.todo.business.user.entity.ClientUser;
import cn.sbx0.todo.business.user.entity.RegisterParam;
import cn.sbx0.todo.repositories.ClientUserRepository;
import cn.sbx0.todo.service.JpaService;
import cn.sbx0.todo.service.common.Result;
import jakarta.annotation.Resource;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.bcrypt.BCrypt;
import org.springframework.stereotype.Service;
import org.springframework.util.DigestUtils;

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
        ClientUser clientUser = new ClientUser();
        clientUser.setEmail(param.getEmail());
        clientUser.setNickname("USER-" + DigestUtils.md5DigestAsHex((param.getEmail()).getBytes(StandardCharsets.UTF_8)));
        clientUser.setPwd(BCrypt.hashpw(param.getPassword(), BCrypt.gensalt()));
        Result<ClientUser> result = this.save(clientUser);
        return result.isSuccess() ? Result.success() : Result.failed();
    }
}
