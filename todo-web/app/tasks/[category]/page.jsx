import {callApi} from "../../../apis/request";
import {ApiPrefix, POST, TaskPaging} from "../../../apis/apiPath";
import {cookies} from "next/headers";
import Tasks from "./components/tasks";


export default async function Page({params}) {
    let token = cookies().get("token").value;

    const response = await callApi({
        method: POST,
        url: ApiPrefix + TaskPaging,
        params: {
            page: 1,
            pageSize: 20,
            categoryId: 0,
            taskStatus: 0
        },
        token: token
    });

    let data = [];
    let key = `${1}-${20}-${0}-${0}-`

    if (response.success) {
        for (let i = 0; i < response.data.length; i++) {
            data.push({
                key: key + response.data[i].id,
                ...response.data[i]
            });
        }
    }

    return <Tasks initTasks={data} category={params.category}/>;
}