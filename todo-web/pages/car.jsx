import CarPhotoInfo from "../components/car/CarPhotoInfo";
import {useEffect, useState} from "react";
import {callApi} from "../apis/taskApi";
import {POST} from "../apis/apiPath";
import NavigationBar from "../components/NavigationBar";
import Container from "../components/Container";

export default function Car() {
    const [infos, setInfos] = useState([]);

    useEffect(() => {
        callApi({
            method: POST, url: "/api/car/plate/photo/paging", params: {
                page: 1, pageSize: 25
            }
        }).then(r => {
            setInfos(r.data);
        })
    }, [])

    return <Container>
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
