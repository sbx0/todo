import {useEffect, useState} from "react";
import styles from "./TaskList.module.css";
import TaskItem from "./TaskItem";

export default function TaskList({
                                     addNewTask,
                                     newTask,
                                     setNewTask,
                                     pageSize,
                                     categoryId,
                                     tasks,
                                     clickTask,
                                     showAdd
                                 }) {
    const [example, setExample] = useState(false);

    useEffect(() => {
        if (example) {
            setExample(true);
        }
    }, []);


    return <div className={`${styles.main}`}>
        <div className={`${styles.textAreaDiv}`} style={{display: showAdd ? "block" : "none"}}>
                        <textarea
                            onKeyDown={(event) => {
                                if (event.key === "Enter") {
                                    addNewTask(newTask, pageSize, categoryId);
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
            {tasks.map((one) =>
                <TaskItem draggable
                          onClick={() => clickTask(one)}
                          task={one}
                          key={one.key}/>
            )}
        </div>
    </div>;
}