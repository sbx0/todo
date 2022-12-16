import {useEffect, useState} from "react";
import styles from "./TaskHidden.module.css";
import useFetch from "../../hooks/useFetch";
import TaskItem from "./TaskItem";

export default function TaskHidden({categoryId, refresh, setTaskStatusCompleted, setTaskStatusUndo, setLoading}) {
    const [checked, setChecked] = useState(false);
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(20);
    const taskPaging = useFetch({
        method: 'POST',
        url: '/api/task/paging',
        params: {
            page: page, pageSize: pageSize, categoryId: categoryId, taskStatus: 1
        },
        active: checked,
        setLoading
    });

    useEffect(() => {
        taskPaging.refresh();
    }, [refresh]);

    return <>
        <div className={styles.categoryItem}>
            <input id={'task_hidden_checkbox'}
                   name={'task_hidden_checkbox'}
                   type="checkbox"
                   onClick={() => {
                       setChecked(!checked);
                       taskPaging.refresh();
                   }}
                   hidden/>
            <div className={styles.categoryItemBackgroundColor}>
                <label className={styles.categoryLabel}
                       htmlFor={'task_hidden_checkbox'}>
                    {checked ? 'Hide Other' : 'Show Other'}
                </label>
            </div>
        </div>
        {checked ?
            taskPaging.data?.map((one) =>
                <TaskItem key={'taskInfo_' + one.id}
                          one={one}
                          timeType={'updateTime'}
                          setTaskStatusUndo={setTaskStatusUndo}
                          setTaskStatusCompleted={setTaskStatusCompleted}/>)
            : <></>
        }
    </>;
}
