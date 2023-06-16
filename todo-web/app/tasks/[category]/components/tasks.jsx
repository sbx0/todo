"use client";

import {useRef, useState} from "react";
import styles from "./Tasks.module.css"
import NavBar from "../../../../components/beta/NavBar";
import Padding from "../../../../components/beta/Padding";
import Model from "../../../../components/beta/Model";
import TaskDetail from "../../../../components/beta/TaskDetail";
import TaskList from "../../../../components/beta/TaskList";
import dynamic from "next/dynamic";
import TasksProvider, {useTasksContext} from "./tasksContext";

export function Tasks({initTasks, initCategories, category}) {
    const centerRef = useRef(null);
    const [tasks, setTasks] = useState(initTasks);
    const [categoryId, setCategoryId] = useState(parseInt(category));
    const [taskTotal, setTaskTotal] = useState(0);
    const [completedTasks, setCompletedTasks] = useState([]);
    const [modalShow, setModalShow] = useState(false);
    const [current, setCurrent] = useState(null);
    const [theme, setTheme] = useState(localStorage.getItem("theme"));

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

    const backToTop = () => {
        centerRef.current.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    };

    const clickTask = (task) => {
        setModalShow(true);
        setCurrent(task);
    }

    return <TasksProvider initData={initTasks} categoryId={parseInt(category)}>
        <div className={`${theme} ${styles.main}`}>
            <div className={`${styles.leftNavBar}`}>
                <NavBar backToTop={backToTop}
                        initCategories={initCategories}
                        categoryId={categoryId}
                        theme={theme}
                        setTheme={setTheme}
                        taskTotal={taskTotal}/>
            </div>
            <Center
                centerRef={centerRef}
                initTasks={initTasks}
                categoryId={parseInt(category)}
                completedTasks={completedTasks}
                setCompletedTasks={setCompletedTasks}
                clickTask={clickTask}/>
            <div className={`${styles.rightContainer}`}
                 onDrop={onDropRight}
                 onDragOver={(event) => event.preventDefault()}>
                <Padding>
                    <TaskList
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
                            setModalShow={setModalShow}/>
            </Model>
        </div>
    </TasksProvider>;
}

function Center({centerRef, completedTasks, setCompletedTasks, clickTask, initTasks, categoryId}) {
    const {
        tasks, setTasks,
        params, setParams,
        others, setOthers,
        fetchTasks, addTask
    } = useTasksContext();

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

    const handleScroll = (event, params) => {
        const {scrollTop, clientHeight, scrollHeight} = event.currentTarget;
        if (scrollHeight - scrollTop === clientHeight) {
            // 到达底部，加载下一页数据
            fetchTasks(params.page + 1, params.pageSize, params.categoryId, params.taskStatus);
        }
    };

    return <div className={`${styles.centerContainer}`}
                ref={centerRef}
                onScroll={(event) => handleScroll(event, params)}
                onDrop={onDropCenter}
                onDragOver={(event) => event.preventDefault()}>
        <Padding>
            <TaskList
                tasks={tasks}
                clickTask={clickTask}
                showAdd={params.categoryId !== 0}
            />
        </Padding>
    </div>
}

export default dynamic(() => Promise.resolve(Tasks), {
    ssr: false
})
