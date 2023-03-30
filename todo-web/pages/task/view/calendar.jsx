import {useEffect, useState} from "react";
import Container from "../../../components/Container";
import moment from "moment";
import 'moment/locale/zh-cn';
import useTask from "../../../hooks/useTask";
import NavigationBar from "../../../components/NavigationBar";

const weekNames = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];

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

export function calculateWeeks(now, days = 1) {
    let todayIndex = getWeekIndex(now);
    let monday = moment(now).subtract(todayIndex, 'days');
    let newWeek = [];
    for (let i = 0; i < days; i++) {
        let oneNewWeek = [];
        for (let j = 0; j < 7; j++) {
            oneNewWeek[j] = moment(monday).add(i * 7 + j, 'days').format('yyyy-MM-DD');
        }
        newWeek[i] = oneNewWeek;
    }
    return newWeek;
}

export default function TaskCalendarView() {
    const showDays = 14;
    const weeks = calculateWeeks(moment(), showDays);
    const {response: taskResponse} = useTask(1, 100, 0, 0);
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
                <div className="week">
                    {weekNames.map((week, index) => <div key={index} className="header">{week}</div>)}
                </div>
                {weeks.map((week, index) => <div key={index} className="week">
                    {week.map((day, index) => <div key={index}>
                        <DayView day={day} dayTasks={dayTasks}/>
                    </div>)}
                </div>)}
                <NavigationBar active={1}/>
            </Container>
            <style jsx>{`
              .week {
                width: 100%;
                text-align: center;
                display: grid;
                grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr 1fr;
              }

              .header {
                border: 1px solid #004b0d;
                margin: 1px;
              }
            `}</style>
        </>
    );
}

function DayView({day, dayTasks}) {
    const format = moment(day).format('MM-DD')
    const isWeekendFlag = isWeekend(day);
    const isTodayFlag = isToday(day);
    const [tasks, setTasks] = useState([]);

    useEffect(() => {
        setTasks(dayTasks.get(day))
    }, [dayTasks]);

    return <>
        <div className={`normal ${isWeekendFlag ? 'weekend' : ''} ${isTodayFlag ? 'today' : ''}`}>
            <div>
                {format}
            </div>
            <div>
                {tasks?.length}
            </div>
        </div>
        <style jsx>{`
          .normal {
            background: #262a2d;
            margin: 1px;
            border: 3px;
            min-height: max-content;
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