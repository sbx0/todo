import styles from "./TaskItem.module.css"
import {CircleIcon} from "@primer/octicons-react";
import animations from "../../styles/animation.module.css";
import {useState} from "react";
import CountDown from "../time/CountDown";

export default function TaskItem({task, draggable = false}) {
    const [exit, setExit] = useState(false);

    return <>
        <div id={task.id}
             draggable={draggable}
             onDragStart={(event) => {
                 event.dataTransfer.dropEffect = "move";
                 event.dataTransfer.setData("text/plain", task.id);
                 setExit(true);
             }}
             onDragEnd={(event) => {
                 setExit(false);
                 event.preventDefault();
             }}
             className={`${styles.taskItem} ${exit ? animations.scaleOutCenter : animations.scaleInCenter}`}>
            <div className={`${styles.taskTime}`} onClick={() => setExit(true)}>
                <CircleIcon/>
            </div>
            <div/>
            <div className={`${styles.taskCenter}`}>
                <div className={`${styles.categoryName}`}>{task.categoryName}</div>
                <div>{task.taskName}</div>
            </div>
            <div/>
            <div>
                <div className={`${styles.taskTime}`}>
                    <CountDown time={task.planTime}/>
                </div>
            </div>
        </div>
    </>;
}