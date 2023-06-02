import styles from "./TaskItem.module.css"
import {CircleIcon} from "@primer/octicons-react";
import animations from "../../styles/animation.module.css";
import {useState} from "react";

export default function TaskItem({task, draggable = false, onDragStart}) {
    const [exit, setExit] = useState(false);
    return <div id={task.id}
                draggable={draggable}
                onDragStart={(event) => {
                    event.dataTransfer.dropEffect = "move";
                    event.dataTransfer.setData("text/plain", task.id);
                    onDragStart(event);
                    setExit(true);
                }}
                onDragEnd={() => setExit(false)}
                className={`${styles.taskItem} ${exit ? animations.scaleOutCenter : animations.scaleInCenter}`}>
        <div className={`${styles.taskTime}`} onClick={() => setExit(true)}>
            <CircleIcon/>
        </div>
        <div/>
        <div>{task.name}</div>
        <div/>
        <div>
            <span className={`${styles.taskTime}`}>
                {task.time}
            </span>
        </div>
    </div>
}