import NavigationBar from "../components/NavigationBar";
import Container from "../components/Container";
import TaskList from "../components/TaskList";
import {callApi} from "../apis/taskApi";
import {ApiPrefix, CategoryPaging, GET, POST, TaskPaging, TaskStatistics} from "../apis/apiPath";

export default function Index({initData, category, statistics}) {

    return <Container>
        <TaskList initData={initData}
                  category={category}
                  statistics={statistics}
                  taskStatus={0}
                  orderBy={'create_time'}
                  timeType={'create_time'}/>
        <NavigationBar active={0}/>
    </Container>
}

export async function getServerSideProps({req, query}) {
    let categoryId = 0;
    if (query.categoryId != null) {
        categoryId = query.categoryId;
    }

    const taskPaging = await callApi({
        method: POST,
        url: ApiPrefix + process.env.API_HOST + TaskPaging,
        params: {
            "page": 1,
            "pageSize": 20,
            "taskStatus": 0,
            "categoryId": categoryId,
            "orders": [{"name": "create_time", "direction": "desc"}]
        }
    });

    const category = await callApi({
        method: POST,
        url: ApiPrefix + process.env.API_HOST + CategoryPaging,
        params: {
            "page": 1,
            "pageSize": 20,
            "orders": [{"name": "create_time", "direction": "desc"}]
        }
    });

    const statistics = await callApi({
        method: GET,
        url: ApiPrefix + process.env.API_HOST + TaskStatistics,
        params: {
            "categoryId": categoryId,
        }
    });

    return {
        props: {
            initData: taskPaging,
            category: category.data,
            statistics: statistics.data
        }
    }
}
