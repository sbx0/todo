import useSWR from "swr";
import {CategoryPaging, POST} from "../apis/apiPath";
import {fetcher} from "../apis/request";

export default function useCategory(page, pageSize) {
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

    return {
        response: data,
        error,
        isLoading
    }
}