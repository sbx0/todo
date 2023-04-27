import NavigationBar from "../components/NavigationBar";
import Container from "../components/Container";
import {callApi} from "../apis/request";
import {API, AssetTypePaging, GET, POST} from "../apis/apiPath";
import AssetType from "../components/asset/AssetType";
import {useEffect, useState} from "react";
import RecordValue from "../components/asset/RecordValue";
import RecordTime from "../components/asset/RecordTime";
import moment from "moment";


export default function Asset() {
    const [assetTypeData, setAssetTypeData] = useState([]);
    const [asset, setAsset] = useState({
        typeId: 1,
        recordValue: 0.00,
        recordTime: moment(moment.now()).format('yyyy-MM-DD')
    });

    useEffect(() => {
        getAssetType();
        getFlow();
    }, []);

    function getFlow() {
        callApi({
            method: GET,
            url: API + "/asset/record/flow",
            params: asset
        }).then(r => {

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
            setAsset({
                ...asset,
                recordValue: 0.00,
                recordTime: moment(moment.now()).format('yyyy-MM-DD')
            });
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
        <button style={{width: '100%', height: '40px', margin: '5px auto'}} onClick={saveAsset}>Save</button>

        <NavigationBar active={2}/>
    </Container>
}
