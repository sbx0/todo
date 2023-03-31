import useSWR from "swr";
import {POST, TaskPaging} from "../apis/apiPath";
import {fetcher} from "../apis/request";

export default function useTask(page, pageSize, taskStatus, categoryId) {
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

    return {
        response: data,
        error,
        isLoading,
        mutate
    }
}