package cn.sbx0.todo.business.car.entity;

import lombok.Data;

/**
 * @author sbx0
 * @since 2023/3/3
 */
@Data
public class CarPlatePhotoResponse {
    private ResponseData data;

    @Data
    private static class ResponseData {

        private CarPlaceInfo carPlaceInfo;

        @Data
        private static class CarPlaceInfo {

            private String carPlateNum;
            private String lotName;
            private String parkNo;
            private FloorInfo floorInfo;
            private String areaName;
            private String imgUrl;

            @Data
            private static class FloorInfo {
                private String floorName;
            }
        }

    }
}
