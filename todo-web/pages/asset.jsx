import NavigationBar from "../components/NavigationBar";
import Container from "../components/Container";
import {callApi} from "../apis/request";
import {API, ApiPrefix, AssetRecords, AssetTypePaging, GET, POST, RecentRecordTimeList} from "../apis/apiPath";
import AssetType from "../components/asset/AssetType";
import {useState} from "react";
import RecordValue from "../components/asset/RecordValue";
import RecordTime from "../components/asset/RecordTime";
import moment from "moment";
import ReactEcharts from "echarts-for-react";
import {getSourceCookie} from "../apis/cookies";


export default function Asset({legend, assetType, recordTime, assetRecord}) {
    const [options, setOptions] = useState({
        tooltip: {
            trigger: 'axis'
        },
        legend: {
            data: legend
        },
        grid: {
            left: '5%',
            right: '5%',
            bottom: '2%',
            containLabel: true
        },
        toolbox: {
            orient: 'vertical',
            feature: {
                saveAsImage: {},
                restore: {},
                dataZoom: {}
            }
        },
        xAxis: {
            type: 'category',
            boundaryGap: true,
            data: recordTime
        },
        yAxis: {
            type: 'value',
            axisLabel: {
                show: true
            }
        },
        series: assetRecord
    });

    const [asset, setAsset] = useState({
        typeId: 1,
        recordValue: 0.00,
        recordTime: moment(moment.now()).format('yyyy-MM-DD')
    });

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
            getChartData();
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

    function getChartData() {
        callApi({method: GET, url: "/api/asset/record/getRecentRecordTimeList"}).then(r => {
            if (r.data == null) {
                return;
            }
            let data = r.data;
            for (let i = 0; i < data.length; i++) {
                data[i] = data[i].substring(0, 10);
            }
            setOptions({
                ...options,
                xAxis: {
                    type: 'category',
                    boundaryGap: true,
                    data: data
                }
            });
            callApi({method: GET, url: "/api/asset/record/getRecords"}).then(r => {
                setOptions({
                    ...options,
                    xAxis: {
                        type: 'category',
                        boundaryGap: true,
                        data: data
                    },
                    series: r.data
                })
            })
        });
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
        <ReactEcharts theme="dark" option={options} style={{width: "100%", height: "50vh", margin: '10px auto'}}/>
        <NavigationBar active={2}/>
    </Container>
}

export async function getServerSideProps({req, query}) {
    const assetTypeResponse = await callApi({
        method: POST,
        url: ApiPrefix + process.env.API_HOST + AssetTypePaging,
        params: {
            "page": 1,
            "pageSize": 20,
            "orders": [{"name": "create_time", "direction": "desc"}]
        }
    });

    console.log(assetTypeResponse)

    let legend = [];

    for (let i = 0; i < assetTypeResponse.data.length; i++) {
        legend[i] = assetTypeResponse.data[i].typeName;
    }

    legend.push('Total');

    const recentRecordTimeListResponse = await callApi({
        url: ApiPrefix + process.env.API_HOST + RecentRecordTimeList,
        token: getSourceCookie(req.headers.cookie, 'token')
    });

    let recordTimeData = recentRecordTimeListResponse.data;
    for (let i = 0; i < recordTimeData.length; i++) {
        recordTimeData[i] = recordTimeData[i].substring(2, 10);
    }

    const assetRecordResponse = await callApi({
        url: ApiPrefix + process.env.API_HOST + AssetRecords,
        token: getSourceCookie(req.headers.cookie, 'token')
    });

    return {
        props: {
            legend: legend,
            assetType: assetTypeResponse.data,
            recordTime: recordTimeData,
            assetRecord: assetRecordResponse.data,
        }
    }
}
