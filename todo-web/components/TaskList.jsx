import styles from "./TaskList.module.css";
import {useState} from "react";
import TaskItem from "./task/TaskItem";
import {buildPath, callApi, updateApi} from "../apis/taskApi";
import Loading from "./Loading";
import {getCache} from "./Cache";
import StatisticsPanel from "./StatisticsPanel";
import {useRouter} from "next/router";
import TaskInput from "./task/TaskInput";
import {POST, TaskPaging} from "../apis/apiPath";

export default function TaskList({initData, category, statistics, taskStatus, orderBy, timeType}) {
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

    const setTaskStatusCompleted = (task) => {
        updateApi({
            ...task,
            taskStatus: 1
        }).then(() => {
            let newData = [];
            for (let i = 0; i < data.data.length; i++) {
                if (data.data[i].id !== task.id) {
                    newData.push(data.data[i]);
                }
            }
            setData({...data, data: newData});
        })
    }

    const setTaskStatusUndo = (task) => {
        updateApi({
            ...task,
            taskStatus: 0
        }).then(() => {
            let newData = [];
            for (let i = 0; i < data.data.length; i++) {
                if (data.data[i].id !== task.id) {
                    newData.push(data.data[i]);
                }
            }
            setData({...data, data: newData});
        })
    }

    const changeTask = (task) => {
        updateApi(task).then(() => {
            let newData = [];
            for (let i = 0; i < data.data.length; i++) {
                if (data.data[i].id !== task.id) {
                    newData.push(data.data[i]);
                } else {
                    newData.push(task);
                }
            }
            setData({...data, data: newData});
        })
    }

    const getTaskPaging = (page, pageSize, categoryId, taskStatus) => {
        setPage(page);
        setPageSize(pageSize);
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
        });
    }

    const categoryClickEvent = (value) => {
        router.replace({query: {...router.query, categoryId: value},});
        setPage(1);
        getTaskPaging(1, pageSize, value, taskStatus);
    }

    const saveEvent = () => {
        router.push(buildPath("/", router.query)).then(r => r);
        setPage(1);
        getTaskPaging(1, pageSize, categoryId, taskStatus);
    }

    return <>
        <StatisticsPanel categoryId={categoryId}
                         initData={statistics}/>
        <TaskInput categoryId={categoryId}
                   initData={category}
                   setCategoryId={setCategoryId}
                   saveEvent={saveEvent}
                   clickEvent={categoryClickEvent}/>
        <div className={styles.taskItemList}>
            {data?.data?.map((one) =>
                <TaskItem key={'taskInfo_' + one.id + '_' + one.createTime + one.updateTime}
                          one={one}
                          timeType={timeType}
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
