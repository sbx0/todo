package cn.sbx0.todo.config;

import org.springframework.beans.factory.config.BeanFactoryPostProcessor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;

/**
 * @author sbx0
 * @since 2022/12/1
 */
@Configuration
@EnableJpaRepositories("cn.sbx0.todo.repositories")
public class JpaConfig {
    @Bean
    public static BeanFactoryPostProcessor schemaFilesCleanupPostProcessor() {
        return bf -> {
            try {
                Files.deleteIfExists(Path.of("./todo-service/src/main/resources/db/auto/generate.sql"));
            } catch (IOException e) {
                throw new IllegalStateException(e);
            }
        };
    }
}
