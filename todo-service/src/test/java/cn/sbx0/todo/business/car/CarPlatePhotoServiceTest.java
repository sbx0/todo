package cn.sbx0.todo.business.car;

import cn.sbx0.todo.business.car.entity.CarPlatePhoto;
import cn.sbx0.todo.entity.DefaultPagingRequest;
import cn.sbx0.todo.entity.OrderRequest;
import cn.sbx0.todo.entity.PagingRequest;
import cn.sbx0.todo.repositories.CarPlatePhotoRepository;
import cn.sbx0.todo.service.common.Code;
import cn.sbx0.todo.service.common.Paging;
import jakarta.annotation.Resource;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
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
    public void save() {
        given(repository.save(any())).willReturn(
                CarPlatePhoto.builder()
                        .id(1L)
                        .carPlateNum("carPlateNum")
                        .areaName("areaName")
                        .createTime(LocalDateTime.now())
                        .floorName("floorName")
                        .imgUrl("imgUrl")
                        .lotName("lotName")
                        .parkNo("parkNo")
                        .updateTime(LocalDateTime.now())
                        .build()
        );
        Boolean result = service.save(CarPlatePhoto.builder()
                .carPlateNum("carPlateNum")
                .build());
        assertTrue(result);
    }

    @Test
    public void saveNull() {
        Boolean result = service.save(null);
        assertFalse(result);
    }

    @Test
    public void getLastPhoto() {
        String test = "test";
        given(repository.getLastPhoto()).willReturn(test);

        String lastPhoto = service.getLastPhoto();

        assertEquals(test, lastPhoto);
    }

    @Test
    public void pagingWithDefault() {
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
        given(repository.paging(any(), any())).willReturn(new PageImpl<>(carPlatePhotos, PageRequest.of(1, 10), 1));

        Paging<CarPlatePhoto> paging = service.paging(DefaultPagingRequest.singleton());

        assertNotNull(paging);
        assertEquals(true, paging.getSuccess());
        assertEquals(Code.SUCCESS, paging.getCode());
        assertNotNull(paging.getData());
        assertNotNull(paging.getCommon());
    }

    @Test
    public void pagingWithDesc() {
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
        given(repository.paging(any(), any())).willReturn(new PageImpl<>(carPlatePhotos, PageRequest.of(1, 10, Sort.by(Sort.Order.asc("carPlateNum"))), 1));

        Paging<CarPlatePhoto> paging = service.paging(PagingRequest.builder()
                .page(1)
                .pageSize(10)
                .orders(List.of(
                        OrderRequest.builder()
                                .name("carPlateNum")
                                .direction("desc")
                                .build()
                ))
                .build());

        assertNotNull(paging);
        assertEquals(true, paging.getSuccess());
        assertEquals(Code.SUCCESS, paging.getCode());
        assertNotNull(paging.getData());
        assertNotNull(paging.getCommon());
    }

    @Test
    public void pagingWithAsc() {
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
        given(repository.paging(any(), any())).willReturn(new PageImpl<>(carPlatePhotos, PageRequest.of(1, 10, Sort.by(Sort.Order.asc("carPlateNum"))), 1));

        Paging<CarPlatePhoto> paging = service.paging(PagingRequest.builder()
                .page(1)
                .pageSize(10)
                .orders(List.of(
                        OrderRequest.builder()
                                .name("carPlateNum")
                                .direction("asc")
                                .build()
                ))
                .build());

        assertNotNull(paging);
        assertEquals(true, paging.getSuccess());
        assertEquals(Code.SUCCESS, paging.getCode());
        assertNotNull(paging.getData());
        assertNotNull(paging.getCommon());
    }
}
