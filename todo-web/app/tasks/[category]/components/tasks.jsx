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

export function Tasks({
                          initTasks,
                          initSortedTasks,
                          initCategories,
                          categoryId
                      }) {
    const [theme, setTheme] = useState(localStorage.getItem("theme"));
    const centerRef = useRef(null);
    const [modalShow, setModalShow] = useState(false);
    const [current, setCurrent] = useState(null);

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

    return <TasksProvider initData={initTasks}
                          sortedData={initSortedTasks}
                          categoryId={categoryId}>
        <div className={`${theme} ${styles.main}`}>
            <div className={`${styles.leftNavBar}`}>
                <NavBar backToTop={backToTop}
                        initCategories={initCategories}
                        categoryId={categoryId}
                        theme={theme}
                        setTheme={setTheme}/>
            </div>
            <Center centerRef={centerRef}
                    clickTask={clickTask}/>
            <Left clickTask={clickTask}/>
            <Model show={modalShow}
                   close={() => setModalShow(false)}>
                <TaskDetail current={current}
                            setCurrent={setCurrent}
                            setModalShow={setModalShow}/>
            </Model>
        </div>
    </TasksProvider>;
}

function Center({centerRef, clickTask}) {
    const {
        resetTaskSort, fetchTasks, tasksState
    } = useTasksContext();

    const onDropCenter = (event) => {
        let id = parseInt(event.dataTransfer.getData('text'));
        resetTaskSort(id);
        event.preventDefault();
    }

    const handleScroll = (event) => {
        const {scrollTop, clientHeight, scrollHeight} = event.currentTarget;
        if (scrollHeight - scrollTop <= clientHeight) {
            // 到达底部，加载下一页数据
            fetchTasks({page: tasksState.page + 1});
        }
    };

    return <div className={`${styles.centerContainer}`}
                ref={centerRef}
                onScroll={(event) => handleScroll(event)}
                onDrop={onDropCenter}
                onDragOver={(event) => event.preventDefault()}>
        <Padding>
            <TaskList
                tasks={tasksState.data}
                clickTask={clickTask}
                showAdd={tasksState.categoryId !== 0}
            />
        </Padding>
    </div>
}

function Left({clickTask}) {
    const {
        taskSort, sortedTasksState, fetchSortedTasks
    } = useTasksContext();

    const onDropRight = (event) => {
        let id = parseInt(event.dataTransfer.getData('text'));
        taskSort(id);
        event.preventDefault();
    }

    const handleScroll = (event) => {
        const {scrollTop, clientHeight, scrollHeight} = event.currentTarget;
        if (scrollHeight - scrollTop <= clientHeight) {
            // 到达底部，加载下一页数据
            fetchSortedTasks({page: sortedTasksState.page + 1});
        }
    };

    return <div className={`${styles.rightContainer}`}
                onScroll={(event) => handleScroll(event)}
                onDrop={onDropRight}
                onDragOver={(event) => event.preventDefault()}>
        <Padding>
            <TaskList
                tasks={sortedTasksState.data}
                clickTask={clickTask}
                showAdd={false}
            />
        </Padding>
    </div>;
}

export default dynamic(() => Promise.resolve(Tasks), {
    ssr: false
})
