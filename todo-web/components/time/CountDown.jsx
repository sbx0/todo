import moment from "moment";
import {useEffect, useState} from "react";

export default function CountDown({time}) {
    const [left, setLeft] = useState(calLeft(moment.now(), moment(time)));

    useEffect(() => {
        const timer = setInterval(() => {
            setLeft(calLeft(moment.now(), moment(time)))
        }, 60000);
        return () => clearInterval(timer);
    }, [time]);

    function calLeft(from, to) {
        let duration = moment.duration(to - from);
        if (duration.asSeconds() > 0) {
            if (duration.asDays() === 0) {
                return '今天';
            } else if (duration.asDays() === 1) {
                return '明天';
            } else if (duration.asDays() <= (7 - moment(from).day())) {
                return getWeek(to);
            } else if (duration.asDays() <= (14 - moment(from).day())) {
                return '下' + getWeek(to);
            } else {
                return duration.asDays().toFixed(0) + ' 天';
            }
        } else {
            return "已超时"
        }
    }

    function getWeek(date) {
        let week = moment(date).day()
        switch (week) {
            case 1:
                return '周一'
            case 2:
                return '周二'
            case 3:
                return '周三'
            case 4:
                return '周四'
            case 5:
                return '周五'
            case 6:
                return '周六'
            case 0:
                return '周日'
        }
    }

    return <span title={time}>
        {left}
    </span>;
}