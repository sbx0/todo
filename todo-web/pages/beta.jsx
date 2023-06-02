import styles from "../styles/Beta.module.css"
import {useEffect, useState} from "react";
import TaskItem from "../components/beta/TaskItem";
import Padding from "../components/beta/Padding";

export default function Beta() {
    const [tasks, setTasks] = useState([]);
    const [completedTasks, setCompletedTasks] = useState([]);

    useEffect(() => {
        let newTasks = [];
        for (let i = 0; i < 9; i++) {
            newTasks.push({id: i + 1, name: "任务" + (i + 1), time: "2023-06-02 " + i})
        }
        setTasks(newTasks);
    }, [])

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
            <Padding>

            </Padding>
        </div>
        <div className={`${styles.centerContainer}`}
             onDrop={onDropCenter}
             onDragOver={(event) => event.preventDefault()}>
            <Padding>
                <div className={`${styles.taskContainer}`}>
                    {tasks.map((one) =>
                        <TaskItem draggable
                                  task={one}
                                  key={one.id}/>
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
