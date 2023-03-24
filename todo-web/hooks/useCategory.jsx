import useSWR from "swr";
import {CategoryPaging, POST} from "../apis/apiPath";
import {fetcher} from "../apis/request";
import {useEffect} from "react";
import {getCache, setCache} from "../components/Cache";

export default function useCategory(page, pageSize) {
    const cacheKey = `useCategory-${page}-${pageSize}`;
    const {data, error, isLoading} = useSWR(
        [CategoryPaging, page, pageSize],
        ([url, page, pageSize]) => fetcher({
            method: POST,
            url: url,
            params: {
                "page": page,
                "pageSize": pageSize,
                "orders": [{"name": "create_time", "direction": "desc"}]
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

    return {
        response: isLoading ? cacheData : data,
        error,
        isLoading
    }
}