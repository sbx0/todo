"use client"

import styles from "./TaskList.module.css";
import TaskItem from "./TaskItem";
import {useTasksContext} from "../../app/tasks/[category]/components/tasksContext";
import {useState} from "react";

export default function TaskList({
                                     tasks,
                                     clickTask,
                                     showAdd
                                 }) {
    const [newTask, setNewTask] = useState('');
    const {
        setTasks,
        params, setParams,
        others, setOthers,
        fetchTasks, addTask
    } = useTasksContext();

    return <div className={`${styles.main}`}>
        <div className={`${styles.textAreaDiv}`} style={{display: showAdd ? "block" : "none"}}>
                        <textarea
                            onKeyDown={(event) => {
                                if (event.key === "Enter") {
                                    addTask(newTask, params.pageSize, params.categoryId, 0);
                                    setNewTask('')
                                    event.preventDefault();
                                }
                            }}
                            rows={1}
                            value={newTask}
                            onChange={(event) => {
                                setNewTask(event.target.value);
                            }}
                            placeholder={"添加任务"}
                            className={`${styles.textArea}`}/>
        </div>
        <div className={`${styles.taskContainer}`}>
            {tasks?.map((one) =>
                <TaskItem draggable
                          onClick={() => clickTask(one)}
                          task={one}
                          key={one.key}/>
            )}
        </div>
    </div>;
}