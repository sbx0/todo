import useSWR from "swr";
import {POST, TaskPaging} from "../apis/apiPath";
import {callApi, fetcher} from "../apis/request";
import TaskItem from "./task/TaskItem";
import {getCache, setCache} from "./Cache";
import {useEffect} from "react";

export default function TaskPage({page, pageSize, taskStatus, categoryId}) {
    const cacheKey = `TaskPage-${page}-${pageSize}-${taskStatus}-${categoryId}`;
    const {data, error, isLoading, mutate} = useSWR(
        [TaskPaging, page, pageSize, taskStatus, categoryId],
        ([url, page, pageSize, taskStatus, categoryId]) => fetcher({
            method: POST,
            url: url,
            params: {
                "page": page,
                "pageSize": pageSize,
                "taskStatus": taskStatus,
                "categoryId": categoryId
            }
        })
    );

    let cacheData = data;
    let cacheDataText = getCache(cacheKey);
    if (cacheDataText != null && cacheDataText !== "undefined" && cacheDataText !== 'null') {
        cacheData = JSON.parse(cacheDataText);
    }

    useEffect(() => {
        if (!isLoading) {
            setCache(cacheKey, JSON.stringify(data));
        }
    }, [isLoading])

    const changeTask = (task) => {
        callApi({
            method: POST,
            url: '/api/task/update',
            params: task
        }).then(() => {

        }).finally(() => {

        })
    }

    return isLoading ?
        <>
            {cacheData?.data?.map((one) =>
                <TaskItem key={'taskInfo_' + one.id + '_' + one.createTime + one.updateTime}
                          one={one}
                          change={changeTask}/>)}
        </>
        :
        <>
            {data?.data?.map((one) =>
                <TaskItem key={'taskInfo_' + one.id + '_' + one.createTime + one.updateTime}
                          one={one}
                          change={changeTask}/>)}
        </>
}
