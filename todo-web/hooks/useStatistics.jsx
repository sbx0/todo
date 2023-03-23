import useSWR from "swr";
import {TaskStatistics} from "../apis/apiPath";
import {fetcher} from "../apis/request";

export default function useStatistics(categoryId) {
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

    if (data?.data) {
        for (let i = 0; i < data.data.length; i++) {
            if (data.data[i].key === 'completed') {
                statistics.completed = data.data[i].value;
            } else if (data.data[i].key === 'uncompleted') {
                statistics.uncompleted = data.data[i].value;
            }
        }
    }

    return {
        response: {
            data: statistics
        },
        error,
        isLoading
    }
}