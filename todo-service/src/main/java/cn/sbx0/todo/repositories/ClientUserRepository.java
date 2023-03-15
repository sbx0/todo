package cn.sbx0.todo.repositories;

import cn.sbx0.todo.business.user.entity.ClientUser;
import org.springframework.data.jpa.repository.JpaRepository;

/**
 * @author sbx0
 * @since 2023/3/15
 */
public interface ClientUserRepository extends JpaRepository<ClientUser, Long> {

}
