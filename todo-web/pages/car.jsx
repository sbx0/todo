import CarPhotoInfo from "../components/car/CarPhotoInfo";
import {useEffect, useState} from "react";
import {callApi} from "../apis/taskApi";
import {POST} from "../apis/apiPath";

export default function Car() {
    const [infos, setInfos] = useState([]);

    useEffect(() => {
        callApi({
            method: POST, url: "/api/car/plate/photo/paging", params: {
                page: 1, pageSize: 10
            }
        }).then(r => {
            setInfos(r.data);
        })
    }, [])

    return <div>
        {
            infos.map(one => {
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
    </div>
}
