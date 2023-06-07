import {useEffect, useRef, useState} from "react";
import styles from "../../styles/Beta.module.css"
import TaskItem from "../../components/beta/TaskItem";
import Padding from "../../components/beta/Padding";
import {POST, TaskPaging} from "../../apis/apiPath";
import {callApi} from "../../apis/request";
import NavBar from "../../components/beta/NavBar";
import {useRouter} from "next/router";
import Model from "../../components/beta/Model";

export default function CategoryId() {
    const router = useRouter();
    const centerRef = useRef(null);
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(20);
    const [tasks, setTasks] = useState([]);
    const [categoryId, setCategoryId] = useState(0);
    const [taskTotal, setTaskTotal] = useState(0);
    const [completedTasks, setCompletedTasks] = useState([]);
    const [isMore, setIsMore] = useState(true);
    const [newTask, setNewTask] = useState('');
    const [modalShow, setModalShow] = useState(false);

    useEffect(() => {
        if (router.query.param === null || router.query.param === undefined || router.query.param === '') {
            return;
        }
        setCategoryId(parseInt(router.query.param));
        loadTasks(page, pageSize, parseInt(router.query.param), 0);
    }, [router.query.param])

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
                if (r.common.page === 1) {
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
                setPage(r.common.page);
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

    const handleScroll = (event, page, pageSize, categoryId) => {
        const {scrollTop, clientHeight, scrollHeight} = event.currentTarget;
        if (scrollHeight - scrollTop === clientHeight) {
            // 到达底部，加载下一页数据
            loadTasks(page + 1, pageSize, categoryId);
        }
    };

    const backToTop = () => {
        centerRef.current.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    };

    const addNewTask = (taskName, pageSize, categoryId) => {
        if (taskName == null || taskName === '' || taskName.trim() === '') {
            setNewTask('');
            return;
        }
        if (categoryId === 0) {
            return;
        }
        callApi({
            method: POST,
            url: '/api/task/save',
            params: {
                taskName: taskName.trim(),
                categoryId: categoryId
            }
        }).then((r) => {
            if (r.success) {
                loadTasks(1, pageSize, categoryId);
                setNewTask('');
            }
        });
    }

    return <div className={`${styles.main}`}>
        <div className={`${styles.leftNavBar}`}>
            <NavBar loadTasks={loadTasks}
                    backToTop={backToTop}
                    categoryId={categoryId}
                    taskTotal={taskTotal}/>
        </div>
        <div className={`${styles.centerContainer}`}
             ref={centerRef}
             onScroll={(event) => {
                 handleScroll(event, page, pageSize, categoryId);
             }}
             onDrop={onDropCenter}
             onDragOver={(event) => event.preventDefault()}>
            <Padding>
                <div className={`${styles.textAreaDiv}`} style={{display: categoryId === 0 ? "none" : "block"}}>
                        <textarea
                            onKeyDown={(event) => {
                                if (event.key === "Enter") {
                                    addNewTask(newTask, pageSize, categoryId);
                                    event.preventDefault();
                                }
                            }}
                            value={newTask}
                            onChange={(event) => {
                                setNewTask(event.target.value);
                            }}
                            placeholder={"添加任务"}
                            className={`${styles.textArea}`}/>
                </div>
                <div className={`${styles.taskContainer}`}>
                    {tasks.map((one) =>
                        <TaskItem draggable
                                  onClick={() => {
                                      setModalShow(true);
                                  }}
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
                                  onClick={() => {
                                      setModalShow(true);
                                  }}
                                  task={one}
                                  key={one.id}/>
                    )}
                </div>
            </Padding>
        </div>
        <Model show={modalShow}
               close={() => setModalShow(false)}>

        </Model>
    </div>
}
