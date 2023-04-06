package cn.sbx0.todo.business.car;

import cn.sbx0.todo.business.car.entity.CarPlatePhoto;
import cn.sbx0.todo.entity.PagingRequest;
import cn.sbx0.todo.service.common.Paging;
import cn.sbx0.todo.service.common.Result;
import jakarta.annotation.Resource;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * @author sbx0
 * @since 2022/12/2
 */
@RestController
@RequestMapping(("/car/plate/photo"))
public class CarPlatePhotoController {
    @Resource
    private CarPlatePhotoService carPlatePhotoService;

    @PostMapping("/paging")
    public Paging<CarPlatePhoto> paging(@RequestBody PagingRequest pagingRequest) {
        return carPlatePhotoService.paging(pagingRequest);
    }

    @PostMapping("/update")
    public Result<String> update() {
        return carPlatePhotoService.update();
    }
}
