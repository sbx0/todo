import styles from "./Model.module.css";
import {useEffect, useState} from "react";
import FoamBox from "../layout/FoamBox";
import {SelectBox} from "../layout/SelectBox";
import FormatTime from "../time/FormatTime";

export default function Model({show, close, change, data}) {
    const [task, setTask] = useState(data);
    const [deadlineShow, setDeadlineShow] = useState(false);
    const [addRemind, setAddRemind] = useState(false);
    const [useRepeat, setUseRepeat] = useState(false);

    useEffect(() => {
        setTask(data);
    }, [show]);

    function reset(index = 0) {
        setDeadlineShow(index === 1);
        setAddRemind(index === 2);
        setUseRepeat(index === 3);
    }

    function closeAndReset() {
        reset();
        close();
    }

    if (show) {
        return <div className={styles.container}>
            <div className={styles.innerContainer}>

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
                           title={'添加截至时间'}
                           show={deadlineShow}
                           reset={reset}
                           options={[
                               {key: 1, name: '今天', value: 'today'},
                               {key: 2, name: '明天', value: 'tomorrow'},
                               {key: 3, name: '下周', value: 'next week'},
                           ]}
                           other={
                               <FoamBox>
                                   <input type="date" className={styles.button}/>
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

                <FoamBox>
                    <span>创建于</span>
                    <span>&nbsp;<FormatTime time={task?.createTime}/></span>
                </FoamBox>

                <FoamBox>
                    <button className={styles.button} onClick={() => change(task)}>
                        Save
                    </button>
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