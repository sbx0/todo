"use client"

import {useRef, useState} from "react";
import styles from "./Tasks.module.css"

import {callApi} from "../../../../apis/request";
import {POST, TaskPaging} from "../../../../apis/apiPath";
import NavBar from "../../../../components/beta/NavBar";
import Padding from "../../../../components/beta/Padding";
import Model from "../../../../components/beta/Model";
import TaskDetail from "../../../../components/beta/TaskDetail";
import TaskList from "../../../../components/beta/TaskList";
import dynamic from "next/dynamic";

export function Tasks({initTasks, initCategories, category}) {
    const centerRef = useRef(null);
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(20);
    const [tasks, setTasks] = useState(initTasks);
    const [categoryId, setCategoryId] = useState(parseInt(category));
    const [taskTotal, setTaskTotal] = useState(0);
    const [completedTasks, setCompletedTasks] = useState([]);
    const [isMore, setIsMore] = useState(true);
    const [newTask, setNewTask] = useState('');
    const [modalShow, setModalShow] = useState(false);
    const [current, setCurrent] = useState(null);
    const [theme, setTheme] = useState(localStorage.getItem("theme"));

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

    const clickTask = (task) => {
        setModalShow(true);
        setCurrent(task);
    }

    const changeTask = (task) => {
        callApi({
            method: POST,
            url: '/api/task/update',
            params: task
        }).then((r) => {
            if (r.success) {
                let newTasks = [];
                for (let i = 0; i < tasks.length; i++) {
                    if (tasks[i].id === task.id) {
                        newTasks.push(task);
                    } else {
                        newTasks.push(tasks[i]);
                    }
                }
                setTasks(newTasks);
            }
        });
    }

    const changeTaskCategory = (id, categoryId) => {
        let changeTask = null;
        let newTasks = [];
        for (let i = 0; i < tasks.length; i++) {
            if (tasks[i].id === id) {
                changeTask = {
                    ...tasks[i],
                    categoryId: categoryId
                };
            } else {
                newTasks.push(tasks[i]);
            }
        }
        if (changeTask == null) {
            return;
        }
        setTasks(newTasks);
        callApi({
            method: POST,
            url: '/api/task/update',
            params: changeTask
        }).then((r) => {
            if (!r.success) {
                setTasks([...tasks]);
            }
        });
    }

    return <div className={`${theme} ${styles.main}`}>
        <div className={`${styles.leftNavBar}`}>
            <NavBar loadTasks={loadTasks}
                    backToTop={backToTop}
                    initCategories={initCategories}
                    categoryId={categoryId}
                    theme={theme}
                    setTheme={setTheme}
                    changeTaskCategory={changeTaskCategory}
                    taskTotal={taskTotal}/>
        </div>
        <div className={`${styles.centerContainer}`}
             ref={centerRef}
             onScroll={(event) => handleScroll(event, page, pageSize, categoryId)}
             onDrop={onDropCenter}
             onDragOver={(event) => event.preventDefault()}>
            <Padding>
                <TaskList
                    addNewTask={addNewTask}
                    newTask={newTask}
                    setNewTask={setNewTask}
                    pageSize={pageSize}
                    categoryId={categoryId}
                    tasks={tasks}
                    clickTask={clickTask}
                    showAdd={categoryId !== 0}
                />
            </Padding>
        </div>
        <div className={`${styles.rightContainer}`}
             onDrop={onDropRight}
             onDragOver={(event) => event.preventDefault()}>
            <Padding>
                <TaskList
                    addNewTask={addNewTask}
                    newTask={newTask}
                    setNewTask={setNewTask}
                    pageSize={pageSize}
                    categoryId={categoryId}
                    tasks={completedTasks}
                    clickTask={clickTask}
                    showAdd={false}
                />
            </Padding>
        </div>
        <Model show={modalShow}
               close={() => setModalShow(false)}>
            <TaskDetail current={current}
                        setCurrent={setCurrent}
                        changeTask={changeTask}/>
        </Model>
    </div>
}

export default dynamic(() => Promise.resolve(Tasks), {
    ssr: false
})
