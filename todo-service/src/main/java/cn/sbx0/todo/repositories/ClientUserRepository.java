package cn.sbx0.todo.repositories;

import cn.sbx0.todo.business.user.entity.ClientUser;
import cn.sbx0.todo.business.user.entity.ClientUserSimple;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Set;

/**
 * @author sbx0
 * @since 2023/3/15
 */
public interface ClientUserRepository extends JpaRepository<ClientUser, Long> {
    @Query(value = """
            select id from client_user where username = ?1
            """, nativeQuery = true)
    Long findIdByUsername(String username);

    @Query(value = "SELECT new cn.sbx0.todo.business.user.entity.ClientUserSimple(id, nickname) FROM ClientUser WHERE id IN :ids")
    List<ClientUserSimple> mapByIds(Set<Long> ids);
}
