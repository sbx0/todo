import NavigationBar from "../components/NavigationBar";
import TaskList from "../components/TaskList";
import Container from "../components/Container";
import {callApi} from "../apis/request";
import {ApiPrefix, CategoryPaging, GET, POST, TaskPaging, TaskStatistics} from "../apis/apiPath";
import {getSourceCookie} from "../apis/cookies";

export default function Done({initData, category, statistics}) {

    return <Container>
        <TaskList initData={initData}
                  category={category}
                  statistics={statistics}
                  taskStatus={1}/>
        <NavigationBar active={1}/>
    </Container>
}

export async function getServerSideProps({req, query}) {
    let categoryId = 0;
    if (query.categoryId != null) {
        categoryId = query.categoryId;
    }

    let taskPaging = await callApi({
        method: POST,
        url: ApiPrefix + process.env.API_HOST + TaskPaging,
        params: {
            "page": 1,
            "pageSize": 20,
            "taskStatus": 1,
            "categoryId": categoryId,
            "orders": [{"name": "update_time", "direction": "desc"}]
        },
        token: getSourceCookie(req.headers.cookie, 'token')
    });

    let category = await callApi({
        method: POST,
        url: ApiPrefix + process.env.API_HOST + CategoryPaging,
        params: {
            "page": 1,
            "pageSize": 20,
            "orders": [{"name": "create_time", "direction": "desc"}]
        }
    });

    let statistics = await callApi({
        method: GET,
        url: ApiPrefix + process.env.API_HOST + TaskStatistics,
        params: {
            "categoryId": categoryId,
        },
        token: getSourceCookie(req.headers.cookie, 'token')
    });

    return {
        props: {
            initData: taskPaging,
            category: category.data,
            statistics: statistics.data
        }
    }
}

