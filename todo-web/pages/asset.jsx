import NavigationBar from "../components/NavigationBar";
import Container from "../components/Container";
import {callApi} from "../apis/taskApi";
import {API, ApiPrefix, AssetTypePaging, GET, POST} from "../apis/apiPath";
import AssetType from "../components/asset/AssetType";
import {useEffect, useState} from "react";
import RecordValue from "../components/asset/RecordValue";
import RecordTime from "../components/asset/RecordTime";
import moment from "moment";
import ReactEcharts from "echarts-for-react";


export default function Asset({assetType}) {
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

    const [category, setCategory] = useState(['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']);
    const [options, setOptions] = useState({
        tooltip: {
            trigger: 'axis'
        },
        legend: {
            data: ['Bank', 'Alipay', 'Wechat', 'Total']
        },
        grid: {
            left: '10%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        toolbox: {
            feature: {
                saveAsImage: {}
            }
        },
        xAxis: {
            type: 'category',
            boundaryGap: false,
            data: category
        },
        yAxis: {
            type: 'time',
            axisLabel: {
                show: false
            }
        },
        series: []
    });

    useEffect(() => {
        getChartData();
    }, []);

    function getChartData() {
        callApi({method: GET, url: "/api/asset/record/getRecentRecordTimeList"}).then(r => {
            let data = r.data;
            for (let i = 0; i < data.length; i++) {
                data[i] = data[i].substring(0, 10);
            }
            setOptions({
                ...options,
                xAxis: {
                    type: 'category',
                    boundaryGap: false,
                    data: data
                }
            });
            callApi({method: GET, url: "/api/asset/record/getRecords"}).then(r => {
                setOptions({
                    ...options,
                    xAxis: {
                        type: 'category',
                        boundaryGap: false,
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
        <ReactEcharts option={options} style={{width: "100%", height: "50vh", margin: '0 auto'}}/>
        <NavigationBar active={2}/>
    </Container>
}

export async function getServerSideProps({req, query}) {
    const assetType = await callApi({
        method: POST,
        url: ApiPrefix + process.env.API_HOST + AssetTypePaging,
        params: {
            "page": 1,
            "pageSize": 20,
            "orders": [{"name": "create_time", "direction": "desc"}]
        }
    });

    return {
        props: {
            assetType: assetType.data
        }
    }
}
