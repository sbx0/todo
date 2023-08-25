import styles from "./TaskItem.module.css"
import {CircleIcon} from "@primer/octicons-react";
import animations from "../../styles/animation.module.css";
import {useState} from "react";
import CountDown from "../time/CountDown";
import {POST, TaskComplete} from "../../apis/apiPath";
import toast from "react-hot-toast";
import {fetchLoading} from "../../apis/request";
import FormatTime from "../time/FormatTime";

export default function TaskItem({task, draggable = false, onClick}) {
    const [exit, setExit] = useState(false);
    const markComplete = (task) => {
        fetchLoading({
            method: POST,
            url: TaskComplete,
            params: {
                id: task.id
            }
        }).then(r => {
            if (r.success) {
                setExit(true);
                toast.success("任务已完成");
            } else {
                toast.error("任务完成失败");
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
             className={`border-b cursor-pointer mt-2 ${exit ? animations.scaleOutCenter : ''}`}>
            <table cellPadding="0" cellSpacing="0" border="0" width="100%">
                <tbody>
                <tr>
                    <td width="32" valign="middle" align="center" onClick={() => markComplete(task)}>
                        <div className="text-gray-400">
                            <CircleIcon/>
                        </div>
                    </td>
                    <td width="10"></td>
                    <td width="auto" valign="middle" onClick={onClick}>
                        <span className={styles.taskName}>{task.taskName}</span>
                        <div className={styles.sep5}></div>
                        <div className="text-gray-400 inline text-xs">
                            <span>{task.categoryName}</span>
                        </div>
                        <div className="text-gray-400 inline text-xs">
                            &nbsp;•&nbsp;
                        </div>
                        <div className="text-gray-400 inline text-xs">
                            {
                                task.planTime == null ?
                                    <FormatTime time={task.createTime}/>
                                    :
                                    <CountDown time={task.planTime}/>
                            }
                        </div>
                    </td>
                </tr>
                </tbody>
            </table>
            <div/>
        </div>
    </>;
}