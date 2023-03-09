import styles from "./Model.module.css";
import {useState} from "react";
import FoamBox from "../layout/FoamBox";
import {SelectBox} from "../layout/SelectBox";
import FormatTime from "../time/FormatTime";

export default function Model({show, close, data}) {
    const [deadlineShow, setDeadlineShow] = useState(false);
    const [addRemind, setAddRemind] = useState(false);
    const [useRepeat, setUseRepeat] = useState(false);

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
                    <input type='text'
                           defaultValue={data?.taskName}
                           className={styles.text}/>
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
                              cols="33"
                              defaultValue={data?.taskRemark}
                              className={styles.textarea}/>
                </FoamBox>

                <FoamBox>
                    <span>创建于</span>
                    <span>&nbsp;<FormatTime time={data?.createTime}/></span>
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