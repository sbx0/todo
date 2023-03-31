import {useState} from "react";
import moment from "moment";
import FoamBox from "../layout/FoamBox";
import TextArea from "../basic/TextArea";
import {SelectBox} from "../layout/SelectBox";
import RecordTime from "../asset/RecordTime";
import CountDown from "../time/CountDown";
import FormatTime from "../time/FormatTime";
import Button from "../basic/Button";

export default function TaskDetail({data, change}) {
    const [task, setTask] = useState(data);
    const [planTimeShow, setPlanTimeShow] = useState(false);
    const deadlineOptions = [
        {key: 1, name: '今天', value: 'today'},
        {key: 2, name: '明天', value: 'tomorrow'},
        {key: 3, name: '下周', value: 'next week'},
    ];

    function setDeadline(key) {
        switch (key) {
            case 1:
                // today 23:59:59
                task.planTime = moment().format('yyyy-MM-DD') + ' 23:59:59';
                break;
            case 2:
                // tomorrow 23:59:59
                task.planTime = moment().add(1, 'days').format('yyyy-MM-DD') + ' 23:59:59';
                break;
            case 3:
                // next week
                let monday = moment().startOf('week');
                let nextMonday = monday.add(1, 'weeks').format('yyyy-MM-DD') + ' 23:59:59';
                task.planTime = nextMonday;
                break;
            default:
                break;
        }
        setTask(task);
        change(task);
    }

    const [addRemind, setAddRemind] = useState(false);

    function setReminderTime(key) {
        switch (key) {
            case 1:
                // reminder later
                task.reminderTime = moment().add(1, 'hours').format('yyyy-MM-DD HH:mm:ss');
                console.log('reminder later', task.reminderTime);
                break;
            case 2:
                // after go off work
                task.reminderTime = moment().format('yyyy-MM-DD') + ' 18:35:00';
                console.log('after go off work', task.reminderTime);
                break;
            case 3:
                // before sleep
                task.reminderTime = moment().format('yyyy-MM-DD') + ' 22:00:00';
                console.log('before sleep', task.reminderTime);
                break;
            case 4:
                // after get up
                task.reminderTime = moment().add(1, 'days').format('yyyy-MM-DD') + ' 08:15:00';
                console.log('after get up', task.reminderTime);
                break;
            case 5:
                // tomorrow
                task.reminderTime = moment().add(1, 'days').format('yyyy-MM-DD') + ' 09:15:00';
                console.log('tomorrow', task.reminderTime);
                break;
            case 6:
                // next monday
                let monday = moment().startOf('week');
                let nextMonday = monday.add(1, 'weeks').format('yyyy-MM-DD') + ' 08:15:00';
                task.reminderTime = nextMonday;
                console.log('next monday', task.reminderTime);
                break;
            default:
                break;
        }
        setTask(task);
        change(task);
    }

    const [useRepeat, setUseRepeat] = useState(false);

    function reset(index = 0) {
        setPlanTimeShow(index === 1);
        setAddRemind(index === 2);
        setUseRepeat(index === 3);
    }

    return <>
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
                   click={setReminderTime}
                   reset={reset}
                   options={[
                       {key: 1, name: '稍后', value: 'reminder later'},
                       {key: 2, name: '下班后', value: 'after go off work'},
                       {key: 3, name: '睡前', value: 'before sleep'},
                       {key: 4, name: '起床后', value: 'after get up'},
                       {key: 5, name: '明天', value: 'tomorrow'},
                       {key: 6, name: '下周', value: 'next monday'},
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
        <style jsx>{`
          .button {
            width: 100%;
            height: 40px;
            line-height: 34px;
            font-size: 16px;
            text-align: center;
          }
        `}</style>
    </>;
}