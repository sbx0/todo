import CarPhotoInfo from "../components/car/CarPhotoInfo";
import {useEffect, useState} from "react";
import {callApi} from "../apis/request";
import {POST} from "../apis/apiPath";
import NavigationBar from "../components/NavigationBar";
import Container from "../components/Container";
import Button from "../components/basic/Button";
import FoamBox from "../components/layout/FoamBox";

export default function Car() {
    const [infos, setInfos] = useState([]);

    function getPhotos() {
        callApi({
            method: POST, url: "/api/car/plate/photo/paging", params: {
                page: 1, pageSize: 25
            }
        }).then(r => {
            setInfos(r.data);
        });
    }

    useEffect(() => {
        getPhotos();
    }, []);

    function update() {
        callApi({
            method: POST, url: "/api/car/plate/photo/update"
        }).then(r => {
            if (r.success) {
                getPhotos();
            }
        });
    }

    return <Container>
        <FoamBox>
            <Button onClick={() => update()}>
                更新数据
            </Button>
        </FoamBox>
        {
            infos?.map(one => {
                return <CarPhotoInfo key={one.id}
                                     carPlateNum={one.carPlateNum}
                                     lotName={one.lotName}
                                     floorName={one.floorName}
                                     parkNo={one.parkNo}
                                     imgUrl={one.imgUrl}
                                     areaName={one.areaName}
                                     createTime={one.createTime}/>
            })
        }
        <NavigationBar active={3}/>
    </Container>
}
