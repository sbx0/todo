import moment from "moment";
import 'moment/locale/zh-cn';
import Container from "../../../components/Container";
import {useEffect, useState} from "react";

moment.locale('zh-cn');

export function calculateWeeks(now, days = 1) {
    let todayIndex = moment(now).format('E');
    let monday = moment(now).subtract(todayIndex - 1, 'days');
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
    const headerWeeks = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];
    const [weeks, setWeeks] = useState([]);

    useEffect(() => {
        setWeeks(calculateWeeks(moment(), 14));
    }, [])

    return (
        <>
            <Container>
                <div className="week">
                    {headerWeeks.map((week, index) => <div key={index} className="header">{week}</div>)}
                </div>
                {weeks.map((week, index) => <div key={index} className="week">
                    {week.map((day, index) => <div key={index} className="day">
                        {day}
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

              .day {
                height: 100px;
                border: 1px solid #004b0d;
                margin: 1px;
              }
            `}</style>
        </>
    );
}