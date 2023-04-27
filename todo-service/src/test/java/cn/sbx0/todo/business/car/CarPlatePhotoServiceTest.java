package cn.sbx0.todo.business.car;

import cn.sbx0.todo.business.car.entity.CarPlatePhoto;
import cn.sbx0.todo.entity.DefaultPagingRequest;
import cn.sbx0.todo.repositories.CarPlatePhotoRepository;
import cn.sbx0.todo.service.common.Paging;
import jakarta.annotation.Resource;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.BDDMockito.given;

/**
 * @author sbx0
 * @since 2023/4/27
 */
@MockBean(classes = {CarPlatePhotoRepository.class, CarConfigService.class})
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.NONE, classes = {CarPlatePhotoService.class})
class CarPlatePhotoServiceTest {
    @Resource
    private CarPlatePhotoService service;
    @Resource
    private CarPlatePhotoRepository repository;

    @Test
    public void paging() {
        List<CarPlatePhoto> carPlatePhotos = new ArrayList<>();
        carPlatePhotos.add(CarPlatePhoto.builder()
                .id(1L)
                .carPlateNum("carPlateNum")
                .areaName("areaName")
                .createTime(LocalDateTime.now())
                .floorName("floorName")
                .imgUrl("imgUrl")
                .lotName("lotName")
                .parkNo("parkNo")
                .updateTime(LocalDateTime.now())
                .build());
        given(repository.paging(any(), any())).willReturn(new PageImpl<>(carPlatePhotos, PageRequest.of(1, 10), 10));

        Paging<CarPlatePhoto> paging = service.paging(DefaultPagingRequest.singleton());
    }
}
