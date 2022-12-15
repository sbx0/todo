import styles from "./TaskList.module.css";
import useFetch from "../hooks/useFetch";
import {useState} from "react";
import TaskItem from "./task/TaskItem";
import {updateApi} from "../apis/taskApi";

export default function TaskList({setLoading}) {
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(20);
    const {data, refresh, totalPage} = useFetch({
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
            refresh();
        })
    }

    const setTaskStatusUndo = (task) => {
        updateApi({
            ...task,
            taskStatus: 0
        }).then(() => {
            refresh();
        })
    }

    return <div className={styles.container}>
        {data?.map((one) =>
            <TaskItem key={'taskInfo_' + one.id}
                      one={one}
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
