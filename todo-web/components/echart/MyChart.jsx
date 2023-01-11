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
            type: 'value'
        },
        series: [
            {
                name: 'Email',
                type: 'line',
                stack: 'Total',
                data: [120, 132, 101, 134, 90, 230, 210]
            },
            {
                name: 'Union Ads',
                type: 'line',
                stack: 'Total',
                data: [220, 182, 191, 234, 290, 330, 310]
            },
            {
                name: 'Video Ads',
                type: 'line',
                stack: 'Total',
                data: [150, 232, 201, 154, 190, 330, 410]
            },
            {
                name: 'Direct',
                type: 'line',
                stack: 'Total',
                data: [320, 332, 301, 334, 390, 330, 320]
            },
            {
                name: 'Search Engine',
                type: 'line',
                stack: 'Total',
                data: [820, 932, 901, 934, 1290, 1330, 1320]
            }
        ]
    });

    useEffect(() => {
        callApi({method: GET, url: "/api/asset/record/getRecentRecordTimeList"}).then(r => {
            let data = r.data;
            for (let i = 0; i < data.length; i++) {
                data[i] = data[i].substring(5, 10);
            }
            setOptions({
                ...options, xAxis: {
                    type: 'category',
                    boundaryGap: false,
                    data: data
                }
            })
        })
    }, []);


    return <ReactEcharts option={options} style={{width: "600px", height: "600px"}}/>
}

export default MyChart