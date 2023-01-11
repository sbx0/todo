import React, {useEffect, useState} from 'react';
import ReactEcharts from "echarts-for-react"
import {callApi} from "../../apis/taskApi";
import {GET} from "../../apis/apiPath";

function MyChart() {
    const [category, setCategory] = useState(['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']);
    const [options, setOptions] = useState({
        tooltip: {
            trigger: 'axis'
        },
        grid: {
            left: '3%',
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
    }, []);


    return <ReactEcharts option={options} style={{width: "100%", height: "1024px", margin: '0 auto'}}/>
}

export default MyChart