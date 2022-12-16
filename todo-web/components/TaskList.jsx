import styles from "./TaskList.module.css";
import useFetch from "../hooks/useFetch";
import {useState} from "react";
import TaskItem from "./task/TaskItem";
import {updateApi} from "../apis/taskApi";

export default function TaskList({setLoading}) {
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(20);
    const {data, refresh, totalPage, setData} = useFetch({
        method: 'POST',
        url: '/api/task/paging',
        params: {
            page: page, pageSize: pageSize, taskStatus: 1, orders: [
                {
                    name: 'update_time',
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

    return <div className={styles.container}>
        {data?.map((one) =>
            <TaskItem key={'taskInfo_' + one.id}
                      one={one}
                      timeType={'updateTime'}
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
    </div>;
}
