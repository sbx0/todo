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
        <div className="mb-2" style={{display: showAdd ? "block" : "none"}}>
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
                                setNewTask(event.target.value);
                            }}
                            placeholder={"添加任务"}
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"/>
        </div>
        <div className="border-t border-l border-r border-gray-200 dark:bg-gray-700 dark:border-gray-600">
            {tasks?.map((one) =>
                <TaskItem draggable
                          onClick={() => clickTask(one)}
                          task={one}
                          key={one.key}/>
            )}
        </div>
    </div>;
}