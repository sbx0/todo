import styles from "./TaskItem.module.css";
import Model from "../model/Model";
import {useState} from "react";
import CountDown from "../time/CountDown";
import {CheckCircleFillIcon, CircleIcon} from "@primer/octicons-react";

export default function TaskItem({
                                     one,
                                     change
                                 }) {
    const [data, setData] = useState(one);
    let isCompleted = 1 === data.taskStatus;
    let isCompletedClassName = isCompleted ? styles.taskItemBodyCompleted : '';
    let divClassName = `${styles.taskItemBody} ${isCompletedClassName}`;
    const [modalShow, setModalShow] = useState(false);

    function changTask(task) {
        setData(task);
        change(task);
        setModalShow(false);
    }

    return <div>
        <div className={divClassName}>
            <div className={styles.leftContainer}
                 onClick={() => {
                     if (isCompleted) {
                         data.taskStatus = 0;
                         change(data);
                         setData({
                             ...data,
                             taskStatus: 0
                         });
                     } else {
                         data.taskStatus = 1;
                         change(data);
                         setData({
                             ...data,
                             taskStatus: 1
                         });
                     }
                 }}>
                {isCompleted ?
                    <CheckCircleFillIcon/>
                    :
                    <CircleIcon/>
                }
            </div>
            {data.taskStatus === 0 && data.planTime != null ?
                <div onClick={() => setModalShow(true)} className={styles.rightContainerWithCountDown}>
                    <div className={styles.textContainer}>
                        <span className={styles.textCenteredVertically}>
                            {data.taskName}
                        </span>
                    </div>
                    <div className={styles.textContainer}>
                        <div className={`${styles.textCenteredVertically} ${styles.time}`}>
                            <CountDown time={data.planTime}/>
                        </div>
                    </div>
                </div>
                :
                <div onClick={() => setModalShow(true)} className={styles.rightContainer}>
                    <div className={styles.textContainer}>
                        <span className={styles.textCenteredVertically}>
                            {data.taskName}
                        </span>
                    </div>
                </div>
            }

        </div>
        <Model show={modalShow}
               close={() => setModalShow(false)}
               change={changTask}
               data={data}/>
    </div>;
}
