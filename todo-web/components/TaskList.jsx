import styles from "./TaskList.module.css";
import {useState} from "react";
import TaskItem from "./task/TaskItem";
import {buildPath, callApi} from "../apis/request";
import Loading from "./Loading";
import {getCache} from "./Cache";
import StatisticsPanel from "./StatisticsPanel";
import {useRouter} from "next/router";
import TaskInput from "./task/TaskInput";
import {GET, POST, TaskPaging, TaskStatistics} from "../apis/apiPath";

export default function TaskList({initData, category, statistics, taskStatus}) {
    const router = useRouter()
    const [categoryId, setCategoryId] = useState(() => {
        // just for next.js
        if (typeof window !== 'undefined') {
            let cache = getCache('categoryId');
            if (cache == null) {
                cache = '0';
            }
            return parseInt(cache);
        } else {
            return 0;
        }
    });
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(20);
    const [data, setData] = useState(initData);
    const [statisticsData, setStatisticsData] = useState(statistics);

    const changeTask = (task) => {
        setLoading(true);
        callApi({
            method: POST,
            url: '/api/task/update',
            params: task
        }).then(() => {
            let newData = [];
            for (let i = 0; i < data.data.length; i++) {
                if (data.data[i].id !== task.id) {
                    newData.push(data.data[i]);
                } else {
                    newData.push(task);
                }
            }
            setData({...data, data: newData});
        }).finally(() => {
            setLoading(false);
        })
    }

    const getTaskPaging = (page, pageSize, categoryId, taskStatus) => {
        setPage(page);
        setPageSize(pageSize);
        setLoading(true);
        callApi({
            method: POST,
            url: TaskPaging,
            params: {
                "page": page,
                "pageSize": pageSize,
                "taskStatus": taskStatus,
                "categoryId": categoryId,
                "orders": [{"name": "create_time", "direction": "desc"}]
            }
        }).then(r => {
            if (page != null && page > 1) {
                setData({...r, data: data.data.concat(r.data)});
            } else {
                setData(r);
            }
        }).finally(() => {
            setLoading(false);
        })
    }

    const categoryClickEvent = (categoryId) => {
        router.replace({query: {...router.query, categoryId: categoryId},}).then(r => r);
        setPage(1);
        getTaskPaging(1, pageSize, categoryId, taskStatus);
        callApi({
            method: GET,
            url: TaskStatistics,
            params: {
                "categoryId": categoryId,
            }
        }).then(r => {
            let statistics = {
                completed: 0,
                uncompleted: 0
            }
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

    const saveEvent = (task) => {
        router.push(buildPath("/", router.query)).then(r => r);
        setPage(1);
        let newData = data.data.slice(0);
        newData.reverse();
        newData.push(task);
        newData.reverse();
        setData({...data, data: newData});
    }

    return <>
        <StatisticsPanel initData={statisticsData}/>
        <TaskInput categoryId={categoryId}
                   initData={category}
                   setCategoryId={setCategoryId}
                   saveEvent={saveEvent}
                   setLoading={setLoading}
                   clickEvent={categoryClickEvent}/>
        <div className={styles.taskItemList}>
            {data?.data?.map((one) =>
                <TaskItem key={'taskInfo_' + one.id + '_' + one.createTime + one.updateTime}
                          one={one}
                          change={changeTask}/>)}
            {
                page < data?.common?.totalPage ?
                    <button className={styles.button} onClick={() => {
                        getTaskPaging(page + 1, pageSize, categoryId, taskStatus);
                    }}>
                        Load More
                    </button>
                    :
                    <></>
            }
        </div>
        <Loading active={loading}/>
    </>;
}
