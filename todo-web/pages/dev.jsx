import NavigationBar from "../components/NavigationBar";
import Container from "../components/Container";
import {callApi} from "../apis/taskApi";
import {ApiPrefix, AssetRecordPaging, buildDefaultParamsForAssetRecordPaging, POST} from "../apis/apiPath";

export default ({data}) => {

    return <Container>
        {JSON.stringify(data)}
        <NavigationBar active={3}/>
    </Container>
}

export async function getServerSideProps({req, query}) {
    const response = await callApi({
        method: POST,
        url: ApiPrefix + req.headers.host + AssetRecordPaging,
        params: buildDefaultParamsForAssetRecordPaging()
    });

    return {
        props: {
            data: response.data
        }
    }
}
