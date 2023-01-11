import NavigationBar from "../components/NavigationBar";
import Container from "../components/Container";
import {callApi} from "../apis/taskApi";
import {
    ApiPrefix,
    AssetRecordPaging,
    AssetTypePaging,
    buildDefaultParamsForAssetRecordPaging,
    POST
} from "../apis/apiPath";
import AssetType from "../components/asset/AssetType";
import {useState} from "react";

export default ({data, assetType}) => {
    const [asset, setAsset] = useState({
        typeId: 1,
        recordValue: 0.00,
        recordTime: 'yyyy-MM-dd HH:mm:ss'
    });

    function setAssetType(value) {
        setAsset({...asset, typeId: value})
    }

    return <Container>
        <AssetType value={asset.typeId}
                   initData={assetType}
                   callback={setAssetType}/>
        {JSON.stringify(asset)}
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
