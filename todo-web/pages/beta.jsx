import styles from "../styles/Beta.module.css"
import {useEffect, useState} from "react";
import TaskItem from "../components/beta/TaskItem";
import Padding from "../components/beta/Padding";
import {POST, TaskPaging} from "../apis/apiPath";
import {callApi} from "../apis/request";
import NavBar from "../components/beta/NavBar";

export default function Beta() {
    const [tasks, setTasks] = useState([]);
    const [categoryId, setCategoryId] = useState(0);
    const [taskTotal, setTaskTotal] = useState(0);
    const [completedTasks, setCompletedTasks] = useState([]);

    useEffect(() => {
        loadTasks();
    }, [])

    const loadTasks = (page = 1,
                       pageSize = 20,
                       categoryId = 0,
                       taskStatus = 0) => {
        callApi({
            method: POST, url: TaskPaging, params: {
                page: page,
                pageSize: pageSize,
                categoryId: categoryId,
                taskStatus: taskStatus
            }
        }).then(r => {
            if (r.success) {
                let key = `${page}-${pageSize}-${categoryId}-${taskStatus}-`
                let newData = [];
                for (let i = 0; i < r.data.length; i++) {
                    newData.push({
                        key: key + r.data[i].id,
                        ...r.data[i]
                    });
                }
                setTasks(newData);
                setTaskTotal(r.common.total);
                setCategoryId(categoryId);
            }
        });
    }

    const onDropRight = (event) => {
        let id = parseInt(event.dataTransfer.getData('text'));
        let newTasks = [];
        for (let i = 0; i < tasks.length; i++) {
            if (tasks[i].id !== id) {
                newTasks.push(tasks[i]);
            } else {
                completedTasks.reverse();
                completedTasks.push(tasks[i]);
                completedTasks.reverse();
            }
        }
        setTasks(newTasks);
        setCompletedTasks([...completedTasks]);
        event.preventDefault();
    }

    const onDropCenter = (event) => {
        let id = parseInt(event.dataTransfer.getData('text'));
        let newTasks = [];
        for (let i = 0; i < completedTasks.length; i++) {
            if (completedTasks[i].id !== id) {
                newTasks.push(completedTasks[i]);
            } else {
                tasks.reverse();
                tasks.push(completedTasks[i]);
                tasks.reverse();
            }
        }
        setCompletedTasks(newTasks);
        setTasks([...tasks]);
        event.preventDefault();
    }

    return <div className={`${styles.main}`}>
        <div className={`${styles.leftNavBar}`}>
            <NavBar loadTasks={loadTasks}
                    categoryId={categoryId}
                    taskTotal={taskTotal}/>
        </div>
        <div className={`${styles.centerContainer}`}
             onDrop={onDropCenter}
             onDragOver={(event) => event.preventDefault()}>
            <Padding>
                <div className={`${styles.taskContainer}`}>
                    {tasks.map((one) =>
                        <TaskItem draggable
                                  task={one}
                                  key={one.key}/>
                    )}
                </div>
            </Padding>
        </div>
        <div className={`${styles.rightContainer}`}
             onDrop={onDropRight}
             onDragOver={(event) => event.preventDefault()}>
            <Padding>
                <div className={`${styles.taskContainer}`}>
                    {completedTasks.map((one) =>
                        <TaskItem draggable
                                  task={one}
                                  key={one.id}/>
                    )}
                </div>
            </Padding>
        </div>
    </div>
}
