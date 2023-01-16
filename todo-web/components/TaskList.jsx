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
            let newDate = [];
            for (let i = 0; i < data.length; i++) {
                if (data[i].id !== task.id) {
                    newDate.push(data[i]);
                }
            }
            setData(newDate);
        })
    }

    const setTaskStatusUndo = (task) => {
        updateApi({
            ...task,
            taskStatus: 0
        }).then(() => {
            let newDate = [];
            for (let i = 0; i < data.length; i++) {
                if (data[i].id !== task.id) {
                    newDate.push(data[i]);
                }
            }
            setData(newDate);
        })
    }

    const getTaskPaging = (page, pageSize, categoryId) => {
        callApi({
            method: POST,
            url: TaskPaging,
            params: {
                "page": page,
                "pageSize": pageSize,
                "taskStatus": 0,
                "categoryId": categoryId,
                "orders": [{"name": "create_time", "direction": "desc"}]
            }
        }).then(r => {
            setData(r);
        });
    }

    const categoryClickEvent = (value) => {
        router.replace({query: {...router.query, categoryId: value},});
        setPage(1);
        getTaskPaging(1, pageSize, value);
    }

    const saveEvent = () => {
        router.push(buildPath("/", router.query)).then(r => r);
        setPage(1);
        getTaskPaging(1, pageSize, categoryId);
    }

    return <>
        <StatisticsPanel categoryId={categoryId}
                         initData={statistics}/>
        <TaskInput categoryId={categoryId}
                   initData={category}
                   setCategoryId={setCategoryId}
                   saveEvent={saveEvent}
                   clickEvent={categoryClickEvent}/>
        {data?.data?.map((one) =>
            <TaskItem key={'taskInfo_' + one.id + '_' + one.createTime + one.updateTime}
                      one={one}
                      timeType={timeType}
                      setTaskStatusUndo={setTaskStatusUndo}
                      setTaskStatusCompleted={setTaskStatusCompleted}/>)}
        {
            page < data?.common?.totalPage ?
                <button className={styles.button} onClick={() => setPage((prev) => {
                    prev = prev + 1;
                    if (prev > data.common.totalPage) {
                        prev = data.common.totalPage;
                    }
                    return prev;
                })}>
                    Load More
                </button>
                :
                <></>
        }
        <Loading active={loading}/>
    </>;
}
