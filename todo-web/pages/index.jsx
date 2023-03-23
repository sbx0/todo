import NavigationBar from "../components/NavigationBar";
import Container from "../components/Container";
import TaskList from "../components/TaskList";
import {callApi} from "../apis/request";
import {CategoryPaging, POST, TaskPaging, TaskStatistics} from "../apis/apiPath";
import {useEffect, useState} from "react";
import {getCurrentCategory} from "../components/task/TaskCategory";

export default function Index() {
    const [initData, setInitData] = useState(null);
    const [categoryData, setCategoryData] = useState([]);
    const [statisticsData, setStatisticsData] = useState({
        completed: 0,
        uncompleted: 0
    });

    useEffect(() => {
        getInitData();
        getCategoryData();
        getStatisticsData();
    }, [])

    function getInitData() {
        callApi({
            method: POST,
            url: TaskPaging,
            params: {
                "page": 1,
                "pageSize": 20,
                "taskStatus": 0,
                "categoryId": getCurrentCategory(),
                "orders": [{"name": "create_time", "direction": "desc"}]
            }
        }).then(r => {
            setInitData(r)
        });
    }

    function getCategoryData() {
        callApi({
            method: POST,
            url: CategoryPaging,
            params: {
                "page": 1,
                "pageSize": 20,
                "orders": [{"name": "create_time", "direction": "desc"}]
            }
        }).then(r => {
            setCategoryData(r.data);
        });
    }

    function getStatisticsData() {
        callApi({
            url: TaskStatistics,
            params: {
                "categoryId": getCurrentCategory(),
            }
        }).then(r => {
            let statistics = {
                completed: 0,
                uncompleted: 0
            };

            if (r.data) {
                for (let i = 0; i < r.data.length; i++) {
                    if (r.data[i].key === 'completed') {
                        statistics.completed = r.data[i].value;
                    } else if (r.data[i].key === 'uncompleted') {
                        statistics.uncompleted = r.data[i].value;
                    }
                }
            }

            setStatisticsData(statistics);
        });
    }

    return <Container>
        <TaskList initData={initData}
                  category={categoryData}
                  statistics={statisticsData}
                  taskStatus={0}/>
        <NavigationBar active={0}/>
    </Container>
}
