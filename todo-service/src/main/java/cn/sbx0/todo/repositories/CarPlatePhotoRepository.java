package cn.sbx0.todo.repositories;

import cn.sbx0.todo.business.car.entity.CarPlatePhoto;
import cn.sbx0.todo.entity.PagingRequest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

/**
 * @author sbx0
 * @since 2023/3/3
 */
public interface CarPlatePhotoRepository extends JpaRepository<CarPlatePhoto, Long> {
    //language=MySQL
    String CUSTOM_PAGING_SQL = """
            SELECT id,
                   car_plate_num,
                   lot_name,
                   floor_name,
                   park_no,
                   img_url,
                   create_time,
                   update_time
            FROM car_plate_photo""";
    //language=MySQL
    String CUSTOM_PAGING_COUNT_SQL = """
            SELECT COUNT(*)
            FROM car_plate_photo""";

    @Query(value = CUSTOM_PAGING_SQL, countQuery = CUSTOM_PAGING_COUNT_SQL, nativeQuery = true)
    <T extends PagingRequest> Page<CarPlatePhoto> paging(T pagingRequest, Pageable pageable);
}
