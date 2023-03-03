package cn.sbx0.todo.repositories;

import cn.sbx0.todo.business.car.entity.CarConfig;
import org.springframework.data.jpa.repository.JpaRepository;

/**
 * @author sbx0
 * @since 2023/3/3
 */
public interface CarConfigRepository extends JpaRepository<CarConfig, Long> {
}
