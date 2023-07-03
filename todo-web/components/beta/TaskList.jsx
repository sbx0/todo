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
    const {addTask} = useTasksContext();

    return <div className={`${styles.main}`}>
        <div className={`${styles.textAreaDiv}`} style={{display: showAdd ? "block" : "none"}}>
                        <textarea
                            onKeyDown={(event) => {
                                if (event.key === "Enter") {
                                    addTask(newTask);
                                    setNewTask('')
                                    event.preventDefault();
                                }
                            }}
                            rows={1}
                            value={newTask}
                            onChange={(event) => {
                                let textarea = event.target;
                                setNewTask(event.target.value);
                                // 计算文本框的高度
                                let computedHeight = Math.round(parseFloat(textarea.style.height));
                                let computedStyle = window.getComputedStyle(textarea, null);
                                let actualHeight = "content-box" === computedStyle.boxSizing ? Math.round(parseFloat(computedStyle.height)) : textarea.offsetHeight;

                                // 如果文本框的实际高度小于计算出的高度
                                if (actualHeight < computedHeight) {
                                    actualHeight = "content-box" === computedStyle.boxSizing ? Math.round(parseFloat(window.getComputedStyle(textarea, null).height)) : textarea.offsetHeight
                                }
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