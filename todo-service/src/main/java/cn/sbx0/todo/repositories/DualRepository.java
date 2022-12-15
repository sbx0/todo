package cn.sbx0.todo.repositories;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.Query;
import org.springframework.stereotype.Repository;

import java.sql.Timestamp;

/**
 * @author sbx0
 * @since 2022/12/1
 */
@Repository
public class DualRepository {
    @PersistenceContext
    EntityManager entityManager;

    //language=MySQL
    String NOW_SQL = """
            SELECT NOW() FROM dual""";

    public Timestamp now() {
        Query nativeQuery = entityManager.createNativeQuery(NOW_SQL);
        Object singleResult = nativeQuery.getSingleResult();
        return (Timestamp) singleResult;
    }
}
