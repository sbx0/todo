package cn.sbx0.todo.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

/**
 * @author sbx0
 * @since 2022/12/1
 */
@Configuration
@EnableJpaRepositories("cn.sbx0.todo.repositories")
public class JpaConfig {

}
