import styles from "./TaskItem.module.css"
import {CircleIcon} from "@primer/octicons-react";
import animations from "../../styles/animation.module.css";
import {useState} from "react";
import CountDown from "../time/CountDown";
import {callApi} from "../../apis/request";
import {POST, TaskComplete} from "../../apis/apiPath";

export default function TaskItem({task, draggable = false, onClick}) {
    const [exit, setExit] = useState(false);
    const markComplete = (task) => {
        callApi({
            method: POST,
            url: TaskComplete,
            params: {
                id: task.id
            }
        }).then(r => {
            if (r.success) {
                setExit(true);
            }
        })
    }

    return <>
        <div id={task.id}
             draggable={draggable}
             onDragStart={(event) => {
                 event.dataTransfer.dropEffect = "move";
                 event.dataTransfer.setData("text/plain", task.id);
                 setExit(true);
             }}
             onDragEnd={(event) => {
                 event.preventDefault();
                 setExit(false);
             }}
             className={`${styles.taskItem} ${exit ? animations.scaleOutCenter : animations.scaleInCenter}`}>
            <div className={`${styles.taskTime}`} onClick={() => markComplete(task)}>
                <CircleIcon/>
            </div>
            <div/>
            <div className={`${styles.taskCenter}`}
                 onClick={onClick}>
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