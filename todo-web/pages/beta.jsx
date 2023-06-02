import styles from "../styles/Beta.module.css"
import {useRef, useState} from "react";
import TextCentered from "../components/basic/TextCentered";
import TaskItem from "../components/beta/TaskItem";

export default function Beta() {
    const moveRef = useRef(null);
    const [markCompletedShow, setMarkCompletedShow] = useState(false);
    const [tasks, setTasks] = useState([
        {name: "任务1", time: "2023-06-02"},
        {name: "任务2", time: "2023-06-01"},
        {name: "任务3", time: "2023-06-05"},
    ]);

    const taskItemOnDragStart = (event) => {
        setMarkCompletedShow(true);
        moveRef.current = event.target;
    }

    return <div className={`${styles.main}`}>
        <div className={`${styles.leftNavBar}`}>
            <div>

            </div>
        </div>
        <div className={`${styles.rightContainer}`}>
            <div className={`${styles.taskContainer}`}>
                {tasks.map((one, index) =>
                    <TaskItem onDragStart={taskItemOnDragStart}
                              task={one}
                              key={index}/>
                )}
            </div>
            <div onDrop={(event) => {
                event.preventDefault();
                console.log(event.target.className)
                if (event.target.className.indexOf(styles.dropzone) !== -1) {
                    moveRef.current.parentNode.removeChild(moveRef.current);
                    event.target.parentNode.parentNode.parentNode.appendChild(moveRef.current);
                    setMarkCompletedShow(false);
                }
            }}
                 onDragOver={(event) => event.preventDefault()}
                 className={`${styles.taskContainer} ${markCompletedShow ? styles.markCompleted : ''}`}>
                <div className={`${styles.filler}`} hidden={!markCompletedShow}>
                    <TextCentered className={`${styles.dropzone}`}>
                        放置此处标记已完成
                    </TextCentered>
                </div>
            </div>
        </div>
    </div>
}
