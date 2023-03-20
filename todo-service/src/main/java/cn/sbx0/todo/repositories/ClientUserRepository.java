package cn.sbx0.todo.repositories;

import cn.sbx0.todo.business.user.entity.ClientUser;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

/**
 * @author sbx0
 * @since 2023/3/15
 */
public interface ClientUserRepository extends JpaRepository<ClientUser, Long> {
    @Query(value = """
            select id from client_user where username = ?1
            """, nativeQuery = true)
    Long findIdByUsername(String username);
}
