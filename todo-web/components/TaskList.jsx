import styles from "./TaskList.module.css";
import useFetch from "../hooks/useFetch";
import {useState} from "react";
import TaskItem from "./task/TaskItem";
import {updateApi} from "../apis/taskApi";
import Loading from "./Loading";
import TaskCategory from "./task/TaskCategory";
import {getCache} from "./Cache";
import StatisticsPanel from "./StatisticsPanel";

export default function TaskList({taskStatus, orderBy, timeType}) {
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
    const {data, refresh, totalPage, setData} = useFetch({
        method: 'POST',
        url: '/api/task/paging',
        params: {
            page: page, pageSize: pageSize, taskStatus: taskStatus, categoryId: categoryId, orders: [
                {
                    name: orderBy,
                    direction: 'desc'
                }
            ]
        },
        setLoading: setLoading
    });

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

    const categoryClickEvent = (value) => {
        setPage(1);
    }

    return <>
        <StatisticsPanel categoryId={categoryId}/>
        <TaskCategory categoryId={categoryId}
                      setCategoryId={setCategoryId}
                      clickEvent={categoryClickEvent}/>
        {data?.map((one) =>
            <TaskItem key={'taskInfo_' + one.id + '_' + one.createTime + one.updateTime}
                      one={one}
                      timeType={timeType}
                      setTaskStatusUndo={setTaskStatusUndo}
                      setTaskStatusCompleted={setTaskStatusCompleted}/>)}
        {
            page < totalPage ?
                <button className={styles.button} onClick={() => setPage((prev) => {
                    prev = prev + 1;
                    if (prev > totalPage) {
                        prev = totalPage;
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
