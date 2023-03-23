import useSWR from "swr";
import {POST, TaskPaging} from "../apis/apiPath";
import {callApi, fetcher} from "../apis/request";
import TaskItem from "./task/TaskItem";

export default function TaskPage({page, pageSize, taskStatus, categoryId}) {
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

    const changeTask = (task) => {
        callApi({
            method: POST,
            url: '/api/task/update',
            params: task
        }).then(() => {

        }).finally(() => {

        })
    }

    return <>
        {data?.data?.map((one) =>
            <TaskItem key={'taskInfo_' + one.id + '_' + one.createTime + one.updateTime}
                      one={one}
                      change={changeTask}/>)}
    </>
}
