package cn.sbx0.todo.repositories;

import cn.sbx0.todo.business.car.entity.CarPlatePhoto;
import org.springframework.data.jpa.repository.JpaRepository;

/**
 * @author sbx0
 * @since 2023/3/3
 */
public interface CarPlatePhotoRepository extends JpaRepository<CarPlatePhoto, Long> {
}
