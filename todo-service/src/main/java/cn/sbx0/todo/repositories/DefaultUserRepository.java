package cn.sbx0.todo.repositories;

import cn.sbx0.todo.business.user.entity.DefaultUser;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

/**
 * @author sbx0
 * @since 2023/3/20
 */
public interface DefaultUserRepository extends JpaRepository<DefaultUser, Long> {

    @Query(value = """
            select username, password, enabled from users where username = ?1
            """, nativeQuery = true)
    DefaultUser findByUsername(String username);
}
