import styles from "../styles/Beta.module.css"
import {useEffect, useState} from "react";
import TaskItem from "../components/beta/TaskItem";
import Padding from "../components/beta/Padding";
import {POST, TaskPaging} from "../apis/apiPath";
import {callApi} from "../apis/request";
import NavBar from "../components/beta/NavBar";

export default function Beta() {
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(20);
    const [tasks, setTasks] = useState([]);
    const [categoryId, setCategoryId] = useState(0);
    const [taskTotal, setTaskTotal] = useState(0);
    const [completedTasks, setCompletedTasks] = useState([]);
    const [isMore, setIsMore] = useState(true);

    useEffect(() => {
        loadTasks();
    }, [])

    const loadTasks = (page = 1,
                       pageSize = 20,
                       categoryId = 0,
                       taskStatus = 0) => {
        if (page > 1 && !isMore) {
            return;
        }
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
                let newData;
                if (r.common.page === 0) {
                    newData = [];
                } else {
                    newData = tasks;
                }
                if (r.data.length < r.common.pageSize) {
                    setIsMore(false);
                } else {
                    setIsMore(true);
                }
                for (let i = 0; i < r.data.length; i++) {
                    newData.push({
                        key: key + r.data[i].id,
                        ...r.data[i]
                    });
                }
                setTasks(newData);
                setPage(r.common.page + 1);
                setPageSize(r.common.pageSize);
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

    const handleScroll = (event, page, pageSize) => {
        const {scrollTop, clientHeight, scrollHeight} = event.currentTarget;
        if (scrollHeight - scrollTop === clientHeight) {
            // 到达底部，加载下一页数据
            loadTasks(page + 1, pageSize);
        }
    };

    return <div className={`${styles.main}`}>
        <div className={`${styles.leftNavBar}`}>
            <NavBar loadTasks={loadTasks}
                    categoryId={categoryId}
                    taskTotal={taskTotal}/>
        </div>
        <div className={`${styles.centerContainer}`}
             onScroll={(event) => {
                 handleScroll(event, page, pageSize);
             }}
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
