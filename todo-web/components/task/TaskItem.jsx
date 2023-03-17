import styles from "./TaskItem.module.css";
import Model from "../model/Model";
import {useState} from "react";
import CountDown from "../time/CountDown";
import {CheckCircleFillIcon, CircleIcon} from "@primer/octicons-react";

export default function TaskItem({
                                     one,
                                     change
                                 }) {
    let isCompleted = 1 === one.taskStatus;
    let isCompletedClassName = isCompleted ? styles.taskItemBodyCompleted : '';
    let divClassName = `${styles.taskItemBody} ${isCompletedClassName}`;
    const [modalShow, setModalShow] = useState(false);

    return <div>
        <div className={divClassName}>
            <div className={styles.leftContainer}
                 onClick={() => {
                     if (isCompleted) {
                         one.taskStatus = 0;
                         change(one);
                     } else {
                         one.taskStatus = 1;
                         change(one);
                     }
                 }}>
                {isCompleted ?
                    <CheckCircleFillIcon/>
                    :
                    <CircleIcon/>
                }
            </div>
            {one.taskStatus === 0 && one.planTime != null ?
                <div onClick={() => setModalShow(true)} className={styles.rightContainerWithCountDown}>
                    <div className={styles.textContainer}>
                        <span className={styles.textCenteredVertically}>
                            {one.taskName}
                        </span>
                    </div>
                    <div className={styles.textContainer}>
                        <div className={`${styles.textCenteredVertically} ${styles.time}`}>
                            <CountDown time={one.planTime}/>
                        </div>
                    </div>
                </div>
                :
                <div onClick={() => setModalShow(true)} className={styles.rightContainer}>
                    <div className={styles.textContainer}>
                        <span className={styles.textCenteredVertically}>
                            {one.taskName}
                        </span>
                    </div>
                </div>
            }

        </div>
        <Model show={modalShow}
               close={() => setModalShow(false)}
               change={change}
               data={one}/>
    </div>;
}
