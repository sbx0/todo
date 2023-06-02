import styles from "../styles/Beta.module.css"
import {useState} from "react";
import TextCentered from "../components/basic/TextCentered";
import TaskItem from "../components/beta/TaskItem";
import Padding from "../components/beta/Padding";

export default function Beta() {
    const [markCompletedShow, setMarkCompletedShow] = useState(false);
    const [tasks, setTasks] = useState([
        {id: 1, name: "任务1", time: "2023-06-02"},
        {id: 2, name: "任务2", time: "2023-06-01"},
        {id: 3, name: "任务3", time: "2023-06-05"},
    ]);
    const [completedTasks, setCompletedTasks] = useState([]);

    const taskItemOnDragStart = (event) => {
        setMarkCompletedShow(true);
    }

    const onDrop = (event) => {
        let id = parseInt(event.dataTransfer.getData('text'));
        let newTasks = [];
        for (let i = 0; i < tasks.length; i++) {
            if (tasks[i].id !== id) {
                newTasks.push(tasks[i]);
            } else {
                completedTasks.push(tasks[i]);
            }
        }
        setTasks(newTasks);
        setCompletedTasks([...completedTasks]);
        setMarkCompletedShow(false);
    }

    return <div className={`${styles.main}`}>
        <div className={`${styles.leftNavBar}`}>
            <Padding>

            </Padding>
        </div>
        <div className={`${styles.centerContainer}`}>
            <Padding>
                <div className={`${styles.taskContainer}`}>
                    {tasks.map((one, index) =>
                        <TaskItem draggable={true}
                                  onDragStart={taskItemOnDragStart}
                                  task={one}
                                  key={index}/>
                    )}
                </div>
            </Padding>
        </div>
        <div className={`${styles.rightContainer}`}>
            <Padding hidden={!markCompletedShow}>
                <div onDrop={onDrop}
                     onDragOver={(event) => event.preventDefault()}
                     className={`${styles.taskContainer} ${markCompletedShow ? styles.markCompleted : ''}`}>
                    <div className={`${styles.filler}`}>
                        <TextCentered className={`${styles.dropzone}`}>
                            放置此处标记已完成
                        </TextCentered>
                    </div>
                </div>
            </Padding>
            <Padding>
                <div className={`${styles.taskContainer}`}>
                    {completedTasks.map((one, index) =>
                        <TaskItem task={one}
                                  key={index}/>
                    )}
                </div>
            </Padding>
        </div>
    </div>
}
