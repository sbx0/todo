import styles from "./TaskList.module.css";
import {useState} from "react";
import {buildPath} from "../apis/request";
import Loading from "./Loading";
import StatisticsPanel from "./StatisticsPanel";
import {useRouter} from "next/router";
import TaskInput from "./task/TaskInput";
import TaskPage from "./TaskPage";
import {getCurrentCategory} from "./task/TaskCategory";

export default function TaskList({taskStatus}) {
    const router = useRouter()
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [categoryId, setCategoryId] = useState(getCurrentCategory());

    const taskPages = []
    for (let i = 1; i <= page; i++) {
        taskPages.push(<TaskPage page={i}
                                 pageSize={pageSize}
                                 taskStatus={taskStatus}
                                 categoryId={categoryId}
                                 key={i}/>)
    }

    const categoryClickEvent = (categoryId) => {
        setPage(1);
        setCategoryId(categoryId);
    }

    const saveEvent = (task) => {
        router.push(buildPath("/", router.query)).then(r => r);
    }

    return <>
        <StatisticsPanel/>
        <TaskInput saveEvent={saveEvent}
                   setLoading={setLoading}
                   clickEvent={categoryClickEvent}/>
        <div className={styles.taskItemList}>
            {taskPages}
            <button className={styles.button} onClick={() => {
                setPage(page + 1)
            }}>
                Load More
            </button>
        </div>
        <Loading active={loading}/>
    </>;
}
