import useSWR from "swr";
import {TaskStatistics} from "../apis/apiPath";
import {fetcher} from "../apis/request";
import {useEffect} from "react";
import {getCache, setCache} from "../components/Cache";

export default function useStatistics(categoryId) {
    const cacheKey = `useStatistics-${categoryId}`;
    const {data, error, isLoading} = useSWR(
        [TaskStatistics, categoryId],
        ([url, categoryId]) => fetcher({
            url: url,
            params: {
                "categoryId": categoryId,
            }
        })
    );
    let statistics = {
        completed: 0,
        uncompleted: 0
    };

    let cacheData;
    let cacheDataText = getCache(cacheKey);
    if (cacheDataText != null && cacheDataText !== "undefined" && cacheDataText !== 'null') {
        cacheData = JSON.parse(cacheDataText);
    } else {
        cacheData = statistics;
    }

    if (data?.data) {
        for (let i = 0; i < data.data.length; i++) {
            if (data.data[i].key === 'completed') {
                statistics.completed = data.data[i].value;
            } else if (data.data[i].key === 'uncompleted') {
                statistics.uncompleted = data.data[i].value;
            }
        }
    }

    useEffect(() => {
        if (!isLoading) {
            setCache(cacheKey, JSON.stringify(statistics));
        }
    }, [isLoading])

    return {
        response: {
            data: isLoading ? cacheData : statistics
        },
        error,
        isLoading
    }
}