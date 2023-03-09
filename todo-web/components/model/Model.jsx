import styles from "./Model.module.css";
import TaskItem from "../task/TaskItem";
import {useState} from "react";

export default function Model({show, close, data}) {
    const [addDeadline, setAddDeadline] = useState(false);
    const [addRemind, setAddRemind] = useState(false);
    const [useRepeat, setUseRepeat] = useState(false);

    function reset(index = 0) {
        setAddDeadline(index === 1);
        setAddRemind(index === 2);
        setUseRepeat(index === 3);
    }

    function closeAndReset() {
        reset();
        close();
    }

    function clickAddDeadline(type, time) {
        reset();
    }

    function clickAddRemind(type, time) {
        reset();
    }

    function clickUseRepeat(type, time) {
        reset();
    }

    if (show) {
        return <div className={styles.container}>
            <div className={styles.innerContainer}>
                <TaskItem one={{
                    taskName: data?.taskName,
                    createTime: data?.createTime
                }}/>

                {
                    addDeadline ?
                        <div className={styles.operateContainer}>
                            <div className={styles.fullWidthPadding}>
                                <div className={styles.select}>
                                    添加截至时间
                                </div>
                            </div>
                            <div onClick={() => clickAddDeadline(0, 'time')}>
                                <div className={styles.fullWidthPadding}>
                                    <button className={styles.button}>今天</button>
                                </div>
                            </div>
                            <div></div>
                            <div onClick={() => clickAddDeadline(1, 'time')}>
                                <div className={styles.fullWidthPadding}>
                                    <button className={styles.button}>明天</button>
                                </div>
                            </div>
                            <div></div>
                            <div onClick={() => clickAddDeadline(2, 'time')}>
                                <div className={styles.fullWidthPadding}>
                                    <button className={styles.button}>下周</button>
                                </div>
                            </div>
                            <div></div>
                            <div>
                                <div className={styles.fullWidthPadding}>
                                    <input type='date' className={styles.button}/>
                                </div>
                            </div>
                        </div>
                        :
                        <div onClick={() => reset(1)} className={styles.operateContainer}>
                            <div className={styles.fullWidthPadding}>
                                <div className={styles.select}>
                                    添加截至时间
                                </div>
                            </div>
                            <div></div>
                        </div>
                }

                {
                    addRemind ?
                        <div className={styles.operateContainer}>
                            <div className={styles.fullWidthPadding}>
                                <div className={styles.select}>
                                    提醒我
                                </div>
                            </div>
                            <div onClick={() => clickAddRemind(0, 'time')}>
                                <div className={styles.fullWidthPadding}>
                                    <button className={styles.button}>今天晚些时候</button>
                                </div>
                            </div>
                            <div></div>
                            <div onClick={() => clickAddRemind(1, 'time')}>
                                <div className={styles.fullWidthPadding}>
                                    <button className={styles.button}>明天 9:00</button>
                                </div>
                            </div>
                            <div></div>
                            <div onClick={() => clickAddRemind(2, 'time')}>
                                <div className={styles.fullWidthPadding}>
                                    <button className={styles.button}>下周一 9:00</button>
                                </div>
                            </div>
                            <div></div>
                            <div>
                                <div className={styles.fullWidthPadding}>
                                    <input type='datetime-local' className={styles.button}/>
                                </div>
                            </div>
                        </div>
                        :
                        <div onClick={() => reset(2)} className={styles.operateContainer}>
                            <div className={styles.fullWidthPadding}>
                                <div className={styles.select}>
                                    提醒我
                                </div>
                            </div>
                            <div></div>
                        </div>
                }

                {
                    useRepeat ?
                        <div className={styles.operateContainer}>
                            <div className={styles.fullWidthPadding}>
                                <div className={styles.select}>
                                    重复
                                </div>
                            </div>
                            <div onClick={() => clickUseRepeat(0, 'time')}>
                                <div className={styles.fullWidthPadding}>
                                    <button className={styles.button}>每天</button>
                                </div>
                            </div>
                            <div></div>
                            <div onClick={() => clickUseRepeat(1, 'time')}>
                                <div className={styles.fullWidthPadding}>
                                    <button className={styles.button}>工作日</button>
                                </div>
                            </div>
                            <div></div>
                            <div onClick={() => clickUseRepeat(2, 'time')}>
                                <div className={styles.fullWidthPadding}>
                                    <button className={styles.button}>每周</button>
                                </div>
                            </div>
                            <div></div>
                            <div onClick={() => clickUseRepeat(3, 'time')}>
                                <div className={styles.fullWidthPadding}>
                                    <button className={styles.button}>每月</button>
                                </div>
                            </div>
                            <div></div>
                            <div onClick={() => clickUseRepeat(4, 'time')}>
                                <div className={styles.fullWidthPadding}>
                                    <button className={styles.button}>每年</button>
                                </div>
                            </div>
                            <div></div>
                            <div onClick={() => clickUseRepeat(5, 'time')}>
                                <div className={styles.fullWidthPadding}>
                                    <button className={styles.button}>自定义</button>
                                </div>
                            </div>
                        </div>
                        :
                        <div onClick={() => reset(3)} className={styles.operateContainer}>
                            <div className={styles.fullWidthPadding}>
                                <div className={styles.select}>
                                    重复
                                </div>
                            </div>
                            <div></div>
                        </div>
                }

                <div className={styles.fullWidthPadding}>
                    <span>备注:</span>
                </div>
                <div className={styles.fullWidthPadding}>
                    <textarea rows="5" cols="33" className={styles.textarea}/>
                </div>
                <div className={styles.fullWidthPadding}>
                    <button className={styles.button} onClick={() => closeAndReset()}>
                        Close
                    </button>
                </div>
            </div>
        </div>
    } else {
        return <></>;
    }
}