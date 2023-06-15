import {cookies} from "next/headers";
import Tasks from "./components/tasks";
import {callApi} from "../../../apis/request";
import {ApiPrefix, CategoryPaging, POST, TaskPaging} from "../../../apis/apiPath";

export default async function Page({params}) {
    let token = cookies().get("token").value;

    let initTasks = [];
    let initCategories = [];

    if (token != null && token.trim() !== '') {
        initTasks = await fetchTaskPaging(token, 1, 20, params.category, 0);
        initCategories = await fetchCategory(token);
    }

    return <Tasks initTasks={initTasks}
                  initCategories={initCategories}
                  category={params.category}/>;
}

async function fetchTaskPaging(token, page = 1, pageSize = 20, categoryId = 0, taskStatus = 0) {
    return callApi({
        method: POST,
        url: ApiPrefix + TaskPaging,
        params: {
            page: page,
            pageSize: pageSize,
            categoryId: categoryId,
            taskStatus: taskStatus
        },
        token: token
    }).then(response => {
        let data = [];
        if (response.success) {
            const key = `fetchTaskPaging-${page}-${pageSize}-${categoryId}-${taskStatus}-`
            for (let i = 0; i < response.data.length; i++) {
                data.push({
                    key: key + response.data[i].id,
                    ...response.data[i]
                });
            }
        }
        return data;
    });
}

async function fetchCategory(token, page = 1, pageSize = 100) {
    return callApi({
        method: POST,
        url: ApiPrefix + CategoryPaging,
        params: {
            page: page,
            pageSize: pageSize,
            orders: [{name: "create_time", direction: "desc"}]
        },
        token: token
    }).then(response => {
        let data = [];
        if (response.success) {
            const key = `fetchCategory-${page}-${pageSize}-`
            for (let i = 0; i < response.data.length; i++) {
                data.push({
                    key: key + response.data[i].id,
                    ...response.data[i]
                });
            }
        }
        return data;
    });
}
