import NavigationBar from "../components/NavigationBar";
import Container from "../components/Container";
import {callApi} from "../apis/taskApi";
import {
    API,
    ApiPrefix,
    AssetRecordPaging,
    AssetTypePaging,
    buildDefaultParamsForAssetRecordPaging,
    POST
} from "../apis/apiPath";
import AssetType from "../components/asset/AssetType";
import {useState} from "react";
import RecordValue from "../components/asset/RecordValue";
import RecordTime from "../components/asset/RecordTime";
import moment from "moment";
import MyChart from "../components/echart/MyChart";


export default ({data, assetType}) => {
    const [asset, setAsset] = useState({
        typeId: 1,
        recordValue: 0.00,
        recordTime: '2023-01-11'
    });

    function saveAsset() {
        asset.recordValue = (Math.round(asset.recordValue * 100) / 100).toFixed(2);
        asset.recordTime = moment(asset.recordTime).format('yyyy-MM-DD HH:mm:ss');

        callApi({
            method: POST,
            url: API + "/asset/record/save",
            params: asset
        }).then(r => {

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

    return <Container>
        <AssetType value={asset.typeId}
                   initData={assetType}
                   callback={setAssetType}/>
        <RecordValue value={asset.recordValue}
                     callback={setRecordValue}/>
        <RecordTime value={asset.recordTime}
                    callback={setRecordTime}/>
        <button style={{width: '100%', height: '40px', margin: '5px auto'}} onClick={saveAsset}>Save</button>
        <MyChart/>
        <NavigationBar active={2}/>
    </Container>
}

export async function getServerSideProps({req, query}) {
    const response = await callApi({
        method: POST,
        url: ApiPrefix + req.headers.host + AssetRecordPaging,
        params: buildDefaultParamsForAssetRecordPaging()
    });

    const assetType = await callApi({
        method: POST,
        url: ApiPrefix + req.headers.host + AssetTypePaging,
        params: buildDefaultParamsForAssetRecordPaging()
    });

    return {
        props: {
            data: response.data,
            assetType: assetType.data
        }
    }
}
