import {useEffect, useRef, useState} from "react";
import FoamBox from "../layout/FoamBox";
import {SelectBox} from "../layout/SelectBox";
import FormatTime from "../time/FormatTime";
import moment from "moment/moment";
import 'moment/locale/zh-cn';
import CountDown from "../time/CountDown";
import RecordTime from "../asset/RecordTime";
import Button from "../basic/Button";
import TextArea from "../basic/TextArea";

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
        return <div className="container">
            <div ref={modelRef} className="innerContainer">
                <FoamBox>
                    <span>名称</span>
                </FoamBox>
                <FoamBox>
                    <TextArea rows="2"
                              defaultValue={task?.taskName}
                              onChange={(event) => {
                                  setTask({
                                      ...task,
                                      taskName: event.target.value
                                  })
                              }}/>
                </FoamBox>

                <SelectBox index={1}
                           title={'计划时间'}
                           show={planTimeShow}
                           click={setDeadline}
                           reset={reset}
                           options={deadlineOptions}
                           other={
                               <div>
                                   <FoamBox>
                                       <RecordTime value={moment(task.planTime).format('yyyy-MM-DD')}
                                                   callback={(value) => {
                                                       task.planTime = value + ' 23:59:59';
                                                       setTask(task);
                                                       change(task);
                                                   }}/>
                                       <input type="time"
                                              value={moment(task.planTime).format('HH:mm')}
                                              onChange={(event) => {
                                                  if (task.planTime != null) {
                                                      task.planTime = moment(task.planTime).format('yyyy-MM-DD ') + event.target.value + ':59';
                                                      setTask(task);
                                                      change(task);
                                                  } else {
                                                      task.planTime = moment().format('yyyy-MM-DD ') + event.target.value + ':59';
                                                      setTask(task);
                                                      change(task);
                                                  }
                                              }}
                                              className="button"/>
                                   </FoamBox>
                               </div>
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
                                   <input type="datetime-local" className="button"/>
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
                                   <button className="button">自定义</button>
                               </FoamBox>
                           }
                />

                <FoamBox>
                    <span>备注</span>
                </FoamBox>
                <FoamBox>
                    <TextArea rows="5"
                              defaultValue={task?.taskRemark}
                              onChange={(event) => {
                                  setTask({
                                      ...task,
                                      taskRemark: event.target.value
                                  })
                              }}/>
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
                    <Button onClick={() => change(task)}>
                        保存
                    </Button>
                </FoamBox>
            </div>
            <style jsx>{`
              .container {
                position: fixed;
                top: 0;
                left: 0;
                width: 100vw;
                height: 100vh;
                overflow-y: auto;
                overflow-x: hidden;
                background-color: rgba(19, 19, 19, 0.82);
                z-index: 10;
              }

              .container::-webkit-scrollbar-track {
                -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
                border-radius: 10px;
                background-color: rgba(245, 245, 245, 0);
              }

              .container::-webkit-scrollbar {
                width: 5px;
                height: 5px;
                background-color: rgba(245, 245, 245, 0);
              }

              .container::-webkit-scrollbar-thumb {
                border-radius: 10px;
                -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, .3);
                background-color: #555;
              }

              .innerContainer {
                max-width: 750px;
                height: max-content;
                overflow: auto;
                width: 90vw;
                margin: 20px auto;
                padding: 10px;
                border: 1px solid rgba(255, 255, 255, 0.16);
                border-radius: 5px;
                background-color: rgb(19, 19, 19)
              }

              .operateContainer {
                display: grid;
                grid-template-columns: 1fr 1fr;
                text-align: center;
              }

              .fullWidthPadding {
                width: 100%;
                padding: 10px 5px 0 5px;
              }

              .select {
                width: 100%;
                height: 40px;
                line-height: 40px;
                font-size: 16px;
                text-align: center;
                background-color: #262626;
              }

              .textarea {
                width: 100%;
                font-size: 16px;
                padding: 10px;;
              }

              .text {
                width: 100%;
                font-size: 16px;
                height: 40px;
                line-height: 24px;
                padding-left: 10px;
                padding-right: 10px;
              }

              .button {
                width: 100%;
                height: 40px;
                line-height: 34px;
                font-size: 16px;
                text-align: center;
              }
            `}</style>
        </div>
    } else {
        return <></>;
    }
}