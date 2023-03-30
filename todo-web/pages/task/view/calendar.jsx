import Container from "../../../components/Container";
import moment from "moment";
import 'moment/locale/zh-cn';

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

    return (
        <>
            <Container>
                <div className="week">
                    {weekNames.map((week, index) => <div key={index} className="header">{week}</div>)}
                </div>
                {weeks.map((week, index) => <div key={index} className="week">
                    {week.map((day, index) => <div key={index}>
                        <DayView day={day}/>
                    </div>)}
                </div>)}
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

function DayView({day}) {
    const isWeekendFlag = isWeekend(day);
    const isTodayFlag = isToday(day);

    return <>
        <div>
            {JSON.stringify(isTodayFlag)}
            {JSON.stringify(isWeekendFlag)}
        </div>
        <style jsx>{`
        `}</style>
    </>
}