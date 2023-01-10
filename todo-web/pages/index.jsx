import NavigationBar from "../components/NavigationBar";
import Container from "../components/Container";
import TaskList from "../components/TaskList";
import {callApi} from "../apis/taskApi";

export default ({initData, category, statistics}) => {

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
    const result = await callApi({
        method: 'POST',
        url: "http://" + req.headers.host + "/api/task/paging",
        params: {
            "page": 1,
            "pageSize": 20,
            "taskStatus": 0,
            "categoryId": categoryId,
            "orders": [{"name": "create_time", "direction": "desc"}]
        }
    });

    const category = await callApi({
        method: 'POST',
        url: "http://" + req.headers.host + "/api/category/paging",
        params: {
            "page": 1,
            "pageSize": 20,
            "orders": [{"name": "create_time", "direction": "desc"}]
        }
    });

    const statistics = await callApi({
        method: 'GET',
        url: "http://" + req.headers.host + "/api/task/statistics",
        params: {
            "categoryId": categoryId,
        }
    });

    return {
        props: {
            initData: result.data,
            category: category.data,
            statistics: statistics.data
        }
    }
}
