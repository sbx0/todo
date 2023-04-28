import NavigationBar from "../components/NavigationBar";
import Container from "../components/Container";
import {callApi} from "../apis/request";
import {API, AssetTypePaging, GET, POST} from "../apis/apiPath";
import AssetType from "../components/asset/AssetType";
import {useEffect, useState} from "react";
import RecordValue from "../components/asset/RecordValue";
import RecordTime from "../components/asset/RecordTime";
import moment from "moment";
import Button from "../components/basic/Button";


export default function Asset() {
    const [assetTypeData, setAssetTypeData] = useState([]);
    const [asset, setAsset] = useState({
        typeId: 1,
        recordValue: 0.00,
        recordTime: moment(moment.now()).format('yyyy-MM-DD')
    });
    const [flows, setFlows] = useState([]);

    useEffect(() => {
        getAssetType();
        getFlow();
    }, []);

    function getFlow() {
        callApi({
            method: GET,
            url: API + "/asset/record/flow"
        }).then(r => {
            if (r.success) {
                setFlows(r.data);
            }
        })
    }

    function saveAsset() {
        asset.recordValue = (Math.round(asset.recordValue * 100) / 100).toFixed(2);
        asset.recordTime = moment(asset.recordTime).format('yyyy-MM-DD HH:mm:ss');

        callApi({
            method: POST,
            url: API + "/asset/record/save",
            params: asset
        }).then(r => {
            if (r.success) {
                setAsset({
                    ...asset,
                    recordValue: 0.00,
                    recordTime: moment(moment.now()).format('yyyy-MM-DD')
                });
                getFlow();
            }
        })
    }

    function setAssetType(value) {
        setAsset({...asset, typeId: parseInt(value)})
    }

    function setRecordValue(value) {
        setAsset({...asset, recordValue: value})
    }

    function setRecordTime(value) {
        setAsset({...asset, recordTime: value})
    }

    function getAssetType() {
        callApi({
            method: POST,
            url: AssetTypePaging,
            params: {
                "page": 1,
                "pageSize": 20,
                "orders": [{"name": "create_time", "direction": "desc"}]
            }
        }).then(r => {
            setAssetTypeData(r.data)
        })
    }

    return <Container>
        <AssetType value={asset.typeId}
                   initData={assetTypeData}
                   callback={setAssetType}/>
        <RecordValue value={asset.recordValue}
                     callback={setRecordValue}/>
        <RecordTime value={asset.recordTime}
                    callback={setRecordTime}/>
        <Button onClick={saveAsset}>保存</Button>

        {
            flows.map((one, index) => {
                return <div key={index} className={"card"}>
                    <div>{one.date}</div>
                    <div>{one.growth}</div>
                    <div>{(one.growthRate * 100).toFixed(0) + '%'}</div>
                    <div>{one.total}</div>
                </div>
            })
        }

        <NavigationBar active={2}/>
        <style jsx>{`
          .card {
            width: 100%;
            margin: 10px 0 0 0;
            padding: 10px;
            background: #262a2d;
            border-radius: 5px;
            display: inline-grid;
            grid-template-columns: 1fr 1fr 1fr 1fr;
            text-align: center;
          }
        `}</style>
    </Container>
}
