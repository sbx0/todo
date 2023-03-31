import {useEffect, useState} from "react";
import Container from "../../../components/Container";
import moment from "moment";
import 'moment/locale/zh-cn';
import useTask from "../../../hooks/useTask";
import NavigationBar from "../../../components/NavigationBar";
import Model from "../../../components/model/Model";
import TaskItem from "../../../components/task/TaskItem";
import {changeTask} from "../../../components/TaskPage";
import Loading from "../../../components/Loading";

export function isMonthStart(time) {
    return moment(time).format('DD') === '01';
}

export function isToday(time) {
    return moment().format('yyyy-MM-DD') === moment(time).format('yyyy-MM-DD');
}

export function isWeekend(time) {
    const week = [5, 6];
    return week.indexOf(getWeekIndex(time)) !== -1;
}

export function getWeekIndex(time) {
    return parseInt(moment(time).format('E')) - 1;
}

export function calculateWeeks(now, weeks = 1) {
    let todayIndex = getWeekIndex(now);
    let monday = moment(now).subtract(todayIndex, 'days');
    let newWeek = new Array(weeks);
    for (let i = 0; i < weeks; i++) {
        newWeek[i] = new Array(7).fill('');
    }
    let addDays = 0;
    let lastDay = monday;
    for (let i = 0; i < weeks; i++) {
        for (let j = 0; j < 7; j++) {
            let day = moment(monday).add(addDays++, 'days');
            if (lastDay.format('MM') !== day.format('MM')) {
                if (j === 0) {
                    i++;
                } else {
                    i += 2;
                }
            }
            if (i >= weeks) {
                break;
            }
            newWeek[i][j] = day.format('yyyy-MM-DD');
            lastDay = day;
        }
    }
    return newWeek;
}

export default function TaskCalendarView() {
    const showWeeks = 60;
    const weeks = calculateWeeks(moment(), showWeeks);
    const {response: taskResponse, isLoading, mutate} = useTask(1, 100, 0, 0);
    const [dayTasks, setDayTasks] = useState(new Map());

    function calculateDayTask(tasks) {
        if (tasks == null) {
            return;
        }
        let newDayTask = new Map();
        for (let i = 0; i < tasks.length; i++) {
            let task = tasks[i];
            if (task.planTime != null) {
                let key = moment(task.planTime).format('yyyy-MM-DD').toString();
                let cache = newDayTask.get(key);
                if (cache == null) {
                    cache = [];
                }
                cache.push(task);
                newDayTask.set(key, cache);
                setDayTasks(newDayTask);
            }
        }
    }

    useEffect(() => {
        calculateDayTask(taskResponse?.data);
    }, [taskResponse]);

    return (
        <>
            <Container>
                {weeks.map((week, index) => <div key={index} className="week">
                    {week.map((day, index) => <div key={index}>
                        <DayView day={day} dayTasks={dayTasks}
                                 refreshData={mutate}/>
                    </div>)}
                </div>)}
                <Loading active={isLoading}/>
                <NavigationBar active={1}/>
            </Container>
            <style jsx>{`
              .week {
                width: 100%;
                display: grid;
                grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr 1fr;
              }

              .header {
                height: 25px;
                background: #00340a;
                border-radius: 5px;
                margin: 3px;
                text-align: center;
              }
            `}</style>
        </>
    );
}

function DayView({day, dayTasks, refreshData}) {
    if (day === '') {
        return <>
            <div className="week"></div>
            <style jsx>{`
              .week {
                width: 100%;
                height: 15px;
              }
            `}</style>
        </>
    }

    const format = isMonthStart(day) ? parseInt(moment(day).format('MM')) + ' 月' : parseInt(moment(day).format('DD'));
    const isWeekendFlag = isWeekend(day);
    const isTodayFlag = isToday(day);
    const [tasks, setTasks] = useState([]);
    const [modalShow, setModalShow] = useState(false);

    useEffect(() => {
        setTasks(dayTasks.get(day))
    }, [dayTasks]);

    return <>
        <div onClick={() => {
            if (tasks?.length > 0) {
                setModalShow(true)
            }
        }}
             className={`normal ${isWeekendFlag ? 'weekend' : ''} ${isTodayFlag ? 'today' : ''}`}>
            <div className="textCenteredVertically">
                {format}
            </div>
            {
                tasks?.length > 0 ?
                    <div className="cornerLabels">
                        <div className="textCenterParent">
                            <div className="textCenteredVertically">
                                {tasks?.length}
                            </div>
                        </div>
                    </div>
                    :
                    <></>
            }
        </div>
        <Model show={modalShow} close={() => {
            setModalShow(false);
            refreshData();
        }}>
            {tasks?.map((one) =>
                <TaskItem key={'taskInfo_' + one.id + '_' + one.createTime + one.updateTime}
                          one={one}
                          change={changeTask}/>)}
        </Model>
        <style jsx>{`
          .normal {
            background: #262a2d;
            margin: 3px;
            height: 45px;
            border-radius: 5px;
            text-align: center;
            cursor: pointer;
            position: relative;
            font-size: 13px;
            line-height: 13px;
          }

          .textCenteredVertically {
            width: 100%;
            position: absolute;
            top: 50%;
            transform: translateY(-50%);
          }

          .textCenterParent {
            width: 100%;
            height: 100%;
            position: relative;
            text-align: center;
          }

          .cornerLabels {
            position: absolute;
            top: -10%;
            right: -10%;
            background: #f50000;
            font-size: 10px;
            line-height: 10px;
            width: 15px;
            height: 15px;
            border-radius: 5px;
            font-weight: bold;
          }

          .weekend {
            background: #064813;
          }

          .today {
            background: #0c8a25;
          }
        `}</style>
    </>
}