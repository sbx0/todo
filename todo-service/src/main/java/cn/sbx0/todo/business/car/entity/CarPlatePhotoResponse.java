package cn.sbx0.todo.business.car.entity;

import lombok.Getter;
import lombok.Setter;

/**
 * @author sbx0
 * @since 2023/3/3
 */
@Setter
@Getter
public class CarPlatePhotoResponse {
    private ResponseData data;

    @Setter
    @Getter
    public static class ResponseData {

        private CarPlaceInfo carPlaceInfo;

        @Setter
        @Getter
        public static class CarPlaceInfo {

            private String carPlateNum;
            private String lotName;
            private String parkNo;
            private FloorInfo floorInfo;
            private String areaName;
            private String imgUrl;

            @Setter
            @Getter
            public static class FloorInfo {
                private String floorName;
            }
        }

    }
}
