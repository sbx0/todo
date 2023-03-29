import moment from "moment";
import 'moment/locale/zh-cn';
import Container from "../../../components/Container";
import {useEffect, useState} from "react";

moment.locale('zh-cn');
export default function TaskCalendarView({}) {
    const [weeks, setWeeks] = useState([]);

    useEffect(() => {
        let todayIndex = moment().format('E');
        let monday = moment().subtract(todayIndex - 1, 'days');
        let newWeek = []
        for (let i = 0; i < 14; i++) {
            let oneNewWeek = []
            for (let j = 0; j < 7; j++) {
                oneNewWeek[j] = moment(monday).add(i * 7 + j, 'days').format('MM-DD');
            }
            newWeek[i] = oneNewWeek;
        }
        setWeeks(newWeek);
    }, [])

    return (
        <>
            <Container>
                <div className="week">
                    <div className="header">周一</div>
                    <div className="header">周二</div>
                    <div className="header">周三</div>
                    <div className="header">周四</div>
                    <div className="header">周五</div>
                    <div className="header">周六</div>
                    <div className="header">周日</div>
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