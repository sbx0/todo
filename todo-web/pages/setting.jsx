import NavigationBar from "../components/NavigationBar";
import Container from "../components/Container";
import {callApi} from "../apis/taskApi";
import TaskList from "../components/TaskList";

export default ({initData, category}) => {

    return <Container>
        <TaskList initData={initData}
                  category={category}
                  taskStatus={0}
                  orderBy={'create_time'}
                  timeType={'create_time'}/>
        <NavigationBar active={3}/>
    </Container>
}

export async function getServerSideProps({req, query}) {
    const result = await callApi({
        url: "http://localhost:9999/task/paging",
        params: {
            "page": 1,
            "pageSize": 20,
            "taskStatus": 0,
            "categoryId": 0,
            "orders": [{"name": "create_time", "direction": "desc"}]
        }
    });

    const category = await callApi({
        url: "http://localhost:9999/category/paging",
        params: {
            "page": 1,
            "pageSize": 20,
            "taskStatus": 0,
            "categoryId": 0,
            "orders": [{"name": "create_time", "direction": "desc"}]
        }
    });

    return {props: {initData: result.data, category: category.data}}
}
