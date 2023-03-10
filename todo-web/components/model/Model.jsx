import styles from "./Model.module.css";
import {useEffect, useRef, useState} from "react";
import FoamBox from "../layout/FoamBox";
import {SelectBox} from "../layout/SelectBox";
import FormatTime from "../time/FormatTime";
import moment from "moment/moment";
import 'moment/locale/zh-cn';
import CountDown from "../time/CountDown";

export default function Model({show, close, change, data}) {
    const [task, setTask] = useState(data);
    const [planTimeShow, setPlanTimeShow] = useState(false);
    const deadlineOptions = [
        {key: 1, name: '今天', value: 'today'},
        {key: 2, name: '明天', value: 'tomorrow'},
        {key: 3, name: '下周', value: 'next week'},
    ];
    const modelRef = useRef(null);
    const closeModel = (e) => {
        if (modelRef.current && show && !modelRef.current.contains(e.target)) {
            closeAndReset();
        }
    }

    // just for next.js
    if (typeof document !== 'undefined') {
        document.addEventListener('mousedown', closeModel);
    }

    function setDeadline(key) {
        switch (key) {
            case 1:
                // today 23:59:59
                task.planTime = moment().format('yyyy-MM-DD') + ' 23:59:59';
                setTask(task);
                change(task);
                return;
            case 2:
                // tomorrow 23:59:59
                task.planTime = moment().add(1, 'days').format('yyyy-MM-DD') + ' 23:59:59';
                setTask(task);
                change(task);
                return;
            case 3:
                // next week
                let monday = moment().startOf('week');
                let nextMonday = monday.add(1, 'weeks').format('yyyy-MM-DD') + ' 23:59:59';
                task.planTime = nextMonday;
                setTask(task);
                change(task);
                return;
            default:
                return;
        }
    }

    const [addRemind, setAddRemind] = useState(false);
    const [useRepeat, setUseRepeat] = useState(false);

    useEffect(() => {
        setTask(data);
    }, [show]);

    function reset(index = 0) {
        setPlanTimeShow(index === 1);
        setAddRemind(index === 2);
        setUseRepeat(index === 3);
    }

    function closeAndReset() {
        reset();
        close();
    }

    if (show) {
        return <div className={styles.container}>
            <div ref={modelRef} className={styles.innerContainer}>

                <FoamBox>
                    <span>名称</span>
                </FoamBox>
                <FoamBox>
                    <textarea rows="2"
                              defaultValue={task?.taskName}
                              onChange={(event) => {
                                  setTask({
                                      ...task,
                                      taskName: event.target.value
                                  })
                              }}
                              className={styles.textarea}/>
                </FoamBox>

                <SelectBox index={1}
                           title={'计划时间'}
                           show={planTimeShow}
                           click={setDeadline}
                           reset={reset}
                           options={deadlineOptions}
                           other={
                               <FoamBox>
                                   <input type="date"
                                          onChange={(event) => {
                                              task.planTime = event.target.value + ' 23:59:59';
                                              setTask(task);
                                              change(task);
                                          }}
                                          className={styles.button}/>
                               </FoamBox>
                           }
                />

                <SelectBox index={2}
                           title={'提醒我'}
                           show={addRemind}
                           reset={reset}
                           options={[
                               {key: 1, name: '今天晚些时候', value: 'later today'},
                               {key: 2, name: '明天 9:00', value: 'tomorrow at 9:00'},
                               {key: 3, name: '下周一 9:00', value: 'next monday at 9:00'},
                           ]}
                           other={
                               <FoamBox>
                                   <input type="datetime-local" className={styles.button}/>
                               </FoamBox>
                           }
                />

                <SelectBox index={3}
                           title={'重复'}
                           show={useRepeat}
                           reset={reset}
                           options={[
                               {key: 1, name: '每天', value: 'every day'},
                               {key: 2, name: '工作日', value: 'weekday'},
                               {key: 3, name: '每周', value: 'every week'},
                               {key: 4, name: '每月', value: 'every month'},
                               {key: 5, name: '每年', value: 'every year'},
                           ]}
                           other={
                               <FoamBox>
                                   <button className={styles.button}>自定义</button>
                               </FoamBox>
                           }
                />

                <FoamBox>
                    <span>备注</span>
                </FoamBox>
                <FoamBox>
                    <textarea rows="5"
                              defaultValue={task?.taskRemark}
                              onChange={(event) => {
                                  setTask({
                                      ...task,
                                      taskRemark: event.target.value
                                  })
                              }}
                              className={styles.textarea}/>
                </FoamBox>

                {
                    task.planTime != null ?
                        <FoamBox>
                            <span>计划时间</span>
                            <span>&nbsp;<CountDown time={task?.planTime}/></span>
                        </FoamBox>
                        :
                        <></>
                }

                <FoamBox>
                    <span>创建于</span>
                    <span>&nbsp;<FormatTime time={task?.createTime}/></span>
                </FoamBox>

                <FoamBox>
                    <button className={styles.button} onClick={() => change(task)}>
                        Save
                    </button>
                </FoamBox>
            </div>
        </div>
    } else {
        return <></>;
    }
}