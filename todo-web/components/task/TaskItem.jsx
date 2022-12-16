import styles from "./TaskItem.module.css";
import moment from "moment";
// import 'moment/locale/zh-cn';

export default function TaskItem({
                                     one,
                                     setTaskStatusUndo,
                                     setTaskStatusCompleted,
                                     timeType
                                 }) {
    let isCompleted = 1 === one.taskStatus;
    let isCompletedClassName = isCompleted ? styles.taskItemBodyCompleted : '';
    let divClassName = `${styles.taskItemBody} ${isCompletedClassName}`;

    return <div className={divClassName}>
        <div className={styles.taskCheckIconContainer}
             onClick={() => {
                 if (isCompleted) {
                     setTaskStatusUndo(one);
                 } else {
                     setTaskStatusCompleted(one)
                 }
             }}>
            {isCompleted ?
                <svg fill="currentColor" width="25"
                     height="25" viewBox="0 0 20 20"
                     xmlns="http://www.w3.org/2000/svg"
                     focusable="false">
                    <path
                        d="M10 2a8 8 0 110 16 8 8 0 010-16zm0 1a7 7 0 100 14 7 7 0 000-14zm3.36 4.65c.17.17.2.44.06.63l-.06.07-4 4a.5.5 0 01-.64.07l-.07-.06-2-2a.5.5 0 01.63-.77l.07.06L9 11.3l3.65-3.65c.2-.2.51-.2.7 0z"
                        fill="currentColor"></path>
                </svg>
                :
                <svg fill="currentColor" width="25"
                     height="25" viewBox="0 0 20 20"
                     xmlns="http://www.w3.org/2000/svg"
                     focusable="false">
                    <path
                        d="M10 3a7 7 0 100 14 7 7 0 000-14zm-8 7a8 8 0 1116 0 8 8 0 01-16 0z"
                        fill="currentColor"></path>
                </svg>
            }
        </div>
        <div className={styles.taskNameContainer}>
            {one.taskName}
        </div>
        <div className={styles.time}>
            {moment(timeType === 'update_time' ? one.updateTime : one.createTime).fromNow()}
        </div>
    </div>;
}
