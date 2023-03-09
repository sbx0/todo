import styles from "./Model.module.css";
import TaskItem from "../task/TaskItem";
import {useState} from "react";
import FoamBox from "../layout/FoamBox";

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
                            <FoamBox>
                                <div className={styles.select}>
                                    添加截至时间
                                </div>
                            </FoamBox>
                            <div onClick={() => clickAddDeadline(0, 'time')}>
                                <FoamBox>
                                    <button className={styles.button}>今天</button>
                                </FoamBox>
                            </div>
                            <div></div>
                            <div onClick={() => clickAddDeadline(1, 'time')}>
                                <FoamBox>
                                    <button className={styles.button}>明天</button>
                                </FoamBox>
                            </div>
                            <div></div>
                            <div onClick={() => clickAddDeadline(2, 'time')}>
                                <FoamBox>
                                    <button className={styles.button}>下周</button>
                                </FoamBox>
                            </div>
                            <div></div>
                            <div>
                                <FoamBox>
                                    <input type='date' className={styles.button}/>
                                </FoamBox>
                            </div>
                        </div>
                        :
                        <div onClick={() => reset(1)} className={styles.operateContainer}>
                            <FoamBox>
                                <div className={styles.select}>
                                    添加截至时间
                                </div>
                            </FoamBox>
                            <div></div>
                        </div>
                }

                {
                    addRemind ?
                        <div className={styles.operateContainer}>
                            <FoamBox>
                                <div className={styles.select}>
                                    提醒我
                                </div>
                            </FoamBox>
                            <div onClick={() => clickAddRemind(0, 'time')}>
                                <FoamBox>
                                    <button className={styles.button}>今天晚些时候</button>
                                </FoamBox>
                            </div>
                            <div></div>
                            <div onClick={() => clickAddRemind(1, 'time')}>
                                <FoamBox>
                                    <button className={styles.button}>明天 9:00</button>
                                </FoamBox>
                            </div>
                            <div></div>
                            <div onClick={() => clickAddRemind(2, 'time')}>
                                <FoamBox>
                                    <button className={styles.button}>下周一 9:00</button>
                                </FoamBox>
                            </div>
                            <div></div>
                            <div>
                                <FoamBox>
                                    <input type='datetime-local' className={styles.button}/>
                                </FoamBox>
                            </div>
                        </div>
                        :
                        <div onClick={() => reset(2)} className={styles.operateContainer}>
                            <FoamBox>
                                <div className={styles.select}>
                                    提醒我
                                </div>
                            </FoamBox>
                            <div></div>
                        </div>
                }

                {
                    useRepeat ?
                        <div className={styles.operateContainer}>
                            <FoamBox>
                                <div className={styles.select}>
                                    重复
                                </div>
                            </FoamBox>
                            <div onClick={() => clickUseRepeat(0, 'time')}>
                                <FoamBox>
                                    <button className={styles.button}>每天</button>
                                </FoamBox>
                            </div>
                            <div></div>
                            <div onClick={() => clickUseRepeat(1, 'time')}>
                                <FoamBox>
                                    <button className={styles.button}>工作日</button>
                                </FoamBox>
                            </div>
                            <div></div>
                            <div onClick={() => clickUseRepeat(2, 'time')}>
                                <FoamBox>
                                    <button className={styles.button}>每周</button>
                                </FoamBox>
                            </div>
                            <div></div>
                            <div onClick={() => clickUseRepeat(3, 'time')}>
                                <FoamBox>
                                    <button className={styles.button}>每月</button>
                                </FoamBox>
                            </div>
                            <div></div>
                            <div onClick={() => clickUseRepeat(4, 'time')}>
                                <FoamBox>
                                    <button className={styles.button}>每年</button>
                                </FoamBox>
                            </div>
                            <div></div>
                            <div onClick={() => clickUseRepeat(5, 'time')}>
                                <FoamBox>
                                    <button className={styles.button}>自定义</button>
                                </FoamBox>
                            </div>
                        </div>
                        :
                        <div onClick={() => reset(3)} className={styles.operateContainer}>
                            <FoamBox>
                                <div className={styles.select}>
                                    重复
                                </div>
                            </FoamBox>
                            <div></div>
                        </div>
                }

                <FoamBox>
                    <span>备注:</span>
                </FoamBox>
                <FoamBox>
                    <textarea rows="5" cols="33" className={styles.textarea}/>
                </FoamBox>
                <FoamBox>
                    <button className={styles.button} onClick={() => closeAndReset()}>
                        Close
                    </button>
                </FoamBox>
            </div>
        </div>
    } else {
        return <></>;
    }
}