import styles from "./TaskItem.module.css"
import {CircleIcon} from "@primer/octicons-react";

export default function TaskItem({task, draggable = false, onDragStart}) {
    return <div draggable={draggable}
                onDragStart={(event) => {
                    event.dataTransfer.dropEffect = "move";
                    event.dataTransfer.setData("text/plain", task.id);
                    onDragStart(event);
                }}
                className={`${styles.taskItem}`}>
        <div className={`${styles.taskTime}`}><CircleIcon/></div>
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