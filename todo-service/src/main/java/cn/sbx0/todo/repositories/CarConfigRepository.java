package cn.sbx0.todo.repositories;

import cn.sbx0.todo.business.car.entity.CarConfig;
import cn.sbx0.todo.entity.PagingRequest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

/**
 * @author sbx0
 * @since 2023/3/3
 */
public interface CarConfigRepository extends JpaRepository<CarConfig, Long> {
    //language=MySQL
    String CUSTOM_PAGING_SQL = """
            SELECT id, car_plate_num, lot_id, api_host, api_path, create_time, update_time
            FROM car_config""";
    //language=MySQL
    String CUSTOM_PAGING_COUNT_SQL = """
            SELECT COUNT(*)
            FROM car_config""";

    @Query(value = CUSTOM_PAGING_SQL, countQuery = CUSTOM_PAGING_COUNT_SQL, nativeQuery = true)
    Page<CarConfig> paging(PagingRequest pagingRequest, PageRequest pageRequest);
}
